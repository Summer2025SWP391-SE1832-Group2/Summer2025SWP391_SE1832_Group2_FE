import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from '@/services/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useService = (serviceId?: number) => {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      // Invalidate and refetch services list
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Error creating service:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      // Invalidate and refetch services list
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Error updating service:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
    },
  });

  return {
    queryServices,
    createMutation,
    updateMutation,
    deleteMutation,
    queryServiceById,
  };
};
