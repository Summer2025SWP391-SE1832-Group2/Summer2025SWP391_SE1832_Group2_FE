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
  
  export const ResultContent = ({ resultDetails }: { resultDetails: ResultDetail[] }) => {
    if (!resultDetails || resultDetails.length === 0) {
      return <p className="text-sm text-muted-foreground italic">Chưa có kết quả.</p>;
    }
  
    // Lấy danh sách sampleId
    const sampleIds = [...new Set(resultDetails.map((r) => r.sampleId))].sort((a, b) => a - b);
  
    // Lấy danh sách unique chỉ số (testParameterId)
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
  
    // Chia đôi parameters
    const middleIndex = Math.ceil(parameters.length / 2);
    const firstHalf = parameters.slice(0, middleIndex);
    const secondHalf = parameters.slice(middleIndex);
  
    return (
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[firstHalf, secondHalf].map((paramGroup, index) => (
            <Table key={index}>
              <TableHeader>
                <TableRow>
                  <TableHead>Chỉ số</TableHead>
                  {sampleIds.map((sid) => (
                    <TableHead key={sid} className="text-center">
                      Mẫu {sid}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paramGroup.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell>
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
                          {result?.value || "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))}
        </div>
      </TooltipProvider>
    );
  };