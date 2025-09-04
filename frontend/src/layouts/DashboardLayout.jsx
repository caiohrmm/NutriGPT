import { useState, useEffect } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { LogoWatermark } from '../components/ui/logo'

export function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [])

  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background watermark */}
      <LogoWatermark />
      
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 lg:ml-80">
          <Header 
            onMenuClick={() => setSidebarOpen(true)} 
            title={title}
          />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  )
}
