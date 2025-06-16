import axiosInstance from "@/lib/api/axios";
import type { Blog, BlogType } from "@/types/blog";

const getAllBlogs = async (): Promise<Blog[]> => {
  const response = await axiosInstance.get<Blog[]>("/api/Blog");
  return response.data;
};

const getAllBlogByBlogTypeID = async (id : number): Promise<Blog[]> => {
  const response = await axiosInstance.get<Blog[]>(`/api/Blog/type/${id}`);
  console.log("getAllBlogByBlogTypeID response: ", response.data);
  return response.data;
};

const getAllBlogtype = async (): Promise<BlogType[]> => {
  const response = await axiosInstance.get<BlogType[]>("/api/BlogsType");
  return response.data;
};

const getBlogById = async (id: number): Promise<Blog> => {
    const response = await axiosInstance.get<Blog>(`/api/Blog/${id}`);
    return response.data;
  };
  

const createBlog = async (data: Omit<Blog, "blogId">): Promise<Blog> => {
  const response = await axiosInstance.post<Blog>("/api/Blog", data);
  console.log("createBlog data: ", data);
  console.log("createBlog response: ", response.data);
  return response.data;
};


const updateBlog = async (id: number, data: Partial<Blog>): Promise<Blog> => {
  const response = await axiosInstance.put<Blog>(`/api/Blog/${id}`, data);
  return response.data;
};

const deleteBlog = async (id: number): Promise<void> => {
  await axiosInstance.delete( `/api/Blog/${id}`);
};

const updateBlogType = async ( data: Partial<BlogType>): Promise<BlogType> => {
  const response = await axiosInstance.put<BlogType>(`/api/BlogsType`, data);
  return response.data;
};

export {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogByBlogTypeID,
  getAllBlogtype,
  updateBlogType
};