import { formatCurrency } from '@/utils/helper';

type BookingHeroSectionProps = {
  service: {
    name: string;
    description: string;
    price: number;
    durationDays: number;
  };
};

export const BookingHeroSection = ({ service }: BookingHeroSectionProps) => (
  <section className='mb-16 text-center'>
    <span className='inline-block text-sm font-medium text-primary mb-3 tracking-wider uppercase'>
      DNA Testing Service
    </span>
    <h1 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent h-15'>
      {service.name}
    </h1>
    <p className='text-xl text-muted-foreground max-w-3xl mx-auto mb-8'>{service.description}</p>
    <div className='flex flex-wrap items-center justify-center gap-6'>
      <div className='bg-primary/10 dark:bg-primary/20 rounded-full px-6 py-3 flex items-center gap-2'>
        <span className='font-medium'>Thời gian xử lý: {service.durationDays} ngày</span>
      </div>
      <div className='bg-primary/10 dark:bg-primary/20 rounded-full px-6 py-3 flex items-center gap-2'>
        <span className='font-medium text-lg'>{formatCurrency(service.price)}</span>
      </div>
    </div>
  </section>
);
