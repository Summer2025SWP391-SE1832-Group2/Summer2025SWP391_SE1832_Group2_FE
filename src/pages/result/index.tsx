import { useEffect, useState } from "react";
import { getTestParametersByServiceId } from "@/services/parameters-service";
import { getResultDetailsByBookingId } from "@/services/result-service";
import type { TestParameter } from "@/types/testparameters";
import type { ResultDetail } from "@/types/resultdetail";

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

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  const sampleIds = [...new Set(resultDetails.map((r) => r.sampleId))];

  const rows = testParameters.map((param) => {
    const row: Record<string, string> = { name: param.name };
    sampleIds.forEach((sampleId) => {
      const match = resultDetails.find(
        (r) =>
          r.sampleId === sampleId &&
          r.testParameterId === param.testParameterId
      );
      row[`sample-${sampleId}`] = match?.value || "-";
    });
    return row;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kết quả booking: {bookingId}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">Tên</th>
              {sampleIds.map((id) => (
                <th key={id} className="px-4 py-2 text-left border-b">
                  Sample {id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{row.name}</td>
                {sampleIds.map((id) => (
                  <td key={id} className="px-4 py-2 border-b">
                    {row[`sample-${id}`]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultPage;
