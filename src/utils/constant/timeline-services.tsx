import { CheckCircle } from 'lucide-react';

// Timeline steps for each method
const atFacilitySteps = [
  {
    title: 'Đặt lịch hẹn',
    description: 'Đặt lịch đến cơ sở y tế',
    date: '1',
    icon: <CheckCircle className='h-4 w-4' />,
    status: 'completed',
  },
  {
    title: 'Đến cơ sở y tế',
    description: 'Đến cơ sở theo lịch hẹn',
    date: '2',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Thu mẫu xét nghiệm',
    description: 'Nhân viên y tế thu mẫu',
    date: '3',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Xét nghiệm',
    description: 'Mẫu được phân tích tại phòng lab',
    date: '4',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Nhận kết quả',
    description: 'Kết quả được gửi trong vòng 3-5 ngày',
    date: '5',
    icon: <CheckCircle className='h-4 w-4' />,
  },
];

const selfCollectionSteps = [
  {
    title: 'Đặt mua bộ kit',
    description: 'Đặt và nhận bộ kit tại nhà',
    date: '1',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Tự thu mẫu',
    description: 'Thu mẫu theo hướng dẫn',
    date: '2',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Gửi mẫu',
    description: 'Gửi mẫu về cơ sở y tế',
    date: '3',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Xét nghiệm',
    description: 'Mẫu được phân tích tại phòng lab',
    date: '4',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Nhận kết quả',
    description: 'Kết quả được gửi trong vòng 3-5 ngày',
    date: '5',
    icon: <CheckCircle className='h-4 w-4' />,
  },
];

const staffVisitSteps = [
  {
    title: 'Đặt lịch hẹn',
    description: 'Đặt lịch để nhân viên đến nhà',
    date: '1',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Nhân viên đến nhà',
    description: 'Nhân viên đến địa chỉ theo lịch hẹn',
    date: '2',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Thu mẫu xét nghiệm',
    description: 'Nhân viên y tế thu mẫu',
    date: '3',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Xét nghiệm',
    description: 'Mẫu được phân tích tại phòng lab',
    date: '4',
    icon: <CheckCircle className='h-4 w-4' />,
  },
  {
    title: 'Nhận kết quả',
    description: 'Kết quả được gửi trong vòng 3-5 ngày',
    date: '5',
    icon: <CheckCircle className='h-4 w-4' />,
  },
];

export { atFacilitySteps, selfCollectionSteps, staffVisitSteps };
