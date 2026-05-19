import { useState, useRef, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  CheckCircle, Camera, Upload, Clock, MapPin,
  AlertTriangle, Truck, User, Calendar, X, Zap, Target, Award,
} from 'lucide-react';

interface WorkOrder {
  id: number;
  location: string;
  issueType: string;
  reportedTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTime: string;
  reporter: string;
}

export function Worker() {
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showUploadSection, setShowUploadSection] = useState(false);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const workOrders: WorkOrder[] = [
    { id: 1, location: 'Khetrajpur Market', issueType: 'Bin Overflow', reportedTime: '2 hours ago', priority: 'high', status: 'in-progress', assignedTime: '1 hour ago', reporter: 'Ramesh Kumar' },
    { id: 2, location: 'Ainthapali Square', issueType: 'Illegal Dumping', reportedTime: '3 hours ago', priority: 'medium', status: 'pending', assignedTime: '30 mins ago', reporter: 'Sita Devi' },
    { id: 3, location: 'Fatak Chowk', issueType: 'Bin Overflow', reportedTime: '5 hours ago', priority: 'high', status: 'pending', assignedTime: 'Just now', reporter: 'Mohammed Ali' },
    { id: 4, location: 'Dhanupali Area', issueType: 'Illegal Dumping', reportedTime: '1 day ago', priority: 'low', status: 'completed', assignedTime: '6 hours ago', reporter: 'Priya Sharma' },
  ];

  const handleStartWork = (order: WorkOrder) => {
    setSelectedOrder(order);
    setShowUploadSection(true);
    setBeforeImage(null);
    setAfterImage(null);
    setCompletionNotes('');
  };

  const handleImageUpload = (type: 'before' | 'after', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'before') setBeforeImage(reader.result as string);
      else setAfterImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPickup = () => {
    if (!selectedOrder) return;
    if (!beforeImage || !afterImage) { alert('Please upload both before and after photos'); return; }
    alert(`Pickup confirmed for ${selectedOrder.location}! Work order marked as completed.`);
    setShowUploadSection(false);
    setSelectedOrder(null);
    setBeforeImage(null);
    setAfterImage(null);
    setCompletionNotes('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'in-progress': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'pending': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">Worker Dashboard</h1>
            <p className="text-orange-100 text-xs sm:text-sm">
              Manage and complete waste collection tasks efficiently
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 self-start sm:self-auto text-xs">
            <Truck className="h-3.5 w-3.5 mr-1" />
            Worker ID: WRK-2024-001
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Work Orders */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-base sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            Assigned Work Orders
          </h2>

          {workOrders.map((order) => (
            <Card
              key={order.id}
              className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50"
            >
              <CardContent className="p-3 sm:p-5">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      {order.location}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className={`text-xs ${getPriorityColor(order.priority)}`}>
                        {order.priority.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {order.status !== 'completed' ? (
                      <Button
                        onClick={() => handleStartWork(order)}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs sm:text-sm h-9"
                      >
                        {order.status === 'in-progress' ? 'Complete Work' : 'Start Work'}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="text-xs sm:text-sm font-medium">Done</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    { icon: <AlertTriangle className="h-3.5 w-3.5 text-red-500" />, text: order.issueType },
                    { icon: <User className="h-3.5 w-3.5 text-blue-500" />, text: `By: ${order.reporter}` },
                    { icon: <Clock className="h-3.5 w-3.5 text-orange-500" />, text: `Reported: ${order.reportedTime}` },
                    { icon: <Calendar className="h-3.5 w-3.5 text-purple-500" />, text: `Assigned: ${order.assignedTime}` },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-xs text-gray-600">
                      {icon}
                      <span className="truncate">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500">{order.location}, Sambalpur District</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">

          {/* Work Completion Upload */}
          {showUploadSection && selectedOrder && (
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl p-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Camera className="h-4 w-4" />
                    Complete Work Order
                  </CardTitle>
                  <button
                    type="button"
                    onClick={() => { setShowUploadSection(false); setSelectedOrder(null); }}
                    className="text-white hover:bg-white/20 p-1 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-blue-100 mt-0.5">{selectedOrder.location}</p>
              </CardHeader>
              <CardContent className="p-3 space-y-3">

                {/* Before Photo */}
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Before Photo</Label>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 text-center bg-white">
                    {beforeImage ? (
                      <div className="relative">
                        <img src={beforeImage} alt="Before" className="w-full h-28 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setBeforeImage(null)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-7 w-7 text-purple-400 mx-auto mb-1.5" />
                        <p className="text-xs text-gray-600 mb-2">Upload before photo</p>
                        <input
                          ref={beforeInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('before', e)}
                          aria-label="Upload before photo"
                          title="Upload before photo"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => beforeInputRef.current?.click()}
                          className="border border-purple-500 text-purple-600 hover:bg-purple-50 text-xs px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Upload className="h-3.5 w-3.5 mr-1.5 inline" />
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* After Photo */}
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-1.5 block">After Photo</Label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-3 text-center bg-white">
                    {afterImage ? (
                      <div className="relative">
                        <img src={afterImage} alt="After" className="w-full h-28 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setAfterImage(null)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-7 w-7 text-green-400 mx-auto mb-1.5" />
                        <p className="text-xs text-gray-600 mb-2">Upload after photo</p>
                        <input
                          ref={afterInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('after', e)}
                          aria-label="Upload after photo"
                          title="Upload after photo"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => afterInputRef.current?.click()}
                          className="border border-green-500 text-green-600 hover:bg-green-50 text-xs px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Upload className="h-3.5 w-3.5 mr-1.5 inline" />
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-1.5 block">
                    Completion Notes
                  </Label>
                  <Textarea
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Add notes about the work completed..."
                    className="min-h-[70px] text-xs border-purple-200 focus:border-purple-500 resize-none"
                  />
                </div>

                <Button
                  onClick={handleConfirmPickup}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white h-10 text-sm"
                  disabled={!beforeImage || !afterImage}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Pickup & Complete
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Today's Stats */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-xl p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                Today's Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-2">
              {[
                { label: 'Completed', value: 3, color: 'text-green-600' },
                { label: 'In Progress', value: 1, color: 'text-blue-600' },
                { label: 'Pending', value: 2, color: 'text-orange-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center p-2.5 bg-white rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600">{label}</span>
                  <span className={`text-base sm:text-lg font-bold ${color}`}>{value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-orange-200">
                <div className="flex justify-between items-center p-2.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-purple-700">Total Points</span>
                  <span className="text-base sm:text-lg font-bold text-purple-600">150</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-3">
              {[
                { icon: <Target className="h-7 w-7 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />, title: 'Efficiency Score', desc: '95% this week' },
                { icon: <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0" />, title: 'Response Time', desc: '12 min average' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-center gap-2.5 sm:gap-3">
                  {icon}
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{title}</div>
                    <div className="text-xs text-gray-600">{desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}