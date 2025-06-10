import { useEffect, useState } from "react";
import { getTestParametersByServiceId } from "@/services/parameters-service";
import { getResultDetailsByBookingId } from "@/services/result-service";
import type { TestParameter } from "@/types/testparameters";
import type { ResultDetail } from "@/types/resultdetail";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ResultPage = () => {
  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [resultDetails, setResultDetails] = useState<ResultDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const serviceId = 1;
  const bookingId = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [params, results] = await Promise.all([
          getTestParametersByServiceId(serviceId),
          getResultDetailsByBookingId(bookingId),
        ]);
        setTestParameters(params);
        setResultDetails(results);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId, bookingId]);

  const sampleIds = [...new Set(resultDetails.map((r) => r.sampleId))];

  const rows = sampleIds.map((sampleId) => {
    const row: Record<string, string> = { name: `Sample ${sampleId}` };
    testParameters.forEach((param) => {
      const match = resultDetails.find(
        (r) =>
          r.sampleId === sampleId &&
          r.testParameterId === param.testParameterId
      );
      row[`param-${param.testParameterId}`] = match?.value || "-";
    });
    return row;
  });

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Kết quả booking: {bookingId}
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
                    <th className="px-4 py-2 text-left border-b">Sample</th>
                    {testParameters.map((param) => (
                      <th
                        key={param.testParameterId}
                        className="px-4 py-2 text-left border-b"
                      >
                        {param.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/40">
                      <td className="px-4 py-2 border-b font-medium">
                        {row.name}
                      </td>
                      {testParameters.map((param) => (
                        <td
                          key={param.testParameterId}
                          className="px-4 py-2 border-b"
                        >
                          {row[`param-${param.testParameterId}`]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultPage;
