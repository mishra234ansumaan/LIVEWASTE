import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
  Recycle,
  Leaf,
  Zap,
  Target
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
      bgColor: 'bg-red-50'
    },
    {
      title: 'Resolved',
      value: '24',
      change: '+8%',
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'In Progress',
      value: '4',
      change: '-3%',
      icon: Clock,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Users',
      value: '32',
      change: '+18%',
      icon: Users,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    }
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
      coordinates: '21.2841° N, 83.9792° E'
    },
    {
      id: 2,
      location: 'Ainthapali Square',
      type: 'Illegal Dumping',
      severity: 'Medium',
      time: '25 mins ago',
      status: 'in-progress',
      reportedBy: 'Sita Devi',
      coordinates: '21.2914° N, 83.9834° E'
    },
    {
      id: 3,
      location: 'Fatak Chowk',
      type: 'Bin Overflow',
      severity: 'High',
      time: '1 hour ago',
      status: 'resolved',
      reportedBy: 'Mohammed Ali',
      coordinates: '21.2789° N, 83.9756° E'
    },
    {
      id: 4,
      location: 'Dhanupali Area',
      type: 'Street Cleaning',
      severity: 'Low',
      time: '2 hours ago',
      status: 'pending',
      reportedBy: 'Priya Sharma',
      coordinates: '21.2956° N, 83.9878° E'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'Medium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'Low':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'pending':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              LiveWaste Dashboard
            </h1>

            <p className="text-blue-100">
              Real-time waste management monitoring for Sambalpur District
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>

                <span className="text-sm">
                  Live Monitoring Active
                </span>
              </div>

              <div className="text-sm">
                Last updated: Just now
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card
              key={index}
              className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>

                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>

                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />

                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>

                  <div className={`${stat.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Waste Issues
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 ${
                      selectedIssue === issue.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50'
                        : ''
                    }`}
                    onClick={() => setSelectedIssue(issue.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {issue.location}
                          </h3>

                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>

                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Trash2 className="h-4 w-4 text-orange-500" />
                            <span>{issue.type}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span>{issue.coordinates}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span>{issue.reportedBy}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {issue.time}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Camera className="h-4 w-4 mr-2" />
                Report New Issue
              </Button>

              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600"
              >
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>

              <Button
                variant="outline"
                className="w-full border-purple-500 text-purple-600"
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