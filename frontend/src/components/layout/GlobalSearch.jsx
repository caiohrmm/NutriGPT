import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, Calendar, Clock, Phone, Mail } from 'lucide-react'
import { Input } from '../ui/input'
import { searchAPI } from '../../lib/api'
import { cn } from '../../lib/utils'

export function GlobalSearch({ className }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState({ patients: [], appointments: [] })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ patients: [], appointments: [] })
      setIsOpen(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const searchResults = await searchAPI.global(query, 10)
        
        setResults({
          patients: searchResults.patients || [],
          appointments: searchResults.appointments || []
        })
        setIsOpen(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults({ patients: [], appointments: [] })
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handlePatientClick = (patient) => {
    navigate(`/patients/${patient.id}`)
    setIsOpen(false)
    setQuery('')
  }

  const handleAppointmentClick = (appointment) => {
    navigate(`/appointments`)
    setIsOpen(false)
    setQuery('')
  }

  const handleViewAllPatients = () => {
    navigate(`/patients?search=${encodeURIComponent(query)}`)
    setIsOpen(false)
    setQuery('')
  }

  const handleViewAllAppointments = () => {
    navigate(`/appointments?search=${encodeURIComponent(query)}`)
    setIsOpen(false)
    setQuery('')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const hasResults = results.patients.length > 0 || results.appointments.length > 0

  return (
    <div className={cn('relative', className)} ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar pacientes, consultas..."
          className="pl-10 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && hasResults && setIsOpen(true)}
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || isLoading) && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-96 overflow-y-auto"
          style={{ minWidth: '400px' }}
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
              Buscando...
            </div>
          ) : !hasResults ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-4 w-4 mx-auto mb-2" />
              Nenhum resultado encontrado
            </div>
          ) : (
            <>
              {/* Patients Section */}
              {results.patients.length > 0 && (
                <div className="border-b border-gray-100 last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Pacientes ({results.patients.length})
                  </div>
                  {results.patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientClick(patient)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {patient.fullName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {patient.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {patient.email}
                              </span>
                            )}
                            {patient.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {patient.phone}
                              </span>
                            )}
                          </div>
                          {patient.goal && (
                            <p className="text-xs text-gray-400 mt-1">
                              Objetivo: {patient.goal}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleViewAllPatients}
                    className="w-full px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors"
                  >
                    Ver todos os pacientes com "{query}"
                  </button>
                </div>
              )}

              {/* Appointments Section */}
              {results.appointments.length > 0 && (
                <div className="border-b border-gray-100 last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Consultas ({results.appointments.length})
                  </div>
                  {results.appointments.map((appointment) => (
                    <button
                      key={appointment.id}
                      onClick={() => handleAppointmentClick(appointment)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {appointment.Patient?.fullName || 'Paciente não encontrado'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(appointment.startAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(appointment.startAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              'inline-flex px-2 py-1 text-xs rounded-full',
                              appointment.status === 'scheduled' && 'bg-blue-100 text-blue-800',
                              appointment.status === 'completed' && 'bg-green-100 text-green-800',
                              appointment.status === 'cancelled' && 'bg-red-100 text-red-800'
                            )}>
                              {appointment.status === 'scheduled' && 'Agendada'}
                              {appointment.status === 'completed' && 'Concluída'}
                              {appointment.status === 'cancelled' && 'Cancelada'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleViewAllAppointments}
                    className="w-full px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors"
                  >
                    Ver todas as consultas com "{query}"
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
