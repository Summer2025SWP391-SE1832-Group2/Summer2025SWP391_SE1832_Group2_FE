import { getWorkSchedule } from '@/services/work_schedule_services';
import { useQuery } from '@tanstack/react-query';

const useWorkSchedule = () => {
  const getWorkScheduleQuery = useQuery({
    queryKey: ['workSchedule'],
    queryFn: getWorkSchedule,
  });

  return {
    getWorkScheduleQuery,
  };
};

export default useWorkSchedule;
