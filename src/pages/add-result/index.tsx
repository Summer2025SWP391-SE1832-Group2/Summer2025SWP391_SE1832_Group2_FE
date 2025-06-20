import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllBookings } from "@/services/booking_service";
import { getSamplesByBookingId } from "@/services/sample_service";
import { createMultipleResultDetails, getResultDetailsByBookingId } from "@/services/result-service";

import type { ResultItem, ResultDetail } from "@/types/resultdetail";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddResultPage = () => {
  const navigate = useNavigate();

  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingOptions, setBookingOptions] = useState<number[]>([]);
  const [testParameters, setTestParameters] = useState<{ testParameterId: number; name: string }[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, [string, string]>>({});

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

  useEffect(() => {
    if (!bookingId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [sampleData, resultDetails] = await Promise.all([
          getSamplesByBookingId(bookingId),
          getResultDetailsByBookingId(bookingId),
        ]);

        const testParamsMap = new Map<number, string>();
        resultDetails.forEach((r) => {
          if (!testParamsMap.has(r.testParameterId)) {
            testParamsMap.set(r.testParameterId, r.name);
          }
        });

        setTestParameters(
          Array.from(testParamsMap.entries()).map(([id, name]) => ({
            testParameterId: id,
            name,
          }))
        );

        setSamples(sampleData);

        const newValues: Record<string, [string, string]> = {};
        resultDetails.forEach((r) => {
          const key = `${r.testParameterId}-${r.sampleId}`;
          const split = r.value.split(",");
          newValues[key] = [split[0] || "", split[1] || ""];
        });

        setValues(newValues);

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
  }, [bookingId]);

  const handleChange = (
    sampleId: number,
    testParameterId: number,
    index: 0 | 1,
    value: string
  ) => {
    const key = `${testParameterId}-${sampleId}`;
    setValues((prev) => {
      const existing = prev[key] || ["", ""];
      const updated: [string, string] = [...existing] as [string, string];
      updated[index] = value;
      return { ...prev, [key]: updated };
    });
  };

  const handleSave = async () => {
    if (!bookingId) return;
    const resultItems: ResultItem[] = [];

    for (const param of testParameters) {
      for (const sample of samples) {
        const key = `${param.testParameterId}-${sample.sampleId}`;
        const valPair = values[key] || ["", ""];
        const value = valPair.filter(Boolean).join(",");

        resultItems.push({
          testParameterId: param.testParameterId,
          sampleId: sample.sampleId,
          value,
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
                      <th className="px-4 py-2 border-b text-left">Chỉ số</th>
                      {samples.map((sample) => (
                        <th key={sample.sampleId} className="px-4 py-2 border-b text-left">
                          {sample.participantName || `Sample ${sample.sampleId}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {testParameters.map((param) => (
                      <tr key={param.testParameterId} className="hover:bg-muted/30">
                        <td className="border p-2 whitespace-nowrap">{param.name}</td>
                        {samples.map((sample) => {
                          const key = `${param.testParameterId}-${sample.sampleId}`;
                          const valPair = values[key] || ["", ""];

                          return (
                            <td key={sample.sampleId} className="border p-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="1"
                                  value={valPair[0]}
                                  onChange={(e) => handleChange(sample.sampleId, param.testParameterId, 0, e.target.value)}
                                  className="w-20"
                                />
                                <Input
                                  placeholder="2"
                                  value={valPair[1]}
                                  onChange={(e) => handleChange(sample.sampleId, param.testParameterId, 1, e.target.value)}
                                  className="w-20"
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave}>Lưu kết quả</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddResultPage;
