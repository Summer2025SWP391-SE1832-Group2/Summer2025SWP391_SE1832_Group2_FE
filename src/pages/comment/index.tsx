import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Comment } from '@/types/blog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommentProps {
  blogId: number;
}

const mockData: Comment[] = [
    {
      "uniqueId": 8,
      "userId": 11,
      "blogId": 11,
      "comment1": "hi hi ha ha",
      "rootId": null
    },
    {
      "uniqueId": 9,
      "userId": 11,
      "blogId": 11,
      "comment1": "hi hi ha ha",
      "rootId": 8
    },
    {
      "uniqueId": 10,
      "userId": 11,
      "blogId": 11,
      "comment1": "nội dung này hay quá",
      "rootId": null
    },
    {
      "uniqueId": 11,
      "userId": 11,
      "blogId": 11,
      "comment1": "nội dung này hay vãi",
      "rootId": 10
    }
  ];

export default function Comment({ blogId }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // const data = await getCommentsByBlogId(blogId);
        setComments(mockData); // dùng mock tạm
      } catch (error) {
        console.error('Lỗi khi tải bình luận:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  if (loading) {
    return <p className="text-muted-foreground">Đang tải bình luận...</p>;
  }

  if (comments.length === 0) {
    return <p className="text-muted-foreground">Chưa có bình luận nào.</p>;
  }

  // Phân loại comment cha và map replies
  const rootComments = comments.filter((c) => c.rootId === null);
  const repliesMap: Record<number, Comment[]> = {};
  comments.forEach((c) => {
    if (c.rootId !== null) {
      if (!repliesMap[c.rootId]) repliesMap[c.rootId] = [];
      repliesMap[c.rootId].push(c);
    }
  });

  // Component con để hiển thị comment + reply
  const renderComment = (comment: Comment) => (
    <Card key={comment.uniqueId} className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{comment.userId}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Người dùng #{comment.userId}
            </p>
            <p className="text-base text-foreground">{comment.comment1}</p>

            {/* Hiển thị replies nếu có */}
            {repliesMap[comment.uniqueId]?.length > 0 && (
              <div className="mt-3 space-y-3 pl-6 border-l border-gray-200">
                {repliesMap[comment.uniqueId].map((reply) => (
                  <div key={reply.uniqueId} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{reply.userId}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm text-muted-foreground">
                        Người dùng #{reply.userId}
                      </p>
                      <p className="text-sm">{reply.comment1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return <div className="space-y-4">{rootComments.map(renderComment)}</div>;
}
