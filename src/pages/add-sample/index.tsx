import React, { useEffect, useMemo, useState } from "react";
import {
  getAllBookingSchedule,
  getBookingsByCollectorId,
} from "@/services/booking_service";
import {
  getSamplesByBookingId,
  updateSamplePictureService,
} from "@/services/sample_service";
import { useAuthStore } from "@/stores/auth";
import type { Booking } from "@/types/booking";
import type { Sample } from "@/types/sample";
import { useToast } from "@/components/ui/toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DropzoneImageUpload } from "@/components/common/image-upload";
import { paths } from "@/utils/constant/path";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ITEMS_PER_PAGE = 8;

const BookingListPage: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sampleMap, setSampleMap] = useState<Record<number, Sample[]>>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return bookings.slice(start, start + ITEMS_PER_PAGE);
  }, [bookings, currentPage]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const isAdminOrManagerOrStaff = ["Manager", "Admin", "TestStaff"].includes(user.role);
        const data: Booking[] = isAdminOrManagerOrStaff
          ? await getAllBookingSchedule()
          : await getBookingsByCollectorId(user.userId);
        setBookings(data.reverse());
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

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const handleUpdatePicture = async (sampleId: number, bookingId: number) => {
    try {
      setLoadingId(sampleId);
      await updateSamplePictureService(sampleId, imageUrl);
      showToast("Cập nhật hình ảnh thành công.", "success");
      await loadSamples(bookingId);
    } catch (err) {
      console.error(err);
      showToast("Cập nhật hình ảnh thất bại.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách Booking</h1>

      {bookings.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-10">
          Không có dữ liệu đặt lịch.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.map((b) => (
                <React.Fragment key={b.bookingId}>
                  <TableRow>
                    <TableCell>{b.bookingId}</TableCell>
                    <TableCell>{b.fullName}</TableCell>
                    <TableCell>{b.status}</TableCell>
                    <TableCell>{new Date(b.preferredDate).toLocaleDateString()}</TableCell>
                    <TableCell className="space-x-2 text-right">
                      {user?.role !== "TestStaff" && (
                        <Button size="sm" onClick={() => handleToggleSamples(b.bookingId)}>
                          {expanded === b.bookingId ? "Ẩn mẫu" : "Xem mẫu"}
                        </Button>
                      )}

                      {user?.role === "TestStaff" && b.status !== "Đang chờ xử lý" && (
                        <Link to={paths.staff.addResult.replace(":id", b.bookingId.toString())}>
                          <Button size="sm">Nhập kết quả</Button>
                        </Link>
                      )}

                      {b.status === "Hoàn thành" && (
                        <Link to={paths.manager.viewResult.replace(":id", b.bookingId.toString())}>
                          <Button size="sm" variant="secondary">Xem kết quả</Button>
                        </Link>
                      )}
                    </TableCell>

                  </TableRow>

                  {expanded === b.bookingId && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="grid grid-cols-1  xl:grid-cols-2 gap-4 py-4  items-center justify-center">
                          {sampleMap[b.bookingId]?.map((s) => (
                            <Card key={s.sampleId} className="shadow-sm border">
                              <CardHeader>
                                <CardTitle>Mẫu #{s.sampleId}</CardTitle>
                                <CardDescription>
                                  {s.participantName} • {s.sampleType}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <strong>Người tham gia:</strong> {s.participantName}
                                  </p>
                                  <p>
                                    <strong>Loại mẫu:</strong> {s.sampleType}
                                  </p>
                                  <div>
                                    <p className="font-semibold">Hình ảnh hiện tại:</p>
                                    {s.picture ? (
                                      <img
                                        src={s.picture}
                                        alt="Ảnh mẫu"
                                        className="mt-1 h-24 w-auto object-cover border rounded"
                                      />
                                    ) : (
                                      <span className="italic text-muted-foreground">Chưa có</span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col gap-3 p-3 border rounded-md bg-gray-50">
                                  <DropzoneImageUpload
                                    onImageUploaded={handleImageUploaded}
                                    defaultImage={imageUrl}
                                  />

                                  <Button
                                    size="sm"
                                    className=""
                                    disabled={loadingId === s.sampleId || !imageUrl}
                                    onClick={() => handleUpdatePicture(s.sampleId, b.bookingId)}
                                  >
                                    {loadingId === s.sampleId ? "Đang lưu..." : "Cập nhật"}
                                  </Button>
                                </div>

                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {bookings.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Trước
              </Button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )
      }
    </div >
  );
};

export default BookingListPage;
