import { useState, useRef, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  CheckCircle,
  Camera,
  Upload,
  Clock,
  MapPin,
  AlertTriangle,
  Truck,
  User,
  Calendar,
  X,
  Zap,
  Target,
  Award,
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
    {
      id: 1,
      location: 'Khetrajpur Market',
      issueType: 'Bin Overflow',
      reportedTime: '2 hours ago',
      priority: 'high',
      status: 'in-progress',
      assignedTime: '1 hour ago',
      reporter: 'Ramesh Kumar'
    },
    {
      id: 2,
      location: 'Ainthapali Square',
      issueType: 'Illegal Dumping',
      reportedTime: '3 hours ago',
      priority: 'medium',
      status: 'pending',
      assignedTime: '30 mins ago',
      reporter: 'Sita Devi'
    },
    {
      id: 3,
      location: 'Fatak Chowk',
      issueType: 'Bin Overflow',
      reportedTime: '5 hours ago',
      priority: 'high',
      status: 'pending',
      assignedTime: 'Just now',
      reporter: 'Mohammed Ali'
    },
    {
      id: 4,
      location: 'Dhanupali Area',
      issueType: 'Illegal Dumping',
      reportedTime: '1 day ago',
      priority: 'low',
      status: 'completed',
      assignedTime: '6 hours ago',
      reporter: 'Priya Sharma'
    }
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'before') {
          setBeforeImage(reader.result as string);
        } else {
          setAfterImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPickup = () => {
    if (!selectedOrder) return;
    
    if (!beforeImage || !afterImage) {
      alert('Please upload both before and after photos');
      return;
    }

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
            <p className="text-orange-100">Manage and complete waste collection tasks efficiently</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur">
              <Truck className="h-4 w-4 mr-1" />
              Worker ID: WRK-2024-001
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Assigned Work Orders
          </h2>
          
          {workOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.location}</h3>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>{order.issueType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <span>Reported by: {order.reporter}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>Reported: {order.reportedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span>Assigned: {order.assignedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-500">{order.location}, Sambalpur District</span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {order.status !== 'completed' && (
                      <Button 
                        onClick={() => handleStartWork(order)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                      >
                        {order.status === 'in-progress' ? 'Complete Work' : 'Start Work'}
                      </Button>
                    )}
                    {order.status === 'completed' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-8 w-8" />
                        <span className="text-sm font-medium">Done</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Photo Upload Section */}
        <div className="space-y-4">
          {showUploadSection && selectedOrder && (
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Camera className="h-5 w-5" />
                    Complete Work Order
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowUploadSection(false);
                      setSelectedOrder(null);
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-blue-100">{selectedOrder.location}</p>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {/* Before Photo Upload */}
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">Before Photo</Label>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-white">
                    {beforeImage ? (
                      <div className="relative">
                        <img 
                          src={beforeImage} 
                          alt="Before" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          variant="default"
                          size="sm"
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                          onClick={() => setBeforeImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload before photo</p>
                        <input
                          ref={beforeInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('before', e)}
                          aria-label="Upload before photo"
                          title="Upload before photo"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="border border-purple-500 text-purple-600 hover:bg-purple-50 text-sm px-3 py-1"
                          onClick={() => beforeInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* After Photo Upload */}
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">After Photo</Label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center bg-white">
                    {afterImage ? (
                      <div className="relative">
                        <img 
                          src={afterImage} 
                          alt="After" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          variant="default"
                          size="sm"
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                          onClick={() => setAfterImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload after photo</p>
                        <input
                          ref={afterInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('after', e)}
                          aria-label="Upload after photo"
                          title="Upload after photo"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="border border-green-500 text-green-600 hover:bg-green-50 text-sm px-3 py-1"
                          onClick={() => afterInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion Notes */}
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">Completion Notes</Label>
                  <Textarea
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Add any notes about the work completed..."
                    className="min-h-[80px] border-purple-200 focus:border-purple-500"
                  />
                </div>

                {/* Confirm Pickup Button */}
                <Button 
                  onClick={handleConfirmPickup}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  disabled={!beforeImage || !afterImage}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Pickup & Complete
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Worker Stats */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Today's Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-lg font-bold text-green-600">3</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-lg font-bold text-blue-600">1</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-lg font-bold text-orange-600">2</span>
                </div>
                <div className="pt-3 border-t border-orange-200">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <span className="text-sm font-medium text-purple-700">Total Points</span>
                    <span className="text-lg font-bold text-purple-600">150</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">Efficiency Score</div>
                    <div className="text-sm text-gray-600">95% this week</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-medium text-gray-900">Response Time</div>
                    <div className="text-sm text-gray-600">12 min average</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}