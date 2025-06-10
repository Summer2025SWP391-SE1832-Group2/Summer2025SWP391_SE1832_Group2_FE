import { useEffect, useState } from "react";
import { getAllBookings } from "@/services/booking_service";
import { getTestParametersByServiceId } from "@/services/parameters-service";
import { getSamplesByBookingId } from "@/services/sample_service";
import { createMultipleResultDetails } from "@/services/result-service";
import type { ResultItem } from "@/types/resultdetail";
import type { TestParameter } from "@/types/testparameters";
import type { Sample } from "@/types/sample";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const AddResultPage = () => {
  const serviceId = 1;
  const navigate = useNavigate();

  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingOptions, setBookingOptions] = useState<number[]>([]);

  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  // Lấy danh sách booking ID
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await getAllBookings();
        const ids = bookings.map((b) => b.bookingId);
        setBookingOptions(ids);
        if (ids.length > 0) setBookingId(ids[0]);
      } catch (err) {
        console.error("Lỗi khi lấy booking:", err);
      }
    };
    fetchBookings();
  }, []);

  // Lấy test parameters + sample mỗi khi chọn booking mới
useEffect(() => {
  if (!bookingId) return;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [params, sampleData] = await Promise.all([
        getTestParametersByServiceId(serviceId),
        getSamplesByBookingId(bookingId),
      ]);
      setTestParameters(params);
      setSamples(sampleData);
      setValues({});

      // ⚠️ Nếu không có sample thì chuyển trang
      if (sampleData.length === 0) {
        alert("Booking chưa có mẫu. Vui lòng thêm sample trước.");
        navigate("/dashboard/bookinglist");
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [bookingId, serviceId]);


  const handleChange = (sampleId: number, testParameterId: number, value: string) => {
    setValues((prev) => ({
      ...prev,
      [`${sampleId}-${testParameterId}`]: value,
    }));
  };

  const handleSave = async () => {
    if (!bookingId) return;
    const resultItems: ResultItem[] = [];

    for (const sample of samples) {
      for (const param of testParameters) {
        const key = `${sample.sampleId}-${param.testParameterId}`;
        const value = values[key] || "";
        resultItems.push({
          testParameterId: param.testParameterId,
          value,
          sampleId: sample.sampleId,
        });
      }
    }

    try {
      await createMultipleResultDetails(bookingId, resultItems);
      alert("Lưu kết quả thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi khi lưu kết quả.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="max-w-sm">
        <label className="font-semibold mb-2 block">Chọn booking:</label>
        <Select onValueChange={(val) => setBookingId(Number(val))} value={bookingId?.toString()}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn booking ID" />
          </SelectTrigger>
          <SelectContent>
            {bookingOptions.map((id) => (
              <SelectItem key={id} value={id.toString()}>
                Booking #{id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {bookingId && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Nhập kết quả xét nghiệm (Booking: {bookingId})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="w-full h-[200px] rounded-md" />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-muted rounded-md">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 border-b text-left">Sample</th>
                      {testParameters.map((param) => (
                        <th key={param.testParameterId} className="px-4 py-2 border-b text-left">
                          {param.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map((sample) => (
                      <tr key={sample.sampleId} className="hover:bg-muted/40">
                        <td className="px-4 py-2 border-b font-medium">
                          {sample.participantName || `Sample ${sample.sampleId}`}
                        </td>
                        {testParameters.map((param) => (
                          <td key={param.testParameterId} className="px-2 py-1 border-b">
                            <Input
                              value={values[`${sample.sampleId}-${param.testParameterId}`] || ""}
                              onChange={(e) =>
                                handleChange(sample.sampleId, param.testParameterId, e.target.value)
                              }
                              className="w-24"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSave}>Lưu kết quả</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddResultPage;
