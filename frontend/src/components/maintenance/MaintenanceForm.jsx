import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function MaintenanceForm({ maintenance, vehicles, services = [], onSave, trigger }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(maintenance || {
    vehicleId: '', serviceType: '', dueDate: new Date(), dueMileage: 0, priority: 'medium', status: 'pending', notes: '',
  })

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId)
  const selectedService = services.find((s) => s.id === formData.serviceId)
  const vehicleName = selectedVehicle
    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.licensePlate})`
    : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: maintenance?.id || `maintenance-${Date.now()}`,
      vehicleId: formData.vehicleId || '',
      vehicleName,
      serviceType: formData.serviceType || selectedService?.serviceType || '',
      dueDate: formData.dueDate || new Date(),
      dueMileage: formData.dueMileage,
      currentMileage: selectedVehicle?.mileage,
      priority: formData.priority || 'medium',
      status: formData.status || 'pending',
      notes: formData.notes,
      createdAt: maintenance?.createdAt || new Date(),
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Add Reminder</Button>}</DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[620px] rounded-3xl p-7">
        <DialogHeader>
          <DialogTitle>{maintenance ? 'Edit Maintenance' : 'Add Maintenance Reminder'}</DialogTitle>
          <DialogDescription>{maintenance ? 'Update maintenance reminder' : 'Schedule an upcoming maintenance task'}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 [&_input]:h-10 [&_input]:rounded-xl [&_input]:border-gray-300 [&_input]:bg-gray-100 [&_input]:px-4 [&_input]:focus-visible:border-gray-400 [&_input]:focus-visible:ring-0"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Record (Optional)</label>
            <Select
              value={formData.serviceId || ''}
              onValueChange={(value) => {
                const linkedService = services.find((s) => s.id === value)
                setFormData({
                  ...formData,
                  serviceId: value,
                  vehicleId: linkedService?.vehicleId || formData.vehicleId,
                  serviceType: linkedService?.serviceType || formData.serviceType,
                  notes: linkedService?.description || formData.notes,
                })
              }}
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue placeholder="Link from service record" /></SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.serviceType} - {service.vehicleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
            <Select value={formData.vehicleId || ''} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
              <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <Input value={formData.serviceType || ''} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })} placeholder="Oil Change, Tire Rotation, etc." required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <Input type="date" value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Mileage</label>
              <Input type="number" value={formData.dueMileage || ''} onChange={(e) => setFormData({ ...formData, dueMileage: parseInt(e.target.value) })} placeholder="50000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Select value={formData.priority || 'medium'} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={formData.status || 'pending'} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Input value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes" />
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
