import React, { useState, useEffect, useRef } from 'react';
import { Trash2, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/Button';
import api from '../../utils/api';
import { getSocket } from '../../utils/socket';

export default function CommentList({ taskId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/task/${taskId}`);
        setComments(response.data.data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    const socket = getSocket();
    if (socket) {
      socket.on('comment:created', (comment) => {
        if (comment.task_id === taskId) {
          setComments(prev => {
            if (prev.some(c => c.id === comment.id)) return prev;
            return [...prev, comment];
          });
          scrollToBottom();
        }
      });

      socket.on('comment:deleted', ({ id, task_id }) => {
        if (task_id === taskId) {
          setComments(prev => prev.filter(c => c.id !== id));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('comment:created');
        socket.off('comment:deleted');
      }
    };
  }, [taskId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/comments/task/${taskId}`, { body: newComment });
      setNewComment('');
      // Socket handles adding to list
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      // Socket handles removal from list
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500 py-4">Loading comments...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {comments.length === 0 ? (
          <div className="text-sm text-gray-500 italic py-4 text-center">No comments yet.</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-surface-hover border border-border flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-300">
                    {comment.author?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 bg-surface-hover/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-white">{comment.author?.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {currentUser?.id === comment.author?.id && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.body}</p>
              </div>
            </div>
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <Button type="submit" isLoading={submitting} disabled={!newComment.trim()}>
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}
