import { useState, type MouseEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin, AlertTriangle, CheckCircle, Clock,
  Navigation, Truck, Plus, Minus,
} from 'lucide-react';

interface MapZone {
  id: number;
  name: string;
  x: number;
  y: number;
  status: 'overflowing' | 'filling' | 'cleared';
  reports: number;
  lastUpdated: string;
}

interface GarbageTruck {
  id: number;
  truckNumber: string;
  route: string;
  x: number;
  y: number;
  status: 'active' | 'idle' | 'maintenance';
  capacity: number;
  nextStop: string;
  driver: string;
}

interface ReportLocation {
  x: number;
  y: number;
  name: string;
}

export function MapView() {
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<GarbageTruck | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState<'overflow' | 'illegal'>('overflow');
  const [mapStyle, setMapStyle] = useState<'osm' | 'satellite'>('osm');
  const [reportLocation, setReportLocation] = useState<ReportLocation | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const zones: MapZone[] = [
    { id: 1, name: 'Khetrajpur Market', x: 25, y: 35, status: 'overflowing', reports: 3, lastUpdated: '10 mins ago' },
    { id: 2, name: 'Ainthapali Square', x: 45, y: 25, status: 'filling', reports: 2, lastUpdated: '1 hour ago' },
    { id: 3, name: 'Dhanupali Area', x: 65, y: 40, status: 'cleared', reports: 0, lastUpdated: '2 hours ago' },
    { id: 4, name: 'Fatak Chowk', x: 35, y: 55, status: 'overflowing', reports: 4, lastUpdated: '30 mins ago' },
    { id: 5, name: 'Mundali Road', x: 75, y: 30, status: 'filling', reports: 1, lastUpdated: '45 mins ago' },
    { id: 6, name: 'Gole Bazar', x: 50, y: 60, status: 'cleared', reports: 0, lastUpdated: '3 hours ago' },
    { id: 7, name: 'Station Road', x: 20, y: 70, status: 'filling', reports: 2, lastUpdated: '20 mins ago' },
    { id: 8, name: 'Medical College', x: 80, y: 50, status: 'cleared', reports: 0, lastUpdated: '1 hour ago' },
  ];

  const trucks: GarbageTruck[] = [
    { id: 1, truckNumber: 'OD-07-AB-1234', route: 'Khetrajpur → Ainthapali', x: 30, y: 30, status: 'active', capacity: 65, nextStop: 'Ainthapali Square', driver: 'Rajendra Sahu' },
    { id: 2, truckNumber: 'OD-07-CD-5678', route: 'Dhanupali → Fatak', x: 60, y: 45, status: 'active', capacity: 80, nextStop: 'Fatak Chowk', driver: 'Mahesh Pradhan' },
    { id: 3, truckNumber: 'OD-07-EF-9012', route: 'Mundali → Gole Bazar', x: 70, y: 35, status: 'active', capacity: 45, nextStop: 'Gole Bazar', driver: 'Dhananjay Mishra' },
    { id: 4, truckNumber: 'OD-07-GH-3456', route: 'Station Road Loop', x: 25, y: 65, status: 'idle', capacity: 20, nextStop: 'Depot', driver: 'Gopal Das' },
  ];

  const getZoneColor = (status: string) => {
    switch (status) {
      case 'overflowing': return 'bg-red-500';
      case 'filling': return 'bg-yellow-500';
      case 'cleared': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getZoneIcon = (status: string) => {
    switch (status) {
      case 'overflowing': return <AlertTriangle className="h-3 w-3 text-white" />;
      case 'filling': return <Clock className="h-3 w-3 text-white" />;
      case 'cleared': return <CheckCircle className="h-3 w-3 text-white" />;
      default: return <MapPin className="h-3 w-3 text-white" />;
    }
  };

  const getTruckColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'idle': return 'bg-gray-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleZoneClick = (zone: MapZone) => {
    setSelectedZone(zone);
    setSelectedTruck(null);
    setReportLocation(null);
    setShowReportForm(true);
    setShowSidePanel(true);
  };

  const handleTruckClick = (truck: GarbageTruck) => {
    setSelectedTruck(truck);
    setSelectedZone(null);
    setReportLocation(null);
    setShowReportForm(false);
    setShowSidePanel(true);
  };

  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.zone-marker') || target.closest('.truck-marker')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const areas = [
      'Near Sambalpur City Center', 'Close to Hirakud Dam Road',
      'Mahanadi Riverside Area', 'Sambalpur University Vicinity',
      'Industrial Area', 'Residential Colony', 'Market Area',
      'Commercial Complex', 'Hospital Zone', 'Park Area',
    ];
    const locationName = areas[Math.floor((x + y) / 10) % areas.length];
    setReportLocation({ x, y, name: locationName });
    setSelectedZone(null);
    setSelectedTruck(null);
    setShowReportForm(true);
    setShowSidePanel(true);
  };

  const handleReportSubmit = () => {
    setShowReportForm(false);
    setSelectedZone(null);
    setReportLocation(null);
    setShowSidePanel(false);
    const location = selectedZone?.name || reportLocation?.name || 'selected location';
    alert(`Report submitted for ${location}! Waste management team has been notified.`);
  };

  const handleZoomIn = () => { if (zoomLevel < 18) setZoomLevel(prev => prev + 1); };
  const handleZoomOut = () => { if (zoomLevel > 1) setZoomLevel(prev => prev - 1); };

  const totalReports = zones.reduce((sum, zone) => sum + zone.reports, 0);

  const calculateBbox = (zoom: number) => {
    const centerLat = 21.4667;
    const centerLng = 83.9833;
    const range = 0.3 / (zoom / 12);
    return `${centerLng - range},${centerLat - range},${centerLng + range},${centerLat + range}`;
  };

  const mapUrls = {
    osm: `https://www.openstreetmap.org/export/embed.html?bbox=${calculateBbox(zoomLevel)}&layer=mapnik&marker=21.4667,83.9833`,
    satellite: `https://maps.wikimedia.org/img/osm-intl,21.4667,83.9833,${zoomLevel},600x400.png?lang=en`,
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Sambalpur District Map
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
            Live monitoring — {totalReports} active reports in 30km radius
          </p>
        </div>
        <Button variant="outline" size="sm" className="self-start sm:self-auto">
          <Navigation className="h-4 w-4 mr-2" />
          My Location
        </Button>
      </div>

      {/* Map Area */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-0">
          <div
            className="relative bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
            style={{ height: 'clamp(280px, 50vw, 480px)' }}
            onClick={handleMapClick}
          >
            {/* Map iframe / satellite */}
            {mapStyle === 'osm' ? (
              <iframe
                key={zoomLevel}
                src={mapUrls.osm}
                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                title="Sambalpur District Map"
                loading="lazy"
              />
            ) : (
              <img
                key={zoomLevel}
                src={mapUrls.satellite}
                alt="Sambalpur District Satellite View"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            )}

            {/* Zone Markers */}
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 zone-marker"
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                onClick={(e) => { e.stopPropagation(); handleZoneClick(zone); }}
              >
                <div className={`w-7 h-7 sm:w-9 sm:h-9 ${getZoneColor(zone.status)} rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse`}>
                  {getZoneIcon(zone.status)}
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                  <p className="text-xs font-bold">{zone.name}</p>
                  <p className="text-xs text-gray-600">{zone.reports} reports</p>
                  <p className="text-xs text-gray-500">{zone.lastUpdated}</p>
                </div>
              </div>
            ))}

            {/* Truck Markers */}
            {trucks.map((truck) => (
              <div
                key={truck.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 truck-marker"
                style={{ left: `${truck.x}%`, top: `${truck.y}%` }}
                onClick={(e) => { e.stopPropagation(); handleTruckClick(truck); }}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 ${getTruckColor(truck.status)} rounded-lg flex items-center justify-center shadow-lg border-2 border-white`}>
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                  <p className="text-xs font-bold">{truck.truckNumber}</p>
                  <p className="text-xs text-blue-600">{truck.route}</p>
                  <p className="text-xs text-gray-600">Driver: {truck.driver}</p>
                  <p className="text-xs text-gray-500">Capacity: {truck.capacity}%</p>
                </div>
              </div>
            ))}

            {/* Report Location Pin */}
            {reportLocation && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${reportLocation.x}%`, top: `${reportLocation.y}%` }}
              >
                <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
              </div>
            )}

            {/* Map Title */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg z-40">
              <p className="text-xs sm:text-sm font-bold whitespace-nowrap">Sambalpur District, Odisha</p>
              <p className="text-xs text-gray-600 text-center">Zoom: {zoomLevel}</p>
            </div>

            {/* LIVE badge */}
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold z-40 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </div>

            {/* Map controls (top right) */}
            <div className="absolute top-2 right-2 z-40 space-y-1.5">
              <div className="bg-white rounded-lg shadow-lg p-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMapStyle(mapStyle === 'osm' ? 'satellite' : 'osm'); }}
                  className="block p-1.5 hover:bg-gray-100 rounded text-xs font-medium w-full"
                >
                  {mapStyle === 'osm' ? '🛰️' : '🗺️'}
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                  disabled={zoomLevel >= 18}
                  className="block p-1.5 hover:bg-gray-100 rounded w-full disabled:opacity-40"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mx-auto" />
                </button>
                <div className="border-t my-0.5" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                  disabled={zoomLevel <= 1}
                  className="block p-1.5 hover:bg-gray-100 rounded w-full disabled:opacity-40"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Legend (bottom left) */}
            <div className="absolute bottom-14 left-2 bg-white rounded-lg shadow-lg p-2 sm:p-3 z-40">
              <p className="text-xs font-bold mb-1.5">Zone Status</p>
              <div className="space-y-1 mb-2">
                {[
                  { color: 'bg-red-500', label: 'Overflowing' },
                  { color: 'bg-yellow-500', label: 'Filling' },
                  { color: 'bg-green-500', label: 'Cleared' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 ${color} rounded-full flex-shrink-0`} />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold mb-1.5">Trucks</p>
              <div className="space-y-1">
                {[
                  { color: 'bg-blue-500', label: 'Active' },
                  { color: 'bg-gray-500', label: 'Idle' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 ${color} rounded flex-shrink-0`} />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">💡 Tap to report</p>
            </div>

            {/* White bar to hide OSM footer */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-white z-30" />
          </div>
        </CardContent>
      </Card>

      {/* Side Panel - shows below map on mobile, as grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3">
          {showSidePanel && showReportForm ? (
            <Card>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg">Report Issue</CardTitle>
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedZone?.name || reportLocation?.name || 'Selected Location'}
                </p>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Issue Type</label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="overflow"
                        checked={reportType === 'overflow'}
                        onChange={() => setReportType('overflow')}
                      />
                      <span className="text-sm">Bin Overflow</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="illegal"
                        checked={reportType === 'illegal'}
                        onChange={() => setReportType('illegal')}
                      />
                      <span className="text-sm">Illegal Dumping</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <textarea
                    className="w-full mt-2 p-2 border rounded-md text-sm resize-none"
                    rows={3}
                    placeholder="Add details about the issue..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleReportSubmit} className="flex-1">
                    Submit Report
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setShowReportForm(false);
                    setReportLocation(null);
                    setShowSidePanel(false);
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : showSidePanel && selectedTruck ? (
            <Card>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                  Truck Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Truck Number', value: selectedTruck.truckNumber },
                  { label: 'Route', value: selectedTruck.route },
                  { label: 'Driver', value: selectedTruck.driver },
                  { label: 'Next Stop', value: selectedTruck.nextStop },
                  { label: 'Status', value: selectedTruck.status },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Capacity</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${selectedTruck.capacity}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{selectedTruck.capacity}% full</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Zone Summary */}
              <Card>
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-sm sm:text-base">Zone Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2">
                  {[
                    { label: 'Overflowing', count: zones.filter(z => z.status === 'overflowing').length, color: 'text-red-600' },
                    { label: 'Filling', count: zones.filter(z => z.status === 'filling').length, color: 'text-yellow-600' },
                    { label: 'Cleared', count: zones.filter(z => z.status === 'cleared').length, color: 'text-green-600' },
                    { label: 'Total Reports', count: totalReports, color: 'text-gray-900' },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">{label}</span>
                      <span className={`text-sm font-bold ${color}`}>{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Trucks Summary */}
              <Card>
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-1.5">
                    <Truck className="h-4 w-4" />
                    Trucks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2">
                  {[
                    { label: 'Active', count: trucks.filter(t => t.status === 'active').length, color: 'text-blue-600' },
                    { label: 'Idle', count: trucks.filter(t => t.status === 'idle').length, color: 'text-gray-600' },
                    { label: 'Maintenance', count: trucks.filter(t => t.status === 'maintenance').length, color: 'text-orange-600' },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">{label}</span>
                      <span className={`text-sm font-bold ${color}`}>{count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}