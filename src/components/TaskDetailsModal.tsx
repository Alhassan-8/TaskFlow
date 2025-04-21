import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Task, Project } from "@/types";
import {
  Calendar,
  Clock,
  Tag,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailsModalProps {
  task: Task | null;
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDetailsModal({
  task,
  project,
  open,
  onOpenChange,
}: TaskDetailsModalProps) {
  if (!task) return null;

  const priorityClasses = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusClasses = {
    todo: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "in-progress":
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    done: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  const statusIcons = {
    todo: <ListTodo className="h-4 w-4" />,
    "in-progress": <Clock className="h-4 w-4" />,
    done: <CheckCircle2 className="h-4 w-4" />,
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
          <DialogDescription>
            View and manage task details, including description, status,
            priority, and other information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-sm whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Status
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  statusClasses[task.status],
                  "flex items-center gap-1"
                )}
              >
                {statusIcons[task.status]}
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Priority
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  priorityClasses[task.priority],
                  "flex items-center gap-1"
                )}
              >
                <AlertTriangle className="h-4 w-4" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Project and Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Project
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: project?.color }}
                />
                <span className="text-sm">{project?.name}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags?.map((tagId) => {
                  const tag = project?.tags?.find((t) => t.id === tagId);
                  if (!tag) return null;
                  return (
                    <Badge
                      key={tagId}
                      variant="outline"
                      className="flex items-center gap-1"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        borderColor: tag.color,
                        color: tag.color,
                      }}
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Due Date
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span
                  className={cn(
                    "text-sm",
                    isOverdue && "text-red-500 font-medium"
                  )}
                >
                  {task.dueDate
                    ? format(new Date(task.dueDate), "PPP")
                    : "No due date"}
                  {isOverdue && " (Overdue)"}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Time Tracking
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {task.estimatedTime
                    ? `${task.estimatedTime} min estimated`
                    : "No time estimate"}
                  {task.timeSpent ? ` • ${task.timeSpent} min spent` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Checklist */}
          {task.checklist && task.checklist.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Checklist
              </h3>
              <div className="space-y-2">
                {task.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-muted rounded-md"
                  >
                    <div className="h-4 w-4 rounded-sm border border-border" />
                    <span className="text-sm">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
