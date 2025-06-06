import React, { useState, useEffect } from 'react';
import { fetchComments, addComment } from '../services/commentService';

const CommentSection = ({ threadId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadComments = async () => {
            try {
                const commentsData = await fetchComments(threadId);
                setComments(commentsData);
            } catch (error) {
                console.error('Failed to load comments:', error);
            } finally {
                setLoading(false);
            }
        };
        loadComments();
    }, [threadId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const commentData = await addComment(threadId, newComment);
            setComments([...comments, commentData]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="comment-section">
            <h3>Comments</h3>
            {loading ? (
                <p>Loading comments...</p>
            ) : (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            <strong>{comment.author.username}</strong>
                            <p>{comment.content}</p>
                        </li>
                    ))}
                </ul>
            )}
            <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Post Comment</button>
        </div>
    );
};

export default CommentSection;
