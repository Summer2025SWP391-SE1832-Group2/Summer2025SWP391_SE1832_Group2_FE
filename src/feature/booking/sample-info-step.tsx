import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BookingFormValues } from '@/lib/zod/booking';
import { TestTube, User } from 'lucide-react';
import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface SampleInfoStepProps {
  form: UseFormReturn<BookingFormValues>;
  sampleTypeOptions: { label: string; value: string }[];
  relationshipOptions: { label: string; value: string }[];
  isNiptService?: boolean;
}

// Mapping of relationships (if one sample is X, the other should be Y)
const relationshipMapping: Record<string, string> = {
  Cha: 'Con',
  Mẹ: 'Con',
  Con: 'Cha/Mẹ',
};

export function SampleInfoStep({
  form,
  sampleTypeOptions,
  relationshipOptions,
  isNiptService = false,
}: SampleInfoStepProps) {
  // Handle relationship change for either sample
  const handleRelationshipChange = (sampleIndex: number, value: string) => {
    // Set the value for the current sample
    form.setValue(`samples.${sampleIndex}.notes`, value);

    // Only set the relationship for the second sample if not NIPT service
    if (!isNiptService) {
      form.setValue(`samples.${sampleIndex === 0 ? 1 : 0}.notes`, relationshipMapping[value]);
    }
  };

  // Set default values for NIPT service
  useEffect(() => {
    if (isNiptService) {
      // Set default relationship to "Mẹ" for the first sample
      form.setValue('samples.0.notes', 'Mẹ');
    }
  }, [form, isNiptService]);

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold mb-2'>Thông tin mẫu xét nghiệm</h2>
        <p className='text-muted-foreground'>
          {isNiptService
            ? 'Vui lòng cung cấp thông tin chi tiết về mẫu xét nghiệm'
            : 'Vui lòng cung cấp thông tin chi tiết về hai mẫu xét nghiệm'}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto'>
        {/* Sample 1 */}
        <Card className='border-2 border-primary/20'>
          <CardHeader className='text-center bg-primary/5'>
            <CardTitle className='flex items-center justify-center gap-2'>
              <TestTube className='h-5 w-5' />
              {isNiptService ? 'Thông tin mẫu' : 'Mẫu thứ nhất'}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 pt-6'>
            <FormField
              control={form.control}
              name={`samples.0.participantName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Tên người tham gia
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập họ và tên đầy đủ' className='h-12' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`samples.0.sampleType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại mẫu sinh học</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='h-12'>
                        <SelectValue placeholder='Chọn loại mẫu' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sampleTypeOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='cursor-pointer'
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`samples.0.notes`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mối quan hệ</FormLabel>
                  <Select
                    onValueChange={(value) => handleRelationshipChange(0, value)}
                    value={field.value || ''}
                    disabled={isNiptService}
                  >
                    <FormControl>
                      <SelectTrigger className='h-12'>
                        <SelectValue placeholder='Chọn mối quan hệ' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='cursor-pointer'
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Sample 2 - Only show if not NIPT service */}
        {!isNiptService && (
          <Card className='border-2 border-secondary/20'>
            <CardHeader className='text-center bg-secondary/5'>
              <CardTitle className='flex items-center justify-center gap-2'>
                <TestTube className='h-5 w-5' />
                Mẫu thứ hai
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 pt-6'>
              <FormField
                control={form.control}
                name={`samples.1.participantName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      Tên người tham gia
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập họ và tên đầy đủ' className='h-12' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`samples.1.sampleType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại mẫu sinh học</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-12'>
                          <SelectValue placeholder='Chọn loại mẫu' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleTypeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className='cursor-pointer'
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`samples.1.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mối quan hệ</FormLabel>
                    <Select
                      onValueChange={(value) => handleRelationshipChange(1, value)}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className='h-12'>
                          <SelectValue placeholder='Chọn mối quan hệ' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {relationshipOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className='cursor-pointer'
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
