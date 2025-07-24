import { useState } from 'react';
import type { Comment } from '@/types/blog';
import { useAuthStore } from '@/stores/auth';
import { createComment } from '@/services/comment_service';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  reload: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, replies, reload }) => {
  const { user } = useAuthStore();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim() || !user) return;
    setLoading(true);
    try {
      await createComment({
        uniqueId: 0,
        blogId: comment.blogId,
        userId: user.userId,
        comment1: replyText.trim(),
        rootId: comment.uniqueId,
      });
      setReplyText('');
      setReplying(false);
      reload();
    } catch (err) {
      console.error('Lỗi khi gửi phản hồi:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex gap-3 mb-4'>
      {/* Avatar */}
      {/* <img
        src={`https://i.pravatar.cc/40?u=${comment.userId}`} // avatar tạm thời
        alt='avatar'
        className='w-10 h-10 rounded-full object-cover'
      /> */}
       <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.userId}</AvatarFallback>
                    </Avatar>

      {/* Nội dung comment + trả lời */}
      <div className='flex-1'>
        <div className='bg-gray-100 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700'>
          <p className='text-sm text-gray-800 dark:text-gray-100'>{comment.comment1}</p>
        </div>
        <div className='mt-1'>
          <Button
            size='sm'
            variant='link'
            className='text-xs text-blue-600 px-1'
            onClick={() => setReplying(!replying)}
          >
            Trả lời
          </Button>
        </div>

        {/* Form trả lời */}
        {replying && (
          <div className='mt-2 ml-2 space-y-2'>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder='Viết phản hồi...'
              className='text-sm'
            />
            <Button size='sm' onClick={handleReply} disabled={loading || !replyText.trim()}>
              {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
            </Button>
          </div>
        )}

        {/* Danh sách phản hồi */}
        {replies.length > 0 && (
          <div className='mt-3 space-y-2'>
            {replies.map((rep) => (
              <div key={rep.uniqueId} className='flex gap-3 ml-4'>
                {/* <img
                  src={`https://i.pravatar.cc/40?u=${rep.userId}`}
                  alt='avatar'
                  className='w-8 h-8 rounded-full object-cover'
                /> */}
                <Avatar className="h-8 w-8">
                      <AvatarFallback>{rep.userId}</AvatarFallback>
                    </Avatar>
                <div className='bg-gray-100 dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700'>
                  <p className='text-sm text-gray-700 dark:text-gray-100'>{rep.comment1}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
