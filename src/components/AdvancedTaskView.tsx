import React, { useState } from "react";
import { Task, Subtask, Comment, RecurrencePattern } from "../types/task";
import { useAdvancedTask } from "../context/AdvancedTaskContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  Link2,
  Calendar,
  Archive,
  Tag,
  Folder,
  Timer,
} from "lucide-react";

interface AdvancedTaskViewProps {
  task: Task;
  onClose: () => void;
}

export const AdvancedTaskView: React.FC<AdvancedTaskViewProps> = ({
  task,
  onClose,
}) => {
  const {
    addSubtask,
    updateSubtask,
    deleteSubtask,
    addDependency,
    removeDependency,
    startTimer,
    stopTimer,
    updateProgress,
  } = useAdvancedTask();

  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(task.id, {
        title: newSubtask.trim(),
        completed: false,
      });
      setNewSubtask("");
    }
  };

  const handleSubtaskToggle = (subtaskId: string, completed: boolean) => {
    updateSubtask(task.id, subtaskId, { completed });
  };

  const handleProgressUpdate = (progress: number) => {
    updateProgress(task.id, progress);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{task.title}</h2>
              <p className="text-muted-foreground mt-1">{task.description}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {task.progress}%
              </span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">
                <FileText className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="subtasks">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Subtasks
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Clock className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Time Tracking</h3>
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4" />
                    <span>{task.timeSpent} minutes spent</span>
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startTimer(task.id)}
                    >
                      Start Timer
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Dependencies</h3>
                  {task.dependencies.length > 0 ? (
                    <div className="space-y-1">
                      {task.dependencies.map((depId) => (
                        <div key={depId} className="flex items-center">
                          <Link2 className="w-4 h-4 mr-2" />
                          <span>Task #{depId}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No dependencies
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Subtasks Tab */}
            <TabsContent value="subtasks" className="space-y-4">
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={(e) =>
                        handleSubtaskToggle(subtask.id, e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    <span
                      className={
                        subtask.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a new subtask"
                  onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                />
                <Button onClick={handleAddSubtask}>Add</Button>
              </div>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-4">
              <div className="space-y-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">User {comment.userId}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                    <Separator />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                <Button>Add Comment</Button>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Created{" "}
                    {formatDistanceToNow(new Date(task.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Last updated{" "}
                    {formatDistanceToNow(new Date(task.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};
