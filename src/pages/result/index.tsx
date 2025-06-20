  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";

  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
  } from "@/components/ui/table";
  import { Skeleton } from "@/components/ui/skeleton";

  import { getResultDetailsByBookingId } from "@/services/result-service";
  import type { ResultDetail } from "@/types/resultdetail";

  function calculatePI(childAlleles: string[], fatherAlleles: string[]): number {
    const isSexMarker = (alleles: string[]) => {
      const set = new Set(alleles.map((s) => s.trim().toUpperCase()));
      return set.has("X") && (set.has("Y") || set.size === 1);
    };

    if (isSexMarker(childAlleles) || isSexMarker(fatherAlleles)) return -1;

    const matches = childAlleles.filter((a) => fatherAlleles.includes(a));
    if (matches.length === 0) return 0;
    if (childAlleles[0] === childAlleles[1] && fatherAlleles[0] === fatherAlleles[1] && childAlleles[0] === fatherAlleles[0]) {
      return 2;
    }
    if (matches.length === 1) return 1;
    return 1;
  }

  function calculateCombinedPI(
    resultDetails: ResultDetail[],
    childSampleId: number,
    allegedFatherSampleId: number
  ): {
    perLocus: { name: string; pi: number; testParameterId: number }[];
    combinedPI: number;
    probability: number;
  } {
    const testParameters = Array.from(new Set(resultDetails.map((r) => r.testParameterId)));

    const results: { name: string; pi: number; testParameterId: number }[] = [];

    for (const paramId of testParameters) {
      const child = resultDetails.find((r) => r.sampleId === childSampleId && r.testParameterId === paramId);
      const father = resultDetails.find((r) => r.sampleId === allegedFatherSampleId && r.testParameterId === paramId);

      if (!child || !father) continue;

      const childAlleles = child.value.split(",");
      const fatherAlleles = father.value.split(",");
      const pi = calculatePI(childAlleles, fatherAlleles);

      results.push({
        name: child.name ?? `ID ${paramId}`,
        pi,
        testParameterId: paramId,
      });
    }

    const validPIs = results.filter((r) => r.pi > 0);
    const combinedPI = validPIs.reduce((acc, item) => acc * item.pi, 1);
    const probability = combinedPI / (combinedPI + 1);

    return { perLocus: results, combinedPI, probability };
  }

  export default function ResultPage() {
    const { id } = useParams<{ id: string }>();
    const [resultDetails, setResultDetails] = useState<ResultDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [combinedPI, setCombinedPI] = useState<number>(0);
    const [probability, setProbability] = useState<number>(0);
    const [perLocus, setPerLocus] = useState<{
      name: string;
      pi: number;
      testParameterId: number;
    }[]>([]);

    useEffect(() => {
      if (!id) return;

      const fetchResult = async () => {
        try {
          setLoading(true);
          const response = await getResultDetailsByBookingId(Number(id));
          setResultDetails(response);

          const sampleIds = [...new Set(response.map((r) => r.sampleId))].sort((a, b) => a - b);
          if (sampleIds.length >= 2) {
            const { perLocus, combinedPI, probability } = calculateCombinedPI(response, sampleIds[0], sampleIds[1]);
            setPerLocus(perLocus);
            setCombinedPI(combinedPI);
            setProbability(probability);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu kết quả:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchResult();
    }, [id]);

    const sampleIds = [...new Set(resultDetails.map((r) => r.sampleId))];

    const testParameters = [
      ...new Map(
        resultDetails.map((r) => [
          r.testParameterId,
          { testParameterId: r.testParameterId, name: r.name ?? `ID ${r.testParameterId}` },
        ])
      ).values(),
    ];

    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Kết quả Booking #{id}</CardTitle>
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
                          Mẫu {sampleId}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">PI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testParameters.map((param) => {
                      const piItem = perLocus.find((p) => p.testParameterId === param.testParameterId);
                      return (
                        <TableRow key={param.testParameterId}>
                          <TableCell className="font-medium whitespace-nowrap">
                            {param.name}
                          </TableCell>
                          {sampleIds.map((sampleId) => {
                            const result = resultDetails.find(
                              (r) =>
                                r.sampleId === sampleId &&
                                r.testParameterId === param.testParameterId
                            );
                            return (
                              <TableCell key={sampleId} className="text-center">
                                {result?.value || "-"}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center">
                            {piItem ? (piItem.pi < 0 ? "(bỏ qua)" : piItem.pi.toFixed(2)) : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell className="font-bold">Tổng cộng</TableCell>
                      {sampleIds.map((id) => (
                        <TableCell key={id} />
                      ))}
                      <TableCell className="text-center font-bold">
                        {combinedPI.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold">Xác suất huyết thống</TableCell>
                      {sampleIds.map((id) => (
                        <TableCell key={id} />
                      ))}
                      <TableCell className="text-center font-bold">
                        {(probability * 100).toFixed(4)}%
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