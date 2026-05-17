import { useState, useCallback, useEffect } from 'react'
import { ServicesList } from '@/components/services/ServicesList'
import { appointmentsApi, servicesApi, vehiclesApi } from '@/lib/api'
import { ErrorNotice } from '@/components/ui/error-notice'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([servicesApi.getAll(), vehiclesApi.getAll(), appointmentsApi.getAll()])
      .then(([servicesData, vehiclesData, appointmentsData]) => {
        setServices(servicesData)
        setVehicles(vehiclesData)
        setAppointments(appointmentsData)
      })
      .catch((error) => setError(error.message))
  }, [])

  const handleAdd = useCallback(async (s) => {
    try {
      const created = await servicesApi.create(s)
      setServices((prev) => [...prev, created])
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])
  const handleUpdate = useCallback(async (s) => {
    try {
      const updated = await servicesApi.update(s.id, s)
      setServices((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])
  const handleDelete = useCallback(async (id) => {
    try {
      await servicesApi.remove(id)
      setServices((prev) => prev.filter((x) => x.id !== id))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return (
    <div className="space-y-6">
      <ErrorNotice message={error} />
      <ServicesList
        services={services}
        vehicles={vehicles}
        appointments={appointments}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
