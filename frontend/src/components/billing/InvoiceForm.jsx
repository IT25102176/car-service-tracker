import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function InvoiceForm({ invoice, services, vehicles = [], onSave, trigger }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(invoice || {
    serviceId: '', vehicleName: '', customerName: '', amount: 0, tax: 0, total: 0,
    status: 'pending', issueDate: new Date(), dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), description: '',
  })
  const availableServices = services || []
  const findCustomerByVehicleName = (name) => {
    const vehicle = vehicles.find((v) => {
      const displayName = `${v.year} ${v.make} ${v.model} (${v.licensePlate})`
      return displayName === name
    })
    return vehicle?.ownerName || ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const total = (formData.amount || 0) + (formData.tax || 0)
    onSave({
      id: invoice?.id || `invoice-${Date.now()}`,
      serviceId: formData.serviceId || '',
      vehicleName: formData.vehicleName || '',
      customerName: formData.customerName || '',
      amount: formData.amount || 0,
      tax: formData.tax || 0,
      total,
      status: formData.status || 'pending',
      issueDate: formData.issueDate || new Date(),
      dueDate: formData.dueDate || new Date(),
      paidDate: formData.paidDate,
      description: formData.description,
      createdAt: invoice?.createdAt || new Date(),
    })
    setOpen(false)
  }

  const toDateString = (d) => d ? new Date(d).toISOString().split('T')[0] : ''

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Add Invoice</Button>}</DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[700px] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
          <DialogDescription>{invoice ? 'Update invoice details' : 'Create a new invoice for a service'}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 [&_input]:h-9 [&_input]:rounded-xl [&_input]:border-gray-300 [&_input]:bg-gray-100 [&_input]:px-4 [&_input]:focus-visible:border-gray-400 [&_input]:focus-visible:ring-0"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Record</label>
            <Select
              value={formData.serviceId || ''}
              onValueChange={(value) => {
                const selectedService = availableServices.find((s) => s.id === value)
                setFormData({
                  ...formData,
                  serviceId: value,
                  vehicleName: selectedService?.vehicleName || formData.vehicleName,
                  customerName: findCustomerByVehicleName(selectedService?.vehicleName || ''),
                  description: selectedService?.description || selectedService?.serviceType || formData.description,
                  amount: selectedService?.cost ?? formData.amount,
                })
              }}
            >
              <SelectTrigger className="h-9 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue placeholder="Select service record" /></SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.serviceType} - {service.vehicleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Service details" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <Input type="number" step="0.01" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
              <Input type="number" step="0.01" value={formData.tax || ''} onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) })} placeholder="0.00" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <Input type="date" value={toDateString(formData.issueDate)} onChange={(e) => setFormData({ ...formData, issueDate: new Date(e.target.value) })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <Input type="date" value={toDateString(formData.dueDate)} onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select value={formData.status || 'pending'} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="h-9 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-gray-300 bg-white px-6 text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-xl bg-[#E9762B] px-6 text-white hover:bg-[#d86722]"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
