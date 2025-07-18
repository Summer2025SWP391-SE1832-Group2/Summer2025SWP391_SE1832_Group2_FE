import axiosInstance from "@/lib/api/axios";
import type { Comment } from '@/types/blog';

const getBlockByBookId = async (id: number): Promise<Comment[]> => {
    const response = await axiosInstance.get<Comment[]>(`/api/Comment/blog/${id}`);
    return response.data;
  };
  const createComment = async (data: Comment): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>("/api/Comment", data);
    return response.data;
  };
  export { getBlockByBookId,createComment };