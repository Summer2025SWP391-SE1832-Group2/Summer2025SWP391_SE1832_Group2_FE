 type Blog = {
    blogId: number;
    createBy: number;
    title: string;
    content: string;
    blogTypeId: number;
    createAt : string;
    updateAt : string;
    image: string;
  };
   type Blogtype = {
      blogTypeId: number;
      title: string;
      description: string;
      img : string;
      };
export type { Blog, Blogtype };