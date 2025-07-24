import * as XLSX from 'xlsx';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TestParameter } from "@/types/testparameters";
import type { Sample } from "@/types/sample";

interface ExcelImportProps {
  onImport: (data: Record<string, [string, string]>) => void;
  testParameters: TestParameter[];
  samples: Sample[];
  serviceId: number | null;
}

export default function ExcelImport({
  onImport,
  testParameters,
  samples,
  serviceId,
}: ExcelImportProps) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

      const importedValues: Record<string, [string, string]> = {};
      const isSingleValue = serviceId === 7;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const testName = row[0]?.toString().trim();
        if (!testName) continue;

        const testParam = testParameters.find(
          (tp) => tp.name?.trim().toLowerCase() === testName.toLowerCase()
        );
        if (!testParam) continue;

        if (isSingleValue) {
          for (let j = 1; j < row.length; j++) {
            const col1 = row[j]?.toString() || '';
            const sample = samples[j - 1];
            if (!sample) continue;

            const key = `${testParam.testParameterId}-${sample.sampleId}`;
            importedValues[key] = [col1, ''];
          }
        } else {
          for (let j = 1; j < row.length; j += 2) {
            const col1 = row[j]?.toString() || '';
            const col2 = row[j + 1]?.toString() || '';
            const sampleIndex = Math.floor((j - 1) / 2);
            const sample = samples[sampleIndex];
            if (!sample) continue;

            const key = `${testParam.testParameterId}-${sample.sampleId}`;
            importedValues[key] = [col1, col2];
          }
        }
      }

      onImport(importedValues);
    } catch (err) {
      console.error('Lỗi khi xử lý file Excel:', err);
      alert('Không đọc được file Excel. Vui lòng kiểm tra lại định dạng.');
    }
  };

  return (
    <div className="mt-6">
      <Label htmlFor="excel-upload">Nhập từ file Excel</Label>
      <Input
        id="excel-upload"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mt-1 w-1/2"
      />
    </div>
  );
}
