'use client';

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarIcon } from "lucide-react";

import {
  getSamplesByBookingId,
  createSampleService,
} from "@/services/sample_service";
import {
  createMultipleResultDetails,
  getResultDetailsByBookingId,
} from "@/services/result-service";

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
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const AddResultPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);

  const [samples, setSamples] = useState<Sample[]>([]);
  const [testParameters, setTestParameters] = useState<{ testParameterId: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, [string, string]>>({});
  const [finalResult, setFinalResult] = useState<string>("");

  const [sampleForm, setSampleForm] = useState<Omit<Sample, "sampleId" | "serviceId">>({
    bookingId,
    collectedBy: "",
    collectedDate: new Date().toISOString(),
    sampleType: "",
    participantName: "",
    notes: "",
    picture: "",
    transport: "",
  });

  useEffect(() => {
    if (!bookingId || isNaN(bookingId)) {
      alert("Booking ID không hợp lệ.");
      navigate("/dashboard/bookinglist");
      return;
    }

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
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const handleAddSample = async () => {
    if (samples.length >= 2) {
      alert("Chỉ được tạo tối đa 2 mẫu cho mỗi booking.");
      return;
    }

    try {
      await createSampleService(sampleForm);

      const updated = await getSamplesByBookingId(bookingId);
      setSamples(updated);

      setSampleForm({
        bookingId,
        collectedBy: "",
        collectedDate: new Date().toISOString(),
        sampleType: "",
        participantName: "",
        notes: "",
        picture: "",
        transport: "",
      });
    } catch (err) {
      console.error("Lỗi khi thêm mẫu:", err);
      alert("Thêm mẫu thất bại.");
    }
  };

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
      await createMultipleResultDetails({
        bookingId,
        finalResult,
        results: resultItems.map((item) => ({
          ...item,
          resultDetailId: 0,
          bookingId,
          parameterName:
            testParameters.find((p) => p.testParameterId === item.testParameterId)?.name || "",
        })),
      });

      alert("Lưu kết quả thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lỗi khi lưu kết quả.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button>Thêm mẫu</Button>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] space-y-4">
            <div className="text-base font-semibold">Thêm mẫu mới</div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[{ label: "Người thu mẫu", name: "collectedBy" },
                { label: "Loại mẫu", name: "sampleType" },
                { label: "Người tham gia", name: "participantName" },
                { label: "Phương tiện vận chuyển", name: "transport" },
                { label: "Ảnh (url)", name: "picture" },
                { label: "Ghi chú", name: "notes" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <Label className="text-sm">{label}</Label>
                  <Input
                    name={name}
                    value={(sampleForm as any)[name]}
                    onChange={(e) =>
                      setSampleForm((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <div className="col-span-2">
                <Label className="text-sm">Ngày thu mẫu</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      {sampleForm.collectedDate
                        ? format(new Date(sampleForm.collectedDate), "PPP", { locale: vi })
                        : <span className="text-muted-foreground">Chọn ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(sampleForm.collectedDate)}
                      onSelect={(date) => {
                        if (date) {
                          setSampleForm((prev) => ({
                            ...prev,
                            collectedDate: date.toISOString(),
                          }));
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleAddSample}>Xác nhận</Button>
            </div>
          </PopoverContent>
        </Popover>
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
                        <th key={sample.sampleId} className="px-4 py-2 border-b text-center">
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
                              <div className="flex gap-2 justify-center">
                                <Input
                                  value={valPair[0]}
                                  onChange={(e) =>
                                    handleChange(sample.sampleId, param.testParameterId, 0, e.target.value)
                                  }
                                  className="w-20"
                                />
                                <Input
                                  value={valPair[1]}
                                  onChange={(e) =>
                                    handleChange(sample.sampleId, param.testParameterId, 1, e.target.value)
                                  }
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
            <div className="mt-6">
              <label className="block font-medium mb-1">Nhận định của bác sĩ:</label>
              <Input
                value={finalResult}
                onChange={(e) => setFinalResult(e.target.value)}
                placeholder="Nhập nhận định tổng quát"
              />
            </div>

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
