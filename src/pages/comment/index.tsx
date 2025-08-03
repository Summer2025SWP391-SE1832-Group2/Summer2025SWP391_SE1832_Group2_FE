import { useEffect, useState } from 'react';
import { getBlockByBookId } from '@/services/comment_service'; // Rename this to getCommentsByBlogId?
import type { Comment } from '@/types/blog';
import CommentItem from './commentItem';

interface CommentsProps {
  blogId: number;
}

export default function Comments({ blogId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    try {
      const res = await getBlockByBookId(blogId);
      setComments(res);
    } catch (error) {
      console.error('Lỗi khi tải bình luận:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const rootComments = comments.filter((c) => c.rootId === null);
  const repliesByRoot = (rootId: number) => comments.filter((c) => c.rootId === rootId);

  return (
    <div>
      {rootComments.map((comment) => (
        <CommentItem
          key={comment.uniqueId}
          comment={comment}
          replies={repliesByRoot(comment.uniqueId)}
          reload={fetchComments}
        />
      ))}
    </div>
  );
}
