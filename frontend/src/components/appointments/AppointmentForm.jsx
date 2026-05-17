import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


export function AppointmentForm({ appointment, vehicles, users, onSave, trigger }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(appointment || {
    vehicleId: '', appointmentDate: new Date(),
    serviceType: '', notes: '', status: 'scheduled', assignedTechnicianId: '',
  })

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId)
  const vehicleName = selectedVehicle
    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.licensePlate})`
    : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: appointment?.id || `appointment-${Date.now()}`,
      vehicleId: formData.vehicleId || '',
      vehicleName,
      customerName: selectedVehicle?.ownerName || '',
      appointmentDate: formData.appointmentDate || new Date(),
      serviceType: formData.serviceType || '',
      notes: formData.notes,
      status: formData.status || 'scheduled',
      assignedTechnicianId: formData.assignedTechnicianId,
      createdAt: appointment?.createdAt || new Date(),
    })
    setOpen(false)
  }

  const technicianUsers = users.filter((u) => (u.role || '').toLowerCase() === 'technician')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Appointment</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[700px] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle>{appointment ? 'Edit Appointment' : 'Schedule New Appointment'}</DialogTitle>
          <DialogDescription>{appointment ? 'Update appointment details' : 'Book a new service appointment'}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 [&_input]:h-9 [&_input]:rounded-xl [&_input]:border-gray-300 [&_input]:bg-gray-100 [&_input]:px-4 [&_input]:focus-visible:border-gray-400 [&_input]:focus-visible:ring-0"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
            <Select value={formData.vehicleId || ''} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
              <SelectTrigger className="h-9 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <Input value={formData.serviceType || ''} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })} placeholder="Oil Change, Inspection, etc." required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Input type="date" value={formData.appointmentDate ? new Date(formData.appointmentDate).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, appointmentDate: new Date(e.target.value + ' 09:00') })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <Input type="time" value={formData.appointmentDate ? new Date(formData.appointmentDate).toTimeString().slice(0, 5) : '09:00'}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':')
                  const newDate = new Date(formData.appointmentDate || new Date())
                  newDate.setHours(parseInt(hours), parseInt(minutes))
                  setFormData({ ...formData, appointmentDate: newDate })
                }} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Technician</label>
            <Select value={formData.assignedTechnicianId || ''} onValueChange={(value) => setFormData({ ...formData, assignedTechnicianId: value })}>
              <SelectTrigger className="h-9 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue placeholder="Select technician" /></SelectTrigger>
              <SelectContent>
                {technicianUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Input value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes or special requests" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select value={formData.status || 'scheduled'} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="h-9 rounded-xl border-gray-300 bg-gray-100 px-4 text-sm focus:ring-0 focus:border-gray-400"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
