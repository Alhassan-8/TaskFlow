import React, { useState } from "react";
import { Task, Comment } from "../types/task";
import { useAdvancedTask } from "../context/AdvancedTaskContext";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Reply } from "lucide-react";

interface TaskCommentsProps {
  task: Task;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ task }) => {
  const { addComment, updateComment, deleteComment, addReply } =
    useAdvancedTask();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(task.id, newComment.trim(), "current-user-id");
      setNewComment("");
    }
  };

  const handleAddReply = (commentId: string) => {
    if (replyContent.trim()) {
      addReply(task.id, commentId, replyContent.trim(), "current-user-id");
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const renderComment = (comment: Comment, level = 0) => {
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className={`space-y-2 ${level > 0 ? "ml-8" : ""}`}>
        <div className="flex items-start space-x-2">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`}
            />
            <AvatarFallback>
              {comment.userId.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">User {comment.userId}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              >
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </Button>
            </div>
            {isReplying && (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {comment.replies.map((reply) => renderComment(reply, level + 1))}
      </div>
    );
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4" />
          <h3 className="font-medium">Comments</h3>
        </div>

        <div className="space-y-4">
          {task.comments.map((comment) => renderComment(comment))}
        </div>

        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment}>Add Comment</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
