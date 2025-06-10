'use client';

import React, { useEffect, useState } from 'react';
import { getAllBookings } from '@/services/booking_service';
import { getSamplesByBookingId, createSampleService } from '@/services/sample_service';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Booking } from '@/types/booking';
import type { Sample, NewSample } from '@/types/sample';

const BookingListPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sampleMap, setSampleMap] = useState<Record<number, Sample[]>>({});
  const [visibleSamples, setVisibleSamples] = useState<Record<number, boolean>>({});
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

  const toggleSampleList = async (bookingId: number) => {
    if (visibleSamples[bookingId]) {
      setVisibleSamples(prev => ({ ...prev, [bookingId]: false }));
    } else {
      if (!sampleMap[bookingId]) {
        const samples = await getSamplesByBookingId(bookingId);
        setSampleMap(prev => ({ ...prev, [bookingId]: samples }));
      }
      setVisibleSamples(prev => ({ ...prev, [bookingId]: true }));
    }
  };

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
      const updatedSamples = await getSamplesByBookingId(openDialogBookingId);
      setSampleMap(prev => ({ ...prev, [openDialogBookingId]: updatedSamples }));
      setFormData({
        collectedBy: '',
        collectedDate: new Date().toISOString(),
        sampleType: '',
        participantName: '',
        notes: '',
        picture: '',
        transport: '',
      });
      setOpenDialogBookingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách Booking</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.bookingId} className="bg-gray-100 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Booking #{booking.bookingId}</p>
                <p className="text-sm text-gray-600">Trang thái: {booking.status}</p>
                <p className="text-sm text-gray-600">Dịch vụ: {booking.method}</p>
              </div>
              <div className="space-x-2">
                <Button variant="secondary" onClick={() => toggleSampleList(booking.bookingId)}>
                  {visibleSamples[booking.bookingId] ? 'Ẩn mẫu' : 'Xem mẫu'}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setOpenDialogBookingId(booking.bookingId)}>Add Sample</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm Sample cho Booking #{booking.bookingId}</DialogTitle>
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
                      <Button onClick={handleCreateSample}>Lưu</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {visibleSamples[booking.bookingId] && (
              <div className="ml-4 mt-2 space-y-2">
                {(sampleMap[booking.bookingId] || []).length === 0 ? (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                    Chưa có mẫu – vui lòng nhập mẫu.
                  </div>
                ) : (
                  sampleMap[booking.bookingId].map(sample => (
                    <div key={sample.sampleId} className="border p-2 rounded text-sm bg-white shadow-sm">
                      <p><strong>Sample ID:</strong> {sample.sampleId}</p>
                      <p><strong>Type:</strong> {sample.sampleType}</p>
                      <p><strong>By:</strong> {sample.collectedBy}</p>
                      <p><strong>Participant:</strong> {sample.participantName}</p>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingListPage;
