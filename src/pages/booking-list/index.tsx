'use client';

import React, { useEffect, useState } from 'react';
import { getAllBookings } from '@/services/booking_service';
import { getSamplesByBookingId } from '@/services/sample_service';

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
    collectedDate: new Date().toISOString().slice(0, 16),
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

  const resetForm = () => {
    setFormData({
      collectedBy: '',
      collectedDate: new Date().toISOString().slice(0, 16),
      sampleType: '',
      participantName: '',
      notes: '',
      picture: '',
      transport: '',
    });
  };

  const handleCreateSample = async (bookingId: number) => {
    const currentSamples = sampleMap[bookingId] || [];
    if (currentSamples.length >= 2) {
      alert('Mỗi booking chỉ được tạo tối đa 2 mẫu.');
      return;
    }



    const updatedSamples = await getSamplesByBookingId(bookingId);
    setSampleMap(prev => ({ ...prev, [bookingId]: updatedSamples }));
    resetForm();
    setOpenDialogBookingId(null);
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
                <p className="text-sm text-gray-600">Trạng thái: {booking.status}</p>
                <p className="text-sm text-gray-600">Phương thức: {booking.method}</p>
              </div>
              <div className="space-x-2">
                <Button variant="secondary" onClick={() => toggleSampleList(booking.bookingId)}>
                  {visibleSamples[booking.bookingId] ? 'Ẩn mẫu' : 'Xem mẫu'}
                </Button>
                <Dialog open={openDialogBookingId === booking.bookingId} onOpenChange={(open) => {
                  if (open) {
                    setOpenDialogBookingId(booking.bookingId);
                    resetForm();
                  } else {
                    setOpenDialogBookingId(null);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>Thêm mẫu</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm mẫu cho Booking #{booking.bookingId}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <Label>Người thu mẫu</Label>
                        <Input name="collectedBy" value={formData.collectedBy} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label>Ngày thu mẫu</Label>
                        <Input
                          type="datetime-local"
                          name="collectedDate"
                          value={formData.collectedDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>Loại mẫu</Label>
                        <Input name="sampleType" value={formData.sampleType} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label>Người tham gia</Label>
                        <Input name="participantName" value={formData.participantName} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label>Phương tiện vận chuyển</Label>
                        <Input name="transport" value={formData.transport} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label>Ảnh</Label>
                        <Input name="picture" value={formData.picture} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label>Ghi chú</Label>
                        <Input name="notes" value={formData.notes} onChange={handleInputChange} />
                      </div>
                      <Button onClick={() => handleCreateSample(booking.bookingId)}>Lưu</Button>
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
                      <p><strong>Loại:</strong> {sample.sampleType}</p>
                      <p><strong>Thu bởi:</strong> {sample.collectedBy}</p>
                      <p><strong>Người tham gia:</strong> {sample.participantName}</p>
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
