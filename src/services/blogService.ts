import axiosInstance from "@/lib/api/axios";
import type { Blog, Blogtype } from "@/types/blog";

const getAllBlogs = async (): Promise<Blog[]> => {
  const response = await axiosInstance.get<Blog[]>("/api/Blog");
  return response.data;
};

const getAllBlogByBlogTypeID = async (id : number): Promise<Blog[]> => {
  const response = await axiosInstance.get<Blog[]>(`/api/Blog/type/${id}`);
  return response.data;
};

const getAllBlogtype = async (): Promise<Blogtype[]> => {
  const response = await axiosInstance.get<Blogtype[]>("/api/BlogsType");
  return response.data;
};

const getBlogById = async (id: number): Promise<Blog> => {
    const response = await axiosInstance.get<Blog>(`/api/Blog/${id}`);
    return response.data;
  };
  

const createBlog = async (data: Omit<Blog, "blogId">): Promise<Blog> => {
  const response = await axiosInstance.post<Blog>("/api/Blog", data);
  return response.data;
};


const updateBlog = async (id: number, data: Partial<Blog>): Promise<Blog> => {
  const response = await axiosInstance.put<Blog>(`/api/Blog/${id}`, data);
  return response.data;
};

const deleteBlog = async (id: number): Promise<void> => {
  await axiosInstance.delete( `/api/Blog/${id}`);
};

const updateBlogType = async ( data: Partial<Blogtype>): Promise<Blogtype> => {
  const response = await axiosInstance.put<Blogtype>(`/api/BlogsType`, data);
  return response.data;
};
const addFavorite = async (blogId: number, userId: number): Promise<Blog> => {
  const data = { favoriteId : 0, blogId, userId };
  const response = await axiosInstance.post<Blog>("/api/Favorite/toggle", data);
  return response.data;
};

const getFavoriteBlogs = async (userId: number): Promise<Blog[]> => {
  const response = await axiosInstance.get<Blog[]>(`api/Blog/getfavorite/${userId}`);
  return response.data;
 }
 const getListFavoriteBlogsByBlogID = async (blogId: number): Promise<Blog[]> => {
  const response = await axiosInstance.get<Blog[]>(`api/Favorite/blog/${blogId}`);
  return response.data;
 }
 const isFavorite = async (userId: number, blogId: number): Promise<boolean> => {
  try {
    const favorites = await getFavoriteBlogs(userId);
    return favorites.some((blog) => blog.blogId === blogId);
  } catch (error) {
    console.error('Lỗi khi kiểm tra yêu thích:', error);
    return false;
  }
};

export {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogByBlogTypeID,
  getAllBlogtype,
  updateBlogType,
  addFavorite,
  getFavoriteBlogs,
  isFavorite,
  getListFavoriteBlogsByBlogID
};