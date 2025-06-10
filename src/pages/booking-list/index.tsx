// app/(dashboard)/bookingListPage.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getAllBookings } from '@/services/booking_service';
import { createSampleService } from '@/services/sample_service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Booking } from '@/types/booking';
import type { NewSample } from '@/types/sample';

const BookingListPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openDialogBookingId, setOpenDialogBookingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<NewSample, 'bookingId'>>({
    collectedBy: '',
    collectedDate: new Date().toISOString(),
    sampleType: '',
    participantName: '',
    notes: '',
    picture: '',
    transport: '',
  });

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getAllBookings();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSample = async () => {
    if (openDialogBookingId) {
      await createSampleService({
        ...formData,
        bookingId: openDialogBookingId,
      });
      setOpenDialogBookingId(null);
      setFormData({
        collectedBy: '',
        collectedDate: new Date().toISOString(),
        sampleType: '',
        participantName: '',
        notes: '',
        picture: '',
        transport: '',
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking List</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.bookingId} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <div>
              <p className="font-semibold">Booking ID: {booking.bookingId}</p>
              <p className="text-sm text-gray-600">Customer: {booking.userId}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setOpenDialogBookingId(booking.bookingId)}>Add Sample</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Sample for Booking #{booking.bookingId}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Collected By</Label>
                    <Input name="collectedBy" value={formData.collectedBy} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Collected Date</Label>
                    <Input type="datetime-local" name="collectedDate" value={formData.collectedDate} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Sample Type</Label>
                    <Input name="sampleType" value={formData.sampleType} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Participant Name</Label>
                    <Input name="participantName" value={formData.participantName} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Transport</Label>
                    <Input name="transport" value={formData.transport} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Picture (URL or base64)</Label>
                    <Input name="picture" value={formData.picture} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input name="notes" value={formData.notes} onChange={handleInputChange} />
                  </div>
                  <Button onClick={handleCreateSample}>Submit Sample</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingListPage;
