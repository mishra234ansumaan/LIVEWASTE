import { useState, useRef, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  User, Mail, Phone, MapPin, Edit2, Save, Camera, Award, Settings,
} from 'lucide-react';

const PROFILE_PHOTO_KEY = 'livewaste-profile-photo';

const defaultProfileData = {
  fullName: 'ANSUL PATNAIK',
  email: 'ansul@gmail.com',
  phone: '+91 98765 43210',
  location: 'Burla, Sambalpur',
  role: 'Citizen',
  joinDate: 'January 2024',
  reports: 23,
  points: 450,
};

function loadSavedProfilePhoto(): string | null {
  try { return localStorage.getItem(PROFILE_PHOTO_KEY); }
  catch { return null; }
}

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(loadSavedProfilePhoto);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState(defaultProfileData);

  const handleSave = () => setIsEditing(false);
  const handleCancel = () => { setIsEditing(false); setProfileData(defaultProfileData); };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please choose an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be smaller than 5MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfileImage(result);
      try { localStorage.setItem(PROFILE_PHOTO_KEY, result); }
      catch { alert('Photo updated for this session only (storage full).'); }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const activityStats = [
    { value: profileData.reports, label: 'Reports Filed', color: 'text-blue-600' },
    { value: profileData.points, label: 'Points Earned', color: 'text-green-600' },
    { value: 15, label: 'Issues Resolved', color: 'text-purple-600' },
    { value: 'Gold', label: 'Citizen Level', color: 'text-orange-600' },
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
            Manage your account settings and information
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? 'ghost' : 'default'}
          size="sm"
          className="self-start sm:self-auto h-9 sm:h-10 text-sm"
        >
          {isEditing ? (
            <><Save className="h-4 w-4 mr-2" />Save Changes</>
          ) : (
            <><Edit2 className="h-4 w-4 mr-2" />Edit Profile</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-5 space-y-4 sm:space-y-6">

              {/* Avatar Row */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={`${profileData.fullName} profile`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 shadow-md transition-colors"
                    aria-label="Upload profile photo"
                  >
                    <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    title="Upload profile photo"
                    onChange={handlePhotoUpload}
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">{profileData.fullName}</h3>
                  <Badge className="mt-1 text-xs">{profileData.role}</Badge>
                  <p className="text-xs text-gray-600 mt-1">Member since {profileData.joinDate}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { id: 'fullName', label: 'Full Name', type: 'text', field: 'fullName', value: profileData.fullName },
                  { id: 'email', label: 'Email Address', type: 'email', field: 'email', value: profileData.email },
                  { id: 'phone', label: 'Phone Number', type: 'text', field: 'phone', value: profileData.phone },
                  { id: 'location', label: 'Location', type: 'text', field: 'location', value: profileData.location },
                ].map(({ id, label, type, field, value }) => (
                  <div key={id}>
                    <Label htmlFor={id} className="text-xs sm:text-sm">{label}</Label>
                    <Input
                      id={id}
                      type={type}
                      value={value}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 h-9 sm:h-10 text-sm"
                    />
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="flex-1 h-10 text-sm">Save Changes</Button>
                  <Button variant="ghost" onClick={handleCancel} className="h-10 text-sm">Cancel</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                Activity & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {activityStats.map(({ value, label, color }) => (
                  <div key={label} className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</div>
                    <p className="text-xs text-gray-600 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-1.5">
              {[
                { icon: <Mail className="h-4 w-4 mr-2" />, label: 'Email Notifications' },
                { icon: <Phone className="h-4 w-4 mr-2" />, label: 'SMS Alerts' },
                { icon: <MapPin className="h-4 w-4 mr-2" />, label: 'Location Settings' },
              ].map(({ icon, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  className="w-full justify-start h-10 text-xs sm:text-sm"
                >
                  {icon}
                  {label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-sm sm:text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-2.5">
              {[
                { icon: <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />, value: profileData.email },
                { icon: <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />, value: profileData.phone },
                { icon: <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />, value: profileData.location },
              ].map(({ icon, value }) => (
                <div key={value} className="flex items-center gap-2">
                  {icon}
                  <span className="text-xs sm:text-sm break-all">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}