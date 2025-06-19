import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { getAllBookings } from "@/services/booking_service";
import { getSamplesByBookingId } from "@/services/sample_service";
import { getTestParametersByServiceId } from "@/services/parameters-service";
import {
  getResultDetailsByBookingId,
  createMultipleResultDetails,
} from "@/services/result-service";

import type { Booking } from "@/types/booking";
import type { Sample } from "@/types/sample";
import type { TestParameter } from "@/types/testparameters";
import type { ResultItem } from "@/types/resultdetail";

const serviceId = 1;

export default function AddResultPage() {
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingOptions, setBookingOptions] = useState<Booking[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      const bookings = await getAllBookings();
      const parameters = await getTestParametersByServiceId(serviceId);
      setBookingOptions(bookings);
      setTestParameters(parameters);
      if (bookings.length > 0) setBookingId(bookings[0].bookingId);
    };
    fetchInit();
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sampleList, resultList] = await Promise.all([
          getSamplesByBookingId(bookingId),
          getResultDetailsByBookingId(bookingId),
        ]);
        setSamples(sampleList);

        const resultMap: Record<string, string> = {};
        resultList.forEach((r) => {
          const [v1, v2] = r.value.split("-");
          resultMap[`${r.sampleId}-${r.testParameterId}-1`] = v1 || "";
          resultMap[`${r.sampleId}-${r.testParameterId}-2`] = v2 || "";
        });

        setValues(resultMap);
        setEditable(resultList.length === 0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const buildKey = (sampleId: number, paramId: number, index: 1 | 2) =>
    `${sampleId}-${paramId}-${index}`;

  const handleChange = (key: string, value: string) => {
    if (!editable) return;
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!bookingId) return;

    const resultItems: ResultItem[] = [];

    for (const sample of samples) {
      for (const param of testParameters) {
        const key1 = buildKey(sample.sampleId, param.testParameterId, 1);
        const key2 = buildKey(sample.sampleId, param.testParameterId, 2);
        let value = values[key1] || "";
        if (values[key2]) {
          value = `${value}-${values[key2]}`;
        }
        resultItems.push({
          sampleId: sample.sampleId,
          testParameterId: param.testParameterId,
          value,
        });
      }
    }

    await createMultipleResultDetails({
      bookingId,
      results: resultItems,
    });
    alert("Lưu kết quả thành công!");
    setEditable(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-sm">
        <label className="font-semibold mb-2 block">Chọn booking:</label>
        <Select
          value={bookingId?.toString()}
          onValueChange={(val: string) => setBookingId(Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn booking ID" />
          </SelectTrigger>
          <SelectContent>
            {bookingOptions.map((b) => (
              <SelectItem key={b.bookingId} value={b.bookingId.toString()}>
                Booking #{b.bookingId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {bookingId && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Kết quả xét nghiệm – Booking #{bookingId}</CardTitle>
            {!editable && (
              <Button variant="outline" onClick={() => setEditable(true)}>
                Sửa kết quả
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="w-full h-[200px] rounded-md" />
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Chỉ số</TableHead>
                      {samples.map((s) => (
                        <TableHead key={s.sampleId} className="text-center">
                          {s.participantName}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testParameters.map((param) => (
                      <TableRow key={param.testParameterId}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {param.name}
                        </TableCell>
                        {samples.map((sample) => {
                          const key1 = buildKey(sample.sampleId, param.testParameterId, 1);
                          const key2 = buildKey(sample.sampleId, param.testParameterId, 2);
                          return (
                            <TableCell key={`${sample.sampleId}-${param.testParameterId}`} className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Input
                                  className="w-16 text-center"
                                  value={values[key1] || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(key1, e.target.value)
                                  }
                                  disabled={!editable}
                                />
                                <span>-</span>
                                <Input
                                  className="w-16 text-center"
                                  value={values[key2] || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(key2, e.target.value)
                                  }
                                  disabled={!editable}
                                />
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {editable && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave}>Lưu kết quả</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
