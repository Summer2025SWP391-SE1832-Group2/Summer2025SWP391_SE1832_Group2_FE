import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSamplesByBookingId } from '@/services/sample_service';
import {
  createMultipleResultDetails,
  getResultDetailsByBookingId,
  updateMultipleResultDetails,
} from '@/services/result-service';

import { getBookingById } from '@/services/booking_service';

import type { ResultItem } from '@/types/resultdetail';
import type { Sample } from '@/types/sample';
import type { TestParameter } from '@/types/testparameters';

import { getTestParametersByBookingId } from '@/services/test_parameters-service';

import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { paths } from '@/utils/constant/path';
import ExcelImport from '@/components/common/xlsx/ExcelImport';

export default function AddResultPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);

  const [samples, setSamples] = useState<Sample[]>([]);
  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [resultDetails, setResultDetails] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, [string, string]>>({});
  const [finalResult] = useState<string>('');
  const [serviceId, setServiceId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sampleData, parameterData, resultData, bookingData] = await Promise.all([
          getSamplesByBookingId(bookingId),
          getTestParametersByBookingId(bookingId),
          getResultDetailsByBookingId(bookingId),
          getBookingById(bookingId),
        ]);

        if (sampleData.length === 0) {
          alert('Booking chưa có mẫu. Vui lòng thêm mẫu trước.');
          navigate(-1);
          return;
        }

        setServiceId(bookingData.serviceId);
        setSamples(sampleData);
        setTestParameters(parameterData);

        const resultItems: ResultItem[] = resultData.map((r) => ({
          resultDetailId: (r as any).resultDetailId ?? 0,
          bookingId,
          testParameterId: r.testParameterId,
          sampleId: r.sampleId,
          parameterName: r.parameterName || r.name || '',
          value: r.value,
        }));

        setResultDetails(resultItems);

        const newValues: Record<string, [string, string]> = {};
        resultItems.forEach((r) => {
          const key = `${r.testParameterId}-${r.sampleId}`;
          if (bookingData.serviceId === 7) {
            // Không tách nếu là serviceId 7 (cho phép giá trị âm)
            newValues[key] = [r.value || '', ''];
          } else {
            const split = r.value.split('-');
            newValues[key] = [split[0] || '', split[1] || ''];
          }
        });
        setValues(newValues);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!bookingId || isNaN(bookingId)) {
      alert('Booking ID không hợp lệ.');
      navigate(paths.staff.bookingList);
      return;
    }

    fetchData();
  }, [bookingId, navigate]);

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

        const value =
          serviceId === 7
            ? valPair[0]
            : valPair.filter(Boolean).join('-');

        const existing = resultDetails.find(
          (r) => r.testParameterId === param.testParameterId && r.sampleId === sample.sampleId
        );

        resultItems.push({
          resultDetailId: existing?.resultDetailId ?? 0,
          bookingId,
          testParameterId: param.testParameterId,
          sampleId: sample.sampleId,
          parameterName: param.name,
          value,
        });
      }
    }

    const toCreate = resultItems.filter((item) => item.resultDetailId === 0);
    const toUpdate = resultItems.filter((item) => item.resultDetailId !== 0);

    try {
      const payload = {
        bookingId,
        finalResult,
        results: [...toUpdate, ...toCreate],
      };

      if (toUpdate.length > 0) {
        await updateMultipleResultDetails(payload);
      } else if (toCreate.length > 0) {
        await createMultipleResultDetails(payload);
      }

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
            <>
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
                            <td key={sample.sampleId} className='border p-2 text-center'>
                              {serviceId === 7 ? (
                                <div className='flex items-center justify-center'>
                                  {param.name.toLowerCase() === 'cfdna' ? (
                                    <div className='relative w-32'>
                                      <Input
                                        placeholder='cfDNA'
                                        value={valPair[0]}
                                        onChange={(e) =>
                                          handleChange(sample.sampleId, param.testParameterId, 0, e.target.value)
                                        }
                                        className='pr-6'
                                      />
                                      <span className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm'>%</span>
                                    </div>
                                  ) : (
                                    <Input
                                      placeholder='Số âm/số dương'
                                      value={valPair[0]}
                                      onChange={(e) =>
                                        handleChange(sample.sampleId, param.testParameterId, 0, e.target.value)
                                      }
                                      className='w-32'
                                    />
                                  )}
                                </div>
                              ) : (
                                <div className='flex gap-2 justify-center'>
                                  <Input
                                    placeholder='Giá trị 1'
                                    value={valPair[0]}
                                    onChange={(e) =>
                                      handleChange(sample.sampleId, param.testParameterId, 0, e.target.value)
                                    }
                                    className='w-20'
                                  />
                                  <Input
                                    placeholder='Giá trị 2'
                                    value={valPair[1]}
                                    onChange={(e) =>
                                      handleChange(sample.sampleId, param.testParameterId, 1, e.target.value)
                                    }
                                    className='w-20'
                                  />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ExcelImport
                testParameters={testParameters}
                samples={samples}
                serviceId={serviceId}
                onImport={(imported) => {
                  setValues((prev) => ({ ...prev, ...imported }));
                }}
              />


              <div className='mt-6 flex justify-end'>
                <Button onClick={handleSave}>Lưu kết quả</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
