import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ServiceForm({ service, vehicles, appointments = [], onSave, trigger }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(service || { vehicleId: '', serviceType: '', description: '', cost: 0, status: 'pending' })

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId)
  const selectedAppointment = appointments.find((a) => a.id === formData.appointmentId)
  const vehicleName = selectedVehicle
    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.licensePlate})`
    : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: service?.id || `service-${Date.now()}`,
      vehicleId: formData.vehicleId || '',
      vehicleName,
      serviceType: formData.serviceType || selectedAppointment?.serviceType || '',
      description: formData.description || selectedAppointment?.notes || '',
      cost: formData.cost || 0,
      status: formData.status || 'pending',
      completedDate: formData.completedDate,
      createdAt: service?.createdAt || new Date(),
      updatedAt: new Date(),
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Add Service</Button>}</DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[620px] rounded-3xl p-7">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogDescription>{service ? 'Update service details' : 'Record a new service or repair'}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 [&_input]:h-10 [&_input]:rounded-xl [&_input]:border-gray-300 [&_input]:bg-gray-100 [&_input]:px-4 [&_input]:focus-visible:border-gray-400 [&_input]:focus-visible:ring-0"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment (Optional)</label>
            <Select
              value={formData.appointmentId || ''}
              onValueChange={(value) => {
                const appointment = appointments.find((a) => a.id === value)
                setFormData({
                  ...formData,
                  appointmentId: value,
                  vehicleId: appointment?.vehicleId || formData.vehicleId,
                  serviceType: appointment?.serviceType || formData.serviceType,
                  description: appointment?.notes || formData.description,
                })
              }}
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue placeholder="Link from appointment" /></SelectTrigger>
              <SelectContent>
                {appointments.map((appointment) => (
                  <SelectItem key={appointment.id} value={appointment.id}>
                    {appointment.serviceType} - {appointment.vehicleName}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Service details" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <Input type="number" step="0.01" value={formData.cost || ''} onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })} placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={formData.status || 'pending'} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="h-10 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
