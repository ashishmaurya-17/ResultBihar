import React, { useState, useEffect } from 'react';
import { safeLocalStorage } from '../lib/storage';
import { Send, MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('Guest');

  useEffect(() => {
    const storedComments = safeLocalStorage.getItem(`comments_${postId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [postId]);

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author,
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    safeLocalStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  return (
    <div className="mt-8 border-t-2 border-gray-900 pt-6">
      <h3 className="text-sm font-black uppercase text-gray-900 flex items-center gap-2 mb-4">
        <MessageSquare size={16} /> Comments
      </h3>
      
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No comments yet. Be the first to ask!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-gray-50 p-3 border border-gray-200">
              <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                <span>{c.author}</span>
                <span>{c.timestamp}</span>
              </div>
              <p className="text-xs text-gray-900">{c.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          className="w-full text-xs p-2 border border-gray-300"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Ask a question..."
          className="w-full text-xs p-2 border border-gray-300 h-20"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={addComment}
          className="flex items-center gap-2 bg-gray-900 text-white text-xs font-bold px-4 py-2 hover:bg-gray-800"
        >
          <Send size={14} /> Send
        </button>
      </div>
    </div>
  );
};
