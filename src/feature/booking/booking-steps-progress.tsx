import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  icon: React.ElementType;
}

interface BookingStepsProgressProps {
  steps: Step[];
  currentStep: number;
}

export function BookingStepsProgress({ steps, currentStep }: BookingStepsProgressProps) {
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-center space-x-8 mb-8'>
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className='flex items-center'>
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200',
                  isActive && 'bg-primary text-white scale-110',
                  isCompleted && 'bg-green-500 text-white',
                  !isActive && !isCompleted && 'bg-gray-200 text-gray-600',
                )}
              >
                {isCompleted ? <Check className='h-5 w-5' /> : <step.icon className='h-5 w-5' />}
              </div>
              <div className='ml-3 hidden md:block'>
                <p
                  className={cn(
                    'text-sm font-medium',
                    isActive && 'text-primary',
                    isCompleted && 'text-green-600',
                  )}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && <ChevronRight className='h-4 w-4 text-gray-400 ml-6' />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
