import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSamplesByBookingId } from "@/services/sample_service";
import { createMultipleResultDetails, getResultDetailsByBookingId } from "@/services/result-service";

import type { ResultItem } from "@/types/resultdetail";
import type { Sample } from "@/types/sample";
import { ArrowLeft } from 'lucide-react';
import { getTestParametersByBookingId } from '@/services/test_parameters-service';


import type { TestParameter } from '@/types/testparameters';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

export default function AddResultPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);

  const [samples, setSamples] = useState<Sample[]>([]);
  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, [string, string]>>({});
  const [finalResult, setFinalResult] = useState<string>('');

  useEffect(() => {
    if (!bookingId || isNaN(bookingId)) {
      alert('Booking ID không hợp lệ.');
      navigate('/dashboard/bookinglist');
      return;
    }

const fetchData = async () => {
  setLoading(true);
  try {
    const [sampleData, parameterData] = await Promise.all([
      getSamplesByBookingId(bookingId),
      getTestParametersByBookingId(bookingId),
    ]);

    if (sampleData.length === 0) {
      alert('Booking chưa có mẫu. Vui lòng thêm mẫu trước.');
      navigate(-1);
      return;
    }

    const resultDetails = await getResultDetailsByBookingId(bookingId);

    setSamples(sampleData);
    setTestParameters(parameterData);

    const newValues: Record<string, [string, string]> = {};
    resultDetails.forEach((r) => {
      const key = `${r.testParameterId}-${r.sampleId}`;
      const split = r.value.split(',');
      newValues[key] = [split[0] || '', split[1] || ''];
    });
    setValues(newValues);
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu:', err);
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, [bookingId]);

  const handleChange = (sampleId: number, testParameterId: number, index: 0 | 1, value: string) => {
    const key = `${testParameterId}-${sampleId}`;
    setValues((prev) => {
      const existing = prev[key] || ['', ''];
      const updated: [string, string] = [...existing] as [string, string];
      updated[index] = value;
      return { ...prev, [key]: updated };
    });
  };

  const handleSave = async () => {
    const resultItems: ResultItem[] = [];
    for (const param of testParameters) {
      for (const sample of samples) {
        const key = `${param.testParameterId}-${sample.sampleId}`;
        const valPair = values[key] || ['', ''];
        const value = valPair.filter(Boolean).join(',');

        resultItems.push({
          resultDetailId: 0,
          bookingId,
          testParameterId: param.testParameterId,
          sampleId: sample.sampleId,
          parameterName: param.name,
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
            testParameters.find((p) => p.testParameterId === item.testParameterId)?.name || '',
        })),
      });
      alert('Lưu kết quả thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu:', err);
      alert('Lỗi khi lưu kết quả.');
    }
  };

  return (
    <div className='p-6 space-y-4'>
      <div className='flex justify-start mb-4'>
        <Button variant='outline' onClick={() => navigate(-1)} className='flex items-center gap-2'>
          <ArrowLeft className='w-4 h-4' /> Quay lại
        </Button>
      </div>

      <Card className='rounded-2xl shadow-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>
            Nhập kết quả xét nghiệm (Booking: {bookingId})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className='w-full h-[200px] rounded-md' />
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full table-auto border border-muted rounded-md'>
                <thead className='bg-muted'>
                  <tr>
                    <th className='px-4 py-2 border-b text-left'>Chỉ số</th>
                    {samples.map((sample) => (
                      <th key={sample.sampleId} className='px-4 py-2 border-b text-center'>
                        {sample.participantName || `Mẫu ${sample.sampleId}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {testParameters.map((param) => (
                    <tr key={param.testParameterId} className='hover:bg-muted/30'>
                      <td className='border p-2 whitespace-nowrap font-medium'>{param.name}</td>
                      {samples.map((sample) => {
                        const key = `${param.testParameterId}-${sample.sampleId}`;
                        const valPair = values[key] || ['', ''];
                        return (
                          <td key={sample.sampleId} className='border p-2'>
                            <div className='flex gap-2 justify-center'>
                              <Input
                                value={valPair[0]}
                                onChange={(e) =>
                                  handleChange(
                                    sample.sampleId,
                                    param.testParameterId,
                                    0,
                                    e.target.value,
                                  )
                                }
                                className='w-20'
                              />
                              <Input
                                value={valPair[1]}
                                onChange={(e) =>
                                  handleChange(
                                    sample.sampleId,
                                    param.testParameterId,
                                    1,
                                    e.target.value,
                                  )
                                }
                                className='w-20'
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
          <div className='mt-6'>
            <Label className='block mb-2'>Nhận định của bác sĩ:</Label>
            <Input
              value={finalResult}
              onChange={(e) => setFinalResult(e.target.value)}
              placeholder='Nhập nhận định tổng quát'
            />
          </div>
          <div className='mt-6 flex justify-end'>
            <Button onClick={handleSave}>Lưu kết quả</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
