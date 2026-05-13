import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, AlertTriangle, CheckCircle, Clock, Navigation, Truck, Plus, Minus } from 'lucide-react';

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
  };

  const handleTruckClick = (truck: GarbageTruck) => {
    setSelectedTruck(truck);
    setSelectedZone(null);
    setReportLocation(null);
    setShowReportForm(false);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.zone-marker') || target.closest('.truck-marker')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const locationName = generateLocationName(x, y);
    
    setReportLocation({ x, y, name: locationName });
    setSelectedZone(null);
    setSelectedTruck(null);
    setShowReportForm(true);
  };

  const generateLocationName = (x: number, y: number): string => {
    const areas = [
      'Near Sambalpur City Center', 'Close to Hirakud Dam Road', 'Mahanadi Riverside Area',
      'Sambalpur University Vicinity', 'Industrial Area', 'Residential Colony',
      'Market Area', 'Commercial Complex', 'Educational Institution', 'Hospital Zone',
      'Park Area', 'Railway Station Area', 'Bus Stand Vicinity', 'Government Office Area',
      'Temple Vicinity', 'School Zone', 'Shopping Complex', 'Sports Ground Area'
    ];
    
    const index = Math.floor((x + y) / 10) % areas.length;
    return areas[index];
  };

  const handleReportSubmit = () => {
    setShowReportForm(false);
    setSelectedZone(null);
    setReportLocation(null);
    const location = selectedZone?.name || reportLocation?.name || 'selected location';
    alert(`Report submitted for ${location}! Waste management team has been notified.`);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 18) {
      setZoomLevel(prev => prev + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(prev => prev - 1);
    }
  };

  const totalReports = zones.reduce((sum, zone) => sum + zone.reports, 0);

  const calculateBbox = (zoom: number) => {
    const centerLat = 21.4667;
    const centerLng = 83.9833;
    const range = 0.3 / (zoom / 12);
    return `${centerLng - range},${centerLat - range},${centerLng + range},${centerLat + range}`;
  };

  const mapUrls = {
    osm: `https://www.openstreetmap.org/export/embed.html?bbox=${calculateBbox(zoomLevel)}&layer=mapnik&marker=21.4667,83.9833`,
    satellite: `https://maps.wikimedia.org/img/osm-intl,21.4667,83.9833,${zoomLevel},600x400.png?lang=en`
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sambalpur District Map</h1>
          <p className="text-gray-600 mt-1">Live monitoring - {totalReports} active reports in 30km radius</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            My Location
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div 
                className="relative bg-gray-100 h-96 lg:h-full min-h-96 rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleMapClick}
              >
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
                
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 zone-marker"
                    style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoneClick(zone);
                    }}
                  >
                    <div className={`w-10 h-10 ${getZoneColor(zone.status)} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all border-2 border-white animate-pulse`}>
                      {getZoneIcon(zone.status)}
                    </div>
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                      <p className="text-xs font-bold">{zone.name}</p>
                      <p className="text-xs text-gray-600">{zone.reports} reports</p>
                      <p className="text-xs text-gray-500">{zone.lastUpdated}</p>
                    </div>
                  </div>
                ))}

                {trucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 truck-marker"
                    style={{ left: `${truck.x}%`, top: `${truck.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTruckClick(truck);
                    }}
                  >
                    <div className={`w-8 h-8 ${getTruckColor(truck.status)} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all border-2 border-white`}>
                      <Truck className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                      <p className="text-xs font-bold">{truck.truckNumber}</p>
                      <p className="text-xs text-blue-600">{truck.route}</p>
                      <p className="text-xs text-gray-600">Driver: {truck.driver}</p>
                      <p className="text-xs text-gray-500">Capacity: {truck.capacity}%</p>
                    </div>
                  </div>
                ))}

                {reportLocation && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{ left: `${reportLocation.x}%`, top: `${reportLocation.y}%` }}
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 z-40 space-y-2">
<div className="bg-white rounded-lg shadow-lg p-2">
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setMapStyle(mapStyle === 'osm' ? 'satellite' : 'osm');
    }}
    className="block p-2 hover:bg-gray-100 rounded text-xs font-medium w-full"
  >
    {mapStyle === 'osm' ? '🛰️ Satellite' : '🗺️ Map'}
  </button>
</div>

<div className="bg-white rounded-lg shadow-lg p-1">
  <button
    type="button"
    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleZoomIn();
    }}
    aria-label="Zoom in"
    className="block p-2 hover:bg-gray-100 rounded text-xs font-medium w-full disabled:opacity-50"
    disabled={zoomLevel >= 18}
  >
    <Plus className="h-4 w-4" />
  </button>
  <div className="border-t my-1" />
  <button
    type="button"
    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      handleZoomOut();
    }}
    aria-label="Zoom out"
    className="block p-2 hover:bg-gray-100 rounded text-xs font-medium w-full disabled:opacity-50"
    disabled={zoomLevel <= 1}
  >
    <Minus className="h-4 w-4" />
  </button>
</div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2 z-40 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">o</span>
                    </div>
                    <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">o</span>
                    </div>
                    <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">g</span>
                    </div>
                    <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">l</span>
                    </div>
                    <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">e</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600">Maps</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-12 bg-white z-30" />
                
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-40">
                  <p className="text-sm font-bold mb-3">Zone Status</p>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full" />
                      <span className="text-xs">Overflowing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                      <span className="text-xs">Filling Fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                      <span className="text-xs">Recently Cleared</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold mb-2">Truck Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span className="text-xs">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-500 rounded" />
                      <span className="text-xs">Idle</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600 text-center">💡 Click anywhere to report</p>
                  </div>
                </div>

                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-40">
                  <p className="text-sm font-bold">Sambalpur District, Odisha</p>
                  <p className="text-xs text-gray-600">21.47°N, 83.97°E • Zoom: {zoomLevel}</p>
                </div>

                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold z-40 flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {showReportForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Issue</CardTitle>
                <p className="text-sm text-gray-600">
                  {selectedZone ? selectedZone.name : reportLocation ? reportLocation.name : 'Selected Location'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Issue Type</label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="overflow"
                        checked={reportType === 'overflow'}
                        onChange={(e) => setReportType(e.target.value as 'overflow')}
                      />
                      <span className="text-sm">Bin Overflow</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="illegal"
                        checked={reportType === 'illegal'}
                        onChange={(e) => setReportType(e.target.value as 'illegal')}
                      />
                      <span className="text-sm">Illegal Dumping</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <textarea
                    className="w-full mt-2 p-2 border rounded-md text-sm"
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
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : selectedTruck ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Truck Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Truck Number</p>
                  <p className="text-lg font-bold">{selectedTruck.truckNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Current Route</p>
                  <p className="text-sm text-blue-600">{selectedTruck.route}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Driver</p>
                  <p className="text-sm">{selectedTruck.driver}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Capacity</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${selectedTruck.capacity}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{selectedTruck.capacity}% full</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Next Stop</p>
                  <p className="text-sm">{selectedTruck.nextStop}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    selectedTruck.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedTruck.status === 'idle' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedTruck.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Zone Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overflowing Zones</span>
                      <span className="text-sm font-bold text-red-600">
                        {zones.filter(z => z.status === 'overflowing').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Filling Zones</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {zones.filter(z => z.status === 'filling').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cleared Zones</span>
                      <span className="text-sm font-bold text-green-600">
                        {zones.filter(z => z.status === 'cleared').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-gray-600">Total Reports</span>
                      <span className="text-sm font-bold">{totalReports}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Active Trucks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active</span>
                      <span className="text-sm font-bold text-blue-600">
                        {trucks.filter(t => t.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Idle</span>
                      <span className="text-sm font-bold text-gray-600">
                        {trucks.filter(t => t.status === 'idle').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Maintenance</span>
                      <span className="text-sm font-bold text-orange-600">
                        {trucks.filter(t => t.status === 'maintenance').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}