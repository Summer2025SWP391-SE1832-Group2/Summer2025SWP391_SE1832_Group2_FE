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
   type Comment = {
      uniqueId: number;
      userId: number;
      blogId: number;
      comment1: string;
      rootId: number | null;
   }
   type Favorite = {
      favoriteId: number;
      userId : number;
      blogId : number;
   }
export type { Blog, Blogtype,Comment,Favorite };