import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from '@/services/services';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useService = (serviceId?: number) => {
  const queryServices = useQuery({
    queryKey: ['services'],
    queryFn: getAllServices,
  });

  const queryServiceById = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => getServiceById(serviceId ?? 0),
    enabled: !!serviceId,
  });

  const createMutation = useMutation({
    mutationFn: createService,
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
  });

  return {
    queryServices,
    createMutation,
    updateMutation,
    deleteMutation,
    queryServiceById,
  };
};
