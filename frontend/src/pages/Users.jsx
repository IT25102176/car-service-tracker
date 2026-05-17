import { useState, useCallback, useEffect } from 'react'
import { UsersList } from '@/components/users/UsersList'
import { usersApi } from '@/lib/api'
import { ErrorNotice } from '@/components/ui/error-notice'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    usersApi.getAll().then(setUsers).catch((error) => setError(error.message))
  }, [])

  const handleAdd = useCallback(async (u) => {
    try {
      const created = await usersApi.create(u)
      setUsers((prev) => [...prev, created])
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])
  const handleUpdate = useCallback(async (u) => {
    try {
      const updated = await usersApi.update(u.id, u)
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])
  const handleDelete = useCallback(async (id) => {
    try {
      await usersApi.remove(id)
      setUsers((prev) => prev.filter((x) => x.id !== id))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return (
    <div className="space-y-6">
      <ErrorNotice message={error} />
      <UsersList users={users} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  )
}
