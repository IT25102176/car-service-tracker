import { useState, useCallback, useEffect } from 'react'
import { VehiclesList } from '@/components/vehicles/VehiclesList'
import { usersApi, vehiclesApi } from '@/lib/api'
import { ErrorNotice } from '@/components/ui/error-notice'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([vehiclesApi.getAll(), usersApi.getAll()])
      .then(([vehiclesData, usersData]) => {
        setVehicles(vehiclesData)
        setUsers(usersData)
      })
      .catch((error) => setError(error.message))
  }, [])

  const handleAdd = useCallback(async (v) => {
    try {
      const created = await vehiclesApi.create(v)
      setVehicles((prev) => [...prev, created])
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])
  const handleUpdate = useCallback(async (v) => {
    try {
      const updated = await vehiclesApi.update(v.id, v)
      setVehicles((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])
  const handleDelete = useCallback(async (id) => {
    try {
      await vehiclesApi.remove(id)
      setVehicles((prev) => prev.filter((x) => x.id !== id))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return (
    <div className="space-y-6">
      <ErrorNotice message={error} />
      <VehiclesList vehicles={vehicles} users={users} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  )
}
