import React, { useEffect, useState } from "react";
import { getAllBookingSchedule, getBookingsByCollectorId } from "@/services/booking_service";
import {
  getSamplesByBookingId,
  createSampleService,
  deleteSampleService,
  updateSampleService,
} from "@/services/sample_service";
import { getCollectionScheduleByBookingId } from "@/services/sample_collection_schedule_service";
import { useAuthStore } from "@/stores/auth";
import type { Booking } from "@/types/booking";
import type { Sample, NewSample } from "@/types/sample";
import BookingTable from "./BookingTable";
import { useToast } from "@/components/ui/toast";

const BookingListPage: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [sampleMap, setSampleMap] = useState<Record<number, Sample[]>>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === "Manager" || user.role === "Admin" || user.role === "TestStaff") {
          const data: Booking[] = await getAllBookingSchedule();
          setBookings(data.reverse());
        } else {
          const data: Booking[] = await getBookingsByCollectorId(user.userId);
          setBookings(data.reverse());
        }
      } catch (error) {
        console.error(error);
        showToast("Không thể tải danh sách booking.", "error");
      }
    };

    fetchData();
  }, [user, showToast]);

  const loadSamples = async (bookingId: number) => {
    try {
      const samples = await getSamplesByBookingId(bookingId);
      setSampleMap((prev) => ({ ...prev, [bookingId]: samples }));
    } catch (err) {
      console.error(err);
      showToast("Không thể tải danh sách mẫu.", "error");
    }
  };

  const handleToggleSamples = async (bookingId: number) => {
    if (expanded === bookingId) {
      setExpanded(null);
    } else {
      if (!sampleMap[bookingId]) await loadSamples(bookingId);
      setExpanded(bookingId);
    }
  };

  const handleCreateSample = async (
    bookingId: number,
    data: Omit<NewSample, "bookingId">
  ) => {
    const currentSamples = sampleMap[bookingId] || [];
    if (currentSamples.length >= 2) {
      showToast("Mỗi booking chỉ được tạo tối đa 2 mẫu.", "error");
      return;
    }

    if (!data.sampleType || !data.participantName || !data.notes) {
      showToast("Vui lòng nhập đầy đủ thông tin.", "error");
      return;
    }

    try {
      await createSampleService({ ...data, bookingId, picture: "", transport: "" });
      await loadSamples(bookingId);
      setOpenDialogId(null);
      showToast("Tạo mẫu thành công.", "success");
    } catch (err) {
      console.error(err);
      showToast("Không thể tạo mẫu.", "error");
    }
  };

  const handleDeleteSample = async (bookingId: number, sampleId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá mẫu này?")) return;
    try {
      await deleteSampleService(sampleId);
      await loadSamples(bookingId);
      showToast("Xoá mẫu thành công.", "success");
    } catch (err) {
      console.error(err);
      showToast("Xoá mẫu thất bại.", "error");
    }
  };

  const handleEditSample = async (bookingId: number, updatedSample: Sample) => {
    try {
      await updateSampleService(updatedSample);
      await loadSamples(bookingId);
      showToast("Cập nhật mẫu thành công.", "success");
    } catch (err) {
      console.error(err);
      showToast("Cập nhật mẫu thất bại.", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách Booking</h1>
      <BookingTable
        bookings={bookings}
        sampleMap={sampleMap}
        expanded={expanded}
        onReloadSamples={loadSamples}
        onToggleSamples={handleToggleSamples}
      />
    </div>
  );
};

export default BookingListPage;
