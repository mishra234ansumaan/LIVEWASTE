import { useState, useRef, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Scan,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Trash2,
  Brain,
  Eye,
  Zap,
  Target,
  Activity,
  BarChart3,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';

interface ScanResult {
  condition: 'critical' | 'warning' | 'normal' | 'empty';
  fillLevel: number;
  wasteType: string[];
  confidence: number;
  location: string;
  timestamp: string;
  recommendations: string[];
}

const SCAN_LOCATIONS = [
  'Khetrajpur Market - Bin #A12',
  'Ainthapali Square - Bin #B07',
  'Fatak Chowk - Bin #C03',
  'Dhanupali Area - Bin #D15',
  'Burla Main Road - Bin #E02',
];

type PixelAnalysis = {
  fillLevel: number;
  avgBrightness: number;
  contentRatio: number;
  warmRatio: number;
  coolRatio: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/** Estimates dustbin fill from image pixels (lower region = bin interior). */
function analyzeImagePixels(img: HTMLImageElement): PixelAnalysis {
  const width = 160;
  const height = 160;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { fillLevel: 0, avgBrightness: 255, contentRatio: 0, warmRatio: 0, coolRatio: 0 };
  }

  ctx.drawImage(img, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  const topEnd = Math.floor(height * 0.32);
  let topContent = 0;
  let topPixels = 0;
  let bottomContent = 0;
  let bottomPixels = 0;
  let brightnessSum = 0;
  let warmContent = 0;
  let coolContent = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;

      const isWastePixel =
        brightness < 118 || (saturation > 0.22 && brightness < 178);

      if (y < topEnd) {
        topPixels++;
        if (isWastePixel) topContent++;
      } else {
        bottomPixels++;
        brightnessSum += brightness;
        if (isWastePixel) {
          bottomContent++;
          if (r > g + 15 && r > b + 10 && brightness < 160) warmContent++;
          if (b > r + 10 && b > g + 5 && brightness < 170) coolContent++;
        }
      }
    }
  }

  const bottomRatio = bottomPixels > 0 ? bottomContent / bottomPixels : 0;
  const topRatio = topPixels > 0 ? topContent / topPixels : 0;
  const avgBrightness = bottomPixels > 0 ? brightnessSum / bottomPixels : 255;
  const contentRatio = bottomRatio;

  let fillScore = bottomRatio * 0.78 + topRatio * 0.22;
  if (topRatio > 0.2) fillScore += 0.12;

  if (avgBrightness > 135 && bottomRatio < 0.1) {
    fillScore = Math.min(fillScore, 0.06);
  }
  if (avgBrightness > 125 && bottomRatio < 0.15) {
    fillScore = Math.min(fillScore, 0.12);
  }
  if (bottomRatio > 0.45 && avgBrightness < 110) {
    fillScore = Math.max(fillScore, 0.72);
  }
  if (bottomRatio > 0.55) {
    fillScore = Math.max(fillScore, 0.82);
  }
  if (bottomRatio > 0.65 || (bottomRatio > 0.5 && topRatio > 0.25)) {
    fillScore = Math.max(fillScore, 0.9);
  }

  const fillLevel = Math.round(Math.min(99, Math.max(0, fillScore * 100)));

  return {
    fillLevel,
    avgBrightness,
    contentRatio: bottomRatio,
    warmRatio: bottomContent > 0 ? warmContent / bottomContent : 0,
    coolRatio: bottomContent > 0 ? coolContent / bottomContent : 0,
  };
}

function buildScanResult(analysis: PixelAnalysis): ScanResult {
  const { fillLevel, avgBrightness, contentRatio, warmRatio, coolRatio } = analysis;
  const location = SCAN_LOCATIONS[Math.floor(Math.random() * SCAN_LOCATIONS.length)];
  const timestamp = new Date().toLocaleString();

  let condition: ScanResult['condition'];
  let wasteType: string[];
  let recommendations: string[];
  let confidence: number;

  if (fillLevel <= 15 && avgBrightness > 120) {
    condition = 'empty';
    wasteType = ['No waste detected'];
    recommendations = [
      'Dustbin is clean — no waste found',
      'No collection required at this time',
      'Continue regular monitoring schedule',
    ];
    confidence = Math.min(98, 88 + Math.round((1 - contentRatio) * 10));
  } else if (fillLevel >= 80) {
    condition = 'critical';
    wasteType = inferWasteTypes(warmRatio, coolRatio, true);
    recommendations = [
      'Immediate collection required — bin near capacity or overflowing',
      'Alert waste management team now',
      'Schedule emergency pickup within 2 hours',
    ];
    confidence = Math.min(97, 85 + Math.round(contentRatio * 12));
  } else if (fillLevel >= 55) {
    condition = 'warning';
    wasteType = inferWasteTypes(warmRatio, coolRatio, false);
    recommendations = [
      'Bin is filling up — schedule pickup within 24 hours',
      'Monitor fill level closely',
      'Notify assigned collection worker',
    ];
    confidence = Math.min(94, 80 + Math.round(contentRatio * 14));
  } else {
    condition = 'normal';
    wasteType = inferWasteTypes(warmRatio, coolRatio, false);
    recommendations = [
      'Moderate waste level detected',
      'Regular collection schedule is sufficient',
      'Re-scan after 24–48 hours',
    ];
    confidence = Math.min(92, 78 + Math.round(contentRatio * 12));
  }

  return {
    condition,
    fillLevel,
    wasteType,
    confidence,
    location,
    timestamp,
    recommendations,
  };
}

function inferWasteTypes(warmRatio: number, coolRatio: number, heavy: boolean): string[] {
  const types: string[] = [];
  if (warmRatio > 0.2) types.push('Food / Organic waste');
  if (coolRatio > 0.15) types.push('Plastic');
  if (types.length === 0 && heavy) {
    types.push('Mixed municipal waste', 'Paper / General waste');
  } else if (types.length === 0) {
    types.push('General waste');
  }
  if (heavy && types.length < 3) types.push('Overflow debris');
  return types;
}

async function analyzeDustbinImage(imageSrc: string): Promise<ScanResult> {
  const img = await loadImage(imageSrc);
  const analysis = analyzeImagePixels(img);
  return buildScanResult(analysis);
}

const SCAN_DELAY_MS = 2200;

export function AIScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = async (imageSrc: string) => {
    setIsScanning(true);
    setScanResult(null);

    await new Promise((resolve) => setTimeout(resolve, SCAN_DELAY_MS));

    try {
      const result = await analyzeDustbinImage(imageSrc);
      setScanResult(result);
      setScanHistory((prev) => [result, ...prev.slice(0, 4)]);
    } catch {
      alert('Could not analyze this image. Please try another photo.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = () => {
    if (!capturedImage) {
      alert('Please upload a dustbin photo first, then tap Start AI Scan.');
      return;
    }
    void runAnalysis(capturedImage);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
      setScanResult(null);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'critical':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'normal':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'empty':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getConditionLabel = (condition: ScanResult['condition']) => {
    if (condition === 'empty') return 'CLEAN — NO WASTE';
    return condition.toUpperCase();
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <Clock className="h-5 w-5" />;
      case 'normal':
        return <Eye className="h-5 w-5" />;
      case 'empty':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Scan className="h-5 w-5" />;
    }
  };

  const getFillLevelColor = (level: number) => {
    if (level >= 80) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (level >= 55) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    if (level >= 25) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-green-500 to-emerald-500';
  };

  const criticalCount = scanHistory.filter((s) => s.condition === 'critical').length;
  const avgConfidence =
    scanHistory.length > 0
      ? Math.round(scanHistory.reduce((sum, s) => sum + s.confidence, 0) / scanHistory.length)
      : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Vision Scanner</h1>
            <p className="text-indigo-100">Smart dustbin analysis from your photo</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur">
            <Brain className="h-4 w-4 mr-1" />
            Vision Analysis
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Dustbin Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl h-96 flex items-center justify-center overflow-hidden">
                  {isScanning ? (
                    <div className="text-center text-white px-4">
                      <RefreshCw className="h-16 w-16 animate-spin text-indigo-400 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Analyzing dustbin photo...</p>
                      <p className="text-sm text-gray-400">Estimating fill level and waste content</p>
                    </div>
                  ) : capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured dustbin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 px-4">
                      <Camera className="h-24 w-24 mb-4 mx-auto" />
                      <p className="text-lg font-medium">No photo yet</p>
                      <p className="text-sm">Upload a dustbin image, then tap Start AI Scan</p>
                    </div>
                  )}
                </div>
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleScan}
                  disabled={isScanning || !capturedImage}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg px-8"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  {isScanning ? 'Scanning...' : 'Start AI Scan'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="border border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  aria-label="Upload dustbin image"
                  title="Upload dustbin image"
                  className="hidden"
                />
                {capturedImage && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCapturedImage(null);
                      setScanResult(null);
                    }}
                    disabled={isScanning}
                    className="border border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {scanResult && (
            <Card className="bg-white shadow-xl border-0">
              <CardHeader
                className={`text-white rounded-t-xl ${
                  scanResult.condition === 'empty'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : scanResult.condition === 'critical'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
              >
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className={getConditionColor(scanResult.condition)}>
                        {getConditionIcon(scanResult.condition)}
                        <span className="ml-2">{getConditionLabel(scanResult.condition)}</span>
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm text-gray-600">{scanResult.confidence}% Confidence</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Fill Level</span>
                        <span className="text-lg font-bold text-gray-900">{scanResult.fillLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${getFillLevelColor(scanResult.fillLevel)}`}
                          style={{ width: `${scanResult.fillLevel}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {scanResult.condition === 'empty' ? 'Waste Status' : 'Detected Waste Types'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scanResult.wasteType.map((type, index) => (
                          <Badge key={index} className="border border-indigo-300 text-indigo-700 bg-white">
                            <Trash2 className="h-3 w-3 mr-1" />
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-600">{scanResult.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{scanResult.timestamp}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">AI Recommendations</p>
                      <div className="space-y-2">
                        {scanResult.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm text-gray-600">
              <p>1. Upload a clear photo of the dustbin.</p>
              <p>2. Tap <strong>Start AI Scan</strong> (required).</p>
              <p>3. Results are based on image analysis — empty bins show clean status.</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {scanHistory.length > 0 ? (
                <div className="space-y-3">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getConditionColor(scan.condition)}>
                          {scan.condition === 'empty' ? 'clean' : scan.condition}
                        </Badge>
                        <span className="text-sm text-gray-500">{scan.fillLevel}%</span>
                      </div>
                      <div className="text-xs text-gray-600">{scan.location}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Scan className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No scans yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Scans</span>
                  <span className="text-lg font-bold text-green-600">{scanHistory.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Confidence</span>
                  <span className="text-lg font-bold text-blue-600">
                    {scanHistory.length > 0 ? `${avgConfidence}%` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Critical Alerts</span>
                  <span className="text-lg font-bold text-red-600">{criticalCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}