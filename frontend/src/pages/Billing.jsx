import { useState, useCallback, useEffect } from 'react'
import { InvoicesList } from '@/components/billing/InvoicesList'
import { invoicesApi, servicesApi, vehiclesApi } from '@/lib/api'
import { ErrorNotice } from '@/components/ui/error-notice'

export default function BillingPage() {
  const [invoices, setInvoices] = useState([])
  const [services, setServices] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([invoicesApi.getAll(), servicesApi.getAll(), vehiclesApi.getAll()])
      .then(([invoicesData, servicesData, vehiclesData]) => {
        setInvoices(invoicesData)
        setServices(servicesData)
        setVehicles(vehiclesData)
      })
      .catch((error) => setError(error.message))
  }, [])

  const handleAdd = useCallback(async (invoice) => {
    try {
      const created = await invoicesApi.create(invoice)
      setInvoices((prev) => [...prev, created])
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])
  const handleUpdate = useCallback(async (invoice) => {
    try {
      const updated = await invoicesApi.update(invoice.id, invoice)
      setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])
  const handleDelete = useCallback(async (id) => {
    try {
      await invoicesApi.remove(id)
      setInvoices((prev) => prev.filter((i) => i.id !== id))
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return (
    <div className="space-y-6">
      <ErrorNotice message={error} />
      <InvoicesList
        invoices={invoices}
        services={services}
        vehicles={vehicles}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
