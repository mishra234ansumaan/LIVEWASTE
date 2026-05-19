import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Users, 
  Truck, 
  TrendingUp,
  MapPin,
  Calendar,
  Crown,
  Target,
  Flag
} from 'lucide-react';

interface Citizen {
  id: number;
  name: string;
  points: number;
  reports: number;
  verifiedReports: number;
  badge: string;
  avatar: string;
  trend: 'up' | 'down' | 'same';
}

interface WorkerEntry {
  id: number;
  name: string;
  points: number;
  completedTasks: number;
  avgResponseTime: string;
  badge: string;
  avatar: string;
  trend: 'up' | 'down' | 'same';
}

export function Leaderboard() {
  const [selectedZone, setSelectedZone] = useState('sambalpur');
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [activeTab, setActiveTab] = useState<'citizens' | 'workers'>('citizens');

  const zones = [
    { value: 'sambalpur', label: 'Sambalpur District' },
    { value: 'khetrajpur', label: 'Khetrajpur Zone' },
    { value: 'ainthapali', label: 'Ainthapali Zone' },
    { value: 'dhanupali', label: 'Dhanupali Zone' },
    { value: 'fatak', label: 'Fatak Chowk Zone' }
  ];

  const topCitizens: Citizen[] = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      points: 850,
      reports: 45,
      verifiedReports: 42,
      badge: 'Gold Reporter',
      avatar: 'RK',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Sita Devi',
      points: 720,
      reports: 38,
      verifiedReports: 35,
      badge: 'Silver Reporter',
      avatar: 'SD',
      trend: 'up'
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      points: 680,
      reports: 32,
      verifiedReports: 30,
      badge: 'Silver Reporter',
      avatar: 'MA',
      trend: 'same'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      points: 620,
      reports: 28,
      verifiedReports: 26,
      badge: 'Bronze Reporter',
      avatar: 'PS',
      trend: 'down'
    },
    {
      id: 5,
      name: 'Amit Patel',
      points: 580,
      reports: 25,
      verifiedReports: 23,
      badge: 'Bronze Reporter',
      avatar: 'AP',
      trend: 'up'
    }
  ];

  const topWorkers: WorkerEntry[] = [
    {
      id: 1,
      name: 'Rajesh Singh',
      points: 1200,
      completedTasks: 85,
      avgResponseTime: '12 min',
      badge: 'Elite Worker',
      avatar: 'RS',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Sanjay Kumar',
      points: 1050,
      completedTasks: 72,
      avgResponseTime: '15 min',
      badge: 'Expert Worker',
      avatar: 'SK',
      trend: 'up'
    },
    {
      id: 3,
      name: 'Meena Devi',
      points: 980,
      completedTasks: 68,
      avgResponseTime: '18 min',
      badge: 'Expert Worker',
      avatar: 'MD',
      trend: 'same'
    },
    {
      id: 4,
      name: 'Vikram Rao',
      points: 920,
      completedTasks: 62,
      avgResponseTime: '20 min',
      badge: 'Senior Worker',
      avatar: 'VR',
      trend: 'down'
    },
    {
      id: 5,
      name: 'Anjali Gupta',
      points: 880,
      completedTasks: 58,
      avgResponseTime: '22 min',
      badge: 'Senior Worker',
      avatar: 'AG',
      trend: 'up'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes('Gold') || badge.includes('Elite')) return 'bg-yellow-100 text-yellow-800';
    if (badge.includes('Silver') || badge.includes('Expert')) return 'bg-gray-100 text-gray-800';
    if (badge.includes('Bronze') || badge.includes('Senior')) return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">Top performers in waste management</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-48">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {zones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2 shrink-0" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'citizens' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('citizens')}
          className="flex items-center gap-2 rounded-b-none"
        >
          <Users className="h-4 w-4" />
          Top Citizens
        </Button>
        <Button
          variant={activeTab === 'workers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('workers')}
          className="flex items-center gap-2 rounded-b-none"
        >
          <Truck className="h-4 w-4" />
          Top Workers
        </Button>
      </div>

      {/* Citizens Leaderboard */}
      {activeTab === 'citizens' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Top 5 Citizens - {zones.find(z => z.value === selectedZone)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCitizens.map((citizen, index) => (
                    <div key={citizen.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(index + 1)}
                        </div>
                        
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {citizen.avatar}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{citizen.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getBadgeColor(citizen.badge)}>
                              {citizen.badge}
                            </Badge>
                            {getTrendIcon(citizen.trend)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{citizen.points}</div>
                        <div className="text-sm text-gray-600">points</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {citizen.verifiedReports}/{citizen.reports} verified
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Citizen Stats Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Zone Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reports</span>
                  <span className="font-semibold">168</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verified Reports</span>
                  <span className="font-semibold text-green-600">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Citizens</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold">18 min</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">First Reporter</div>
                    <div className="text-sm text-gray-600">Reported 10+ issues</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-medium">Quality Reporter</div>
                    <div className="text-sm text-gray-600">90%+ verification rate</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Flag className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-medium">Zone Champion</div>
                    <div className="text-sm text-gray-600">Top reporter this week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Workers Leaderboard */}
      {activeTab === 'workers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Top 5 Workers - {zones.find(z => z.value === selectedZone)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topWorkers.map((worker, index) => (
                    <div key={worker.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(index + 1)}
                        </div>
                        
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {worker.avatar}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getBadgeColor(worker.badge)}>
                              {worker.badge}
                            </Badge>
                            {getTrendIcon(worker.trend)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{worker.points}</div>
                        <div className="text-sm text-gray-600">points</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {worker.completedTasks} tasks • {worker.avgResponseTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Worker Stats Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Zone Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Tasks</span>
                  <span className="font-semibold">345</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">328</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Workers</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold">17 min</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-medium">Task Master</div>
                    <div className="text-sm text-gray-600">80+ tasks completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">Speed Demon</div>
                    <div className="text-sm text-gray-600">Under 15 min response</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="font-medium">Perfect Record</div>
                    <div className="text-sm text-gray-600">100% completion rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}