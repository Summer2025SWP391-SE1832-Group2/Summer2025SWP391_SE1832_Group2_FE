type Blog = {
  blogId: number;
  createBy: number;
  title: string;
  content: string;
  blogTypeId: number;
  createAt: string;
  updateAt: string;
  image: string;
};
type Blogtype = {
  blogTypeId: number;
  title: string;
  description: string;
  img: string;
};

type Comment = {
  uniqueId: number;
  blogId: number;
  userId: number;
  comment1: string;
  rootId: number | null;
};
export type { Blog, Blogtype, Comment };
