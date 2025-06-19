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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

interface TestParameter {
  testParameterId: number;
  name: string;
}

interface ResultDetail {
  sampleId: number;
  testParameterId: number;
  value: string;
}

const bookingOptions = [
  { label: "Booking 1", value: "1" },
  { label: "Booking 2", value: "2" },
];

const mockTestParameters: TestParameter[] = Array.from({ length: 20 }, (_, i) => ({
  testParameterId: i + 1,
  name: `Parameter ${i + 1}`,
}));

const mockResultDetails: ResultDetail[] = [
  ...mockTestParameters.map((p) => ({
    sampleId: 1,
    testParameterId: p.testParameterId,
    value: (Math.random() * 10).toFixed(2),
  })),
  ...mockTestParameters.map((p) => ({
    sampleId: 2,
    testParameterId: p.testParameterId,
    value: (Math.random() * 10).toFixed(2),
  })),
];

export default function ResultPage() {
  const [selectedBookingId, setSelectedBookingId] = useState("1");
  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [resultDetails, setResultDetails] = useState<ResultDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 400));
      setTestParameters(mockTestParameters);
      setResultDetails(mockResultDetails);
      setLoading(false);
    };
    load();
  }, [selectedBookingId]);

  const sampleIds = [...new Set(resultDetails.map((r) => r.sampleId))];

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-sm">
        <Select
          value={selectedBookingId}
          onValueChange={setSelectedBookingId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn booking" />
          </SelectTrigger>
          <SelectContent>
            {bookingOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kết quả Booking: {selectedBookingId}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="w-full h-[200px] rounded-md" />
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Chỉ số</TableHead>
                    {sampleIds.map((sampleId) => (
                      <TableHead key={sampleId} className="text-center">
                        Sample {sampleId}
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Pi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testParameters.map((param) => {
                    const piValue = Math.PI; // bạn có thể đổi sang công thức khác nếu muốn
                    return (
                      <TableRow key={param.testParameterId}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {param.name}
                        </TableCell>
                        {sampleIds.map((sampleId) => {
                          const match = resultDetails.find(
                            (r) =>
                              r.sampleId === sampleId &&
                              r.testParameterId === param.testParameterId
                          );
                          return (
                            <TableCell key={sampleId} className="text-center">
                              {match?.value || "-"}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center">{piValue.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Total row */}
                  <TableRow>
                    <TableCell className="font-bold">Tổng cộng</TableCell>
                    {sampleIds.map((id) => (
                      <TableCell key={id} />
                    ))}
                    <TableCell className="text-center font-bold">
                      {(testParameters.length * Math.PI).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
