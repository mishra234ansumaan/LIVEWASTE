import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Eye,
  Camera,
  Users,
  Trash2,
  Zap,
} from 'lucide-react';

export function Dashboard() {
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);

  const stats = [
    {
      title: 'Total Reports',
      value: '28',
      change: '+12%',
      icon: AlertTriangle,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Resolved',
      value: '24',
      change: '+8%',
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'In Progress',
      value: '4',
      change: '-3%',
      icon: Clock,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users',
      value: '32',
      change: '+18%',
      icon: Users,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentIssues = [
    {
      id: 1,
      location: 'Khetrajpur Market',
      type: 'Bin Overflow',
      severity: 'High',
      time: '10 mins ago',
      status: 'pending',
      reportedBy: 'Ramesh Kumar',
      coordinates: '21.2841° N, 83.9792° E',
    },
    {
      id: 2,
      location: 'Ainthapali Square',
      type: 'Illegal Dumping',
      severity: 'Medium',
      time: '25 mins ago',
      status: 'in-progress',
      reportedBy: 'Sita Devi',
      coordinates: '21.2914° N, 83.9834° E',
    },
    {
      id: 3,
      location: 'Fatak Chowk',
      type: 'Bin Overflow',
      severity: 'High',
      time: '1 hour ago',
      status: 'resolved',
      reportedBy: 'Mohammed Ali',
      coordinates: '21.2789° N, 83.9756° E',
    },
    {
      id: 4,
      location: 'Dhanupali Area',
      type: 'Street Cleaning',
      severity: 'Low',
      time: '2 hours ago',
      status: 'pending',
      reportedBy: 'Priya Sharma',
      coordinates: '21.2956° N, 83.9878° E',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'Low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'in-progress': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'pending': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
          LiveWaste Dashboard
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm lg:text-base">
          Real-time waste management monitoring for Sambalpur District
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm">Live Monitoring Active</span>
          </div>
          <div className="text-xs sm:text-sm text-blue-100">Last updated: Just now</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0 ml-2`}>
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Issues + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Recent Issues */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                Recent Waste Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
                      selectedIssue === issue.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedIssue(issue.id)}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                        {issue.location}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 h-7 w-7 p-0 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Trash2 className="h-3 w-3 text-orange-500" />
                        <span>{issue.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span>{issue.reportedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>{issue.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-500" />
                        <span className="hidden sm:inline">{issue.coordinates}</span>
                        <span className="sm:hidden">GPS</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm h-10 sm:h-11">
                <Camera className="h-4 w-4 mr-2" />
                Report New Issue
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600 text-sm h-10 sm:h-11"
              >
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>
              <Button
                variant="outline"
                className="w-full border-purple-500 text-purple-600 text-sm h-10 sm:h-11"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}