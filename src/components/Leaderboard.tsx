import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue, SelectGroup,
} from '@/components/ui/select';
import {
  Trophy, Medal, Award, Star, Users, Truck,
  TrendingUp, MapPin, Calendar, Crown, Target, Flag,
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
    { value: 'fatak', label: 'Fatak Chowk Zone' },
  ];

  const topCitizens: Citizen[] = [
    { id: 1, name: 'Ramesh Kumar', points: 850, reports: 45, verifiedReports: 42, badge: 'Gold Reporter', avatar: 'RK', trend: 'up' },
    { id: 2, name: 'Sita Devi', points: 720, reports: 38, verifiedReports: 35, badge: 'Silver Reporter', avatar: 'SD', trend: 'up' },
    { id: 3, name: 'Mohammed Ali', points: 680, reports: 32, verifiedReports: 30, badge: 'Silver Reporter', avatar: 'MA', trend: 'same' },
    { id: 4, name: 'Priya Sharma', points: 620, reports: 28, verifiedReports: 26, badge: 'Bronze Reporter', avatar: 'PS', trend: 'down' },
    { id: 5, name: 'Amit Patel', points: 580, reports: 25, verifiedReports: 23, badge: 'Bronze Reporter', avatar: 'AP', trend: 'up' },
  ];

  const topWorkers: WorkerEntry[] = [
    { id: 1, name: 'Rajesh Singh', points: 1200, completedTasks: 85, avgResponseTime: '12 min', badge: 'Elite Worker', avatar: 'RS', trend: 'up' },
    { id: 2, name: 'Sanjay Kumar', points: 1050, completedTasks: 72, avgResponseTime: '15 min', badge: 'Expert Worker', avatar: 'SK', trend: 'up' },
    { id: 3, name: 'Meena Devi', points: 980, completedTasks: 68, avgResponseTime: '18 min', badge: 'Expert Worker', avatar: 'MD', trend: 'same' },
    { id: 4, name: 'Vikram Rao', points: 920, completedTasks: 62, avgResponseTime: '20 min', badge: 'Senior Worker', avatar: 'VR', trend: 'down' },
    { id: 5, name: 'Anjali Gupta', points: 880, completedTasks: 58, avgResponseTime: '22 min', badge: 'Senior Worker', avatar: 'AG', trend: 'up' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />;
      default: return <span className="text-base sm:text-lg font-bold text-gray-600">#{rank}</span>;
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
      case 'up': return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
      case 'down': return <TrendingUp className="h-3.5 w-3.5 text-red-500 rotate-180" />;
      default: return <div className="h-3.5 w-3.5 bg-gray-400 rounded-full" />;
    }
  };

  const currentList = activeTab === 'citizens' ? topCitizens : topWorkers;
  const currentZone = zones.find(z => z.value === selectedZone)?.label;

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-0.5">Top performers in waste management</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-40 sm:w-48 h-9 text-xs sm:text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {zones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value} className="text-xs sm:text-sm">
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-28 sm:w-32 h-9 text-xs sm:text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="daily" className="text-xs sm:text-sm">Daily</SelectItem>
                <SelectItem value="weekly" className="text-xs sm:text-sm">Weekly</SelectItem>
                <SelectItem value="monthly" className="text-xs sm:text-sm">Monthly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1.5 border-b">
        <Button
          variant={activeTab === 'citizens' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('citizens')}
          size="sm"
          className="flex items-center gap-1.5 rounded-b-none text-xs sm:text-sm h-9"
        >
          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Top </span>Citizens
        </Button>
        <Button
          variant={activeTab === 'workers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('workers')}
          size="sm"
          className="flex items-center gap-1.5 rounded-b-none text-xs sm:text-sm h-9"
        >
          <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Top </span>Workers
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Leaderboard List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                Top 5 {activeTab === 'citizens' ? 'Citizens' : 'Workers'} — {currentZone}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                {currentList.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors gap-2"
                  >
                    {/* Left: rank + avatar + info */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                        {getRankIcon(index + 1)}
                      </div>
                      <div className={`w-9 h-9 sm:w-11 sm:h-11 ${activeTab === 'citizens' ? 'bg-blue-500' : 'bg-green-500'} rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0`}>
                        {entry.avatar}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{entry.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <Badge className={`text-xs px-1.5 py-0 ${getBadgeColor(entry.badge)}`}>
                            {entry.badge}
                          </Badge>
                          {getTrendIcon(entry.trend)}
                        </div>
                      </div>
                    </div>

                    {/* Right: points + details */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-2xl font-bold text-gray-900">{entry.points}</div>
                      <div className="text-xs text-gray-500">points</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {activeTab === 'citizens'
                          ? `${(entry as Citizen).verifiedReports}/${(entry as Citizen).reports} verified`
                          : `${(entry as WorkerEntry).completedTasks} tasks`
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-sm sm:text-base">Zone Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-3">
              {activeTab === 'citizens' ? (
                <>
                  {[
                    { label: 'Total Reports', value: '168' },
                    { label: 'Verified Reports', value: '156', color: 'text-green-600' },
                    { label: 'Active Citizens', value: '42' },
                    { label: 'Avg. Response Time', value: '18 min' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{label}</span>
                      <span className={`text-sm font-semibold ${color || 'text-gray-900'}`}>{value}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { label: 'Total Tasks', value: '345' },
                    { label: 'Completed', value: '328', color: 'text-green-600' },
                    { label: 'Active Workers', value: '18' },
                    { label: 'Avg. Response Time', value: '17 min' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{label}</span>
                      <span className={`text-sm font-semibold ${color || 'text-gray-900'}`}>{value}</span>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-sm sm:text-base">
                {activeTab === 'citizens' ? 'Achievements' : 'Performance Metrics'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-3">
              {activeTab === 'citizens' ? (
                <>
                  {[
                    { icon: <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />, title: 'First Reporter', desc: 'Reported 10+ issues' },
                    { icon: <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />, title: 'Quality Reporter', desc: '90%+ verification rate' },
                    { icon: <Flag className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />, title: 'Zone Champion', desc: 'Top reporter this week' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-center gap-2 sm:gap-3">
                      {icon}
                      <div>
                        <div className="font-medium text-sm">{title}</div>
                        <div className="text-xs text-gray-600">{desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { icon: <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />, title: 'Task Master', desc: '80+ tasks completed' },
                    { icon: <Star className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />, title: 'Speed Demon', desc: 'Under 15 min response' },
                    { icon: <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />, title: 'Perfect Record', desc: '100% completion rate' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-center gap-2 sm:gap-3">
                      {icon}
                      <div>
                        <div className="font-medium text-sm">{title}</div>
                        <div className="text-xs text-gray-600">{desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}