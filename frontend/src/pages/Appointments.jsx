import { useState, useCallback, useEffect } from 'react'
import { AppointmentsList } from '@/components/appointments/AppointmentsList'
import { appointmentsApi, usersApi, vehiclesApi } from '@/lib/api'
import { ErrorNotice } from '@/components/ui/error-notice'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([appointmentsApi.getAll(), vehiclesApi.getAll(), usersApi.getAll()])
      .then(([appointmentsData, vehiclesData, usersData]) => {
        setAppointments(appointmentsData)
        setVehicles(vehiclesData)
        setUsers(usersData)
      })
      .catch((error) => setError(error.message))
  }, [])

  const handleAdd = useCallback(async (appointment) => {
    try {
      const created = await appointmentsApi.create(appointment)
      setAppointments((prev) => [...prev, created])
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])

  const handleUpdate = useCallback(async (appointment) => {
    try {
      const updated = await appointmentsApi.update(appointment.id, appointment)
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])

  const handleDelete = useCallback(async (id) => {
    try {
      await appointmentsApi.remove(id)
      setAppointments((prev) => prev.filter((a) => a.id !== id))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return (
    <div className="space-y-6">
      <ErrorNotice message={error} />
      <AppointmentsList
        appointments={appointments}
        vehicles={vehicles}
        users={users}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
