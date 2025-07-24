import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ResultDetail } from "@/types/resultdetail";

export const ResultContent = ({
  resultDetails,
  serviceId,
}: {
  resultDetails: ResultDetail[];
  serviceId?: number;
}) => {
  if (!resultDetails || resultDetails.length === 0) {
    return <p className="text-sm text-muted-foreground italic">Chưa có kết quả.</p>;
  }

  const sampleIds = [...new Set(resultDetails.map((r) => r.sampleId))].sort((a, b) => a - b);
  const parameters = [
    ...new Map(
      resultDetails.map((r) => [
        r.testParameterId,
        {
          id: r.testParameterId,
          name: r.parameterName || r.name || `#${r.testParameterId}`,
          description: r.description || "Không có mô tả.",
        },
      ])
    ).values(),
  ];

  const hidePi = serviceId === 7;
  const middleIndex = Math.ceil(parameters.length / 2);
  const firstHalf = parameters.slice(0, middleIndex);
  const secondHalf = parameters.slice(middleIndex);

  return (
    <TooltipProvider>
      {parameters.length <= 10 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-2">Chỉ số</TableHead>
                {sampleIds.map((sid) => (
                  <TableHead key={sid} className="text-center">
                    Mẫu {sid}
                  </TableHead>
                ))}
                {!hidePi && (
                  <TableHead className="text-center">Số pi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.map((param) => (
                <TableRow key={param.id}>
                  <TableCell className="p-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help font-medium">{param.name}</span>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={0}>
                        <p>{param.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {sampleIds.map((sid) => {
                    const result = resultDetails.find(
                      (r) => r.testParameterId === param.id && r.sampleId === sid
                    );
                    return (
                      <TableCell key={sid} className="text-center">
                        {result?.value ?? "-"}
                      </TableCell>
                    );
                  })}
                  {!hidePi && (
                    <TableCell className="text-center">
                      {(() => {
                        const resultWithPi = resultDetails.find(
                          (r) => r.testParameterId === param.id && r.pi != null
                        );
                        return resultWithPi?.pi != null
                          ? resultWithPi.pi === 0
                            ? "0"
                            : resultWithPi.pi.toFixed(3)
                          : "";
                      })()}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {[firstHalf, secondHalf].map((paramGroup, index) => (
            <div key={index} className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="p-2">Chỉ số</TableHead>
                    {sampleIds.map((sid) => (
                      <TableHead key={sid} className="text-center">
                        Mẫu {sid}
                      </TableHead>
                    ))}
                    {!hidePi && (
                      <TableHead className="text-center">Số pi</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paramGroup.map((param) => (
                    <TableRow key={param.id}>
                      <TableCell className="p-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help font-medium">{param.name}</span>
                          </TooltipTrigger>
                          <TooltipContent side="right" sideOffset={0}>
                            <p>{param.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      {sampleIds.map((sid) => {
                        const result = resultDetails.find(
                          (r) => r.testParameterId === param.id && r.sampleId === sid
                        );
                        return (
                          <TableCell key={sid} className="text-center">
                            {result?.value ?? "-"}
                          </TableCell>
                        );
                      })}
                      {!hidePi && (
                        <TableCell className="text-center">
                          {(() => {
                            const resultWithPi = resultDetails.find(
                              (r) => r.testParameterId === param.id && r.pi != null
                            );
                            return resultWithPi?.pi != null
                              ? resultWithPi.pi === 0
                                ? "0"
                                : resultWithPi.pi.toFixed(3)
                              : "";
                          })()}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}
    </TooltipProvider>
  );
};
