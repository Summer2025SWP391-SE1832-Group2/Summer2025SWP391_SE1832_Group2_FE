// app/(dashboard)/bookingListPage.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getAllBookings } from '@/services/booking_service';
import { createSampleService, getSamplesByBookingId, updateSampleService, deleteSampleService } from '@/services/sample_service';
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
import type { NewSample, Sample } from '@/types/sample';

const BookingListPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [samplesByBookingId, setSamplesByBookingId] = useState<Record<number, Sample[]>>({});
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
  const [editingSampleId, setEditingSampleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getAllBookings();
      setBookings(data);
      for (const booking of data) {
        const samples = await getSamplesByBookingId(booking.bookingId);
        setSamplesByBookingId(prev => ({ ...prev, [booking.bookingId]: samples }));
      }
    };
    fetchBookings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSample = (sample: Sample) => {
    setFormData({
      collectedBy: sample.collectedBy,
      collectedDate: sample.collectedDate,
      sampleType: sample.sampleType,
      participantName: sample.participantName,
      notes: sample.notes,
      picture: sample.picture,
      transport: sample.transport,
    });
    setOpenDialogBookingId(sample.bookingId);
    setEditingSampleId(sample.sampleId);
  };

  const handleDeleteSample = async (bookingId: number, sampleId: number) => {
    await deleteSampleService(sampleId);
    const updatedSamples = await getSamplesByBookingId(bookingId);
    setSamplesByBookingId(prev => ({ ...prev, [bookingId]: updatedSamples }));
  };

  const handleSubmitSample = async () => {
    if (!openDialogBookingId) return;
    if (editingSampleId) {
      await updateSampleService({ sampleId: editingSampleId, ...formData, bookingId: openDialogBookingId });
    } else {
      await createSampleService({ ...formData, bookingId: openDialogBookingId });
    }
    const updatedSamples = await getSamplesByBookingId(openDialogBookingId);
    setSamplesByBookingId(prev => ({ ...prev, [openDialogBookingId]: updatedSamples }));
    setOpenDialogBookingId(null);
    setEditingSampleId(null);
    setFormData({
      collectedBy: '',
      collectedDate: new Date().toISOString(),
      sampleType: '',
      participantName: '',
      notes: '',
      picture: '',
      transport: '',
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking List</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.bookingId} className="p-4 border rounded-xl shadow-sm bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Booking ID: {booking.bookingId}</p>
                <p className="text-sm text-muted-foreground">Customer ID: {booking.userId}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setOpenDialogBookingId(booking.bookingId)}>Add Sample</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingSampleId ? 'Edit' : 'Add'} Sample for Booking #{booking.bookingId}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
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
                      <Label>Picture</Label>
                      <Input name="picture" value={formData.picture} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Input name="notes" value={formData.notes} onChange={handleInputChange} />
                    </div>
                    <Button onClick={handleSubmitSample} className="w-full">Submit</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {samplesByBookingId[booking.bookingId]?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium">Sample List:</p>
                {samplesByBookingId[booking.bookingId].map((sample, index) => (
                  <div key={index} className="border rounded p-2 text-sm bg-gray-50 flex justify-between items-center">
                    <div>
                      <p>Collected By: {sample.collectedBy}</p>
                      <p>Participant: {sample.participantName}</p>
                      <p>Type: {sample.sampleType}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditSample(sample)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteSample(sample.bookingId, sample.sampleId)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingListPage;