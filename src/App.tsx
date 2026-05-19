import { useState, useEffect } from 'react'
import {
  Home,
  Map,
  User,
  Truck,
  Trophy,
  Camera,
  type LucideIcon,
} from 'lucide-react'
import { Dashboard } from '@/components/Dashboard'
import { MapView } from '@/components/Mapview'
import { Profile } from '@/components/Profile'
import { Worker } from '@/components/Worker'
import { Leaderboard } from '@/components/Leaderboard'
import { AIScanner } from '@/components/AIScanner'
import './App.css'

type ViewId =
  | 'dashboard'
  | 'map'
  | 'profile'
  | 'worker'
  | 'leaderboard'
  | 'scanner'

type NavigationItem = {
  id: ViewId
  label: string
  icon: LucideIcon
  color: string
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'bg-blue-500' },
  { id: 'map', label: 'Map', icon: Map, color: 'bg-green-500' },
  { id: 'scanner', label: 'Scanner', icon: Camera, color: 'bg-indigo-500' },
  { id: 'worker', label: 'Worker', icon: Truck, color: 'bg-orange-500' },
  { id: 'leaderboard', label: 'Ranks', icon: Trophy, color: 'bg-purple-500' },
  { id: 'profile', label: 'Profile', icon: User, color: 'bg-pink-500' },
]

function App() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard')

  useEffect(() => {
    // Fix viewport for mobile
    const metaViewport = document.querySelector('meta[name=viewport]')
    if (metaViewport) {
      metaViewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      )
    }

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0
    const handleTouchEnd = (event: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }
    document.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />
      case 'map': return <MapView />
      case 'scanner': return <AIScanner />
      case 'worker': return <Worker />
      case 'leaderboard': return <Leaderboard />
      case 'profile': return <Profile />
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* TOP HEADER */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-50">
        <div className="px-3 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-1.5 sm:p-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white">LiveWaste</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                      isActive
                        ? 'bg-white text-purple-600'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Mobile: show active page name */}
            <div className="md:hidden">
              <span className="text-white text-sm font-medium">
                {navigationItems.find(i => i.id === activeView)?.label}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - padding bottom for mobile nav */}
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        {renderActiveView()}
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="grid grid-cols-6 h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-purple-100' : ''
                }`}>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                </div>
                <span className={`text-[10px] font-medium leading-none ${
                  isActive ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App