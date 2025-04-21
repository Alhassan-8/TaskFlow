import React from "react";
import { Task, Project } from "@/types";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  project?: Project;
  onClick: () => void;
}

export default function TaskCard({ task, project, onClick }: TaskCardProps) {
  const priorityClasses = {
    low: "bg-priority-low/10 text-priority-low",
    medium: "bg-priority-medium/10 text-priority-medium",
    high: "bg-priority-high/10 text-priority-high",
    urgent: "bg-priority-urgent/10 text-priority-urgent",
  };

  const statusClasses = {
    todo: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "in-progress":
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    done: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  const statusText = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return format(new Date(date), "MMM d, yyyy");
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : undefined;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "done";

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200",
        "hover:translate-y-[-2px] hover:shadow-md",
        "active:translate-y-[1px]",
        "border-border/50 hover:border-border"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base truncate group-hover:text-primary transition-colors">
            {task.title}
          </h3>
          {project && (
            <div
              className="h-2 w-2 rounded-full transition-transform duration-200 group-hover:scale-110 border border-border/50"
              style={{ backgroundColor: project.color }}
            />
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
          {task.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant="outline"
            className={cn(
              priorityClasses[task.priority],
              "transition-colors duration-200 group-hover:opacity-90"
            )}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              statusClasses[task.status],
              "transition-colors duration-200 group-hover:opacity-90"
            )}
          >
            {statusText[task.status]}
          </Badge>
          {task.tags?.map((tagId) => {
            const tag = project?.tags?.find((t) => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge
                key={tagId}
                variant="outline"
                className="transition-all duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: `${tag.color}20`,
                  borderColor: tag.color,
                  color: tag.color,
                }}
              >
                <div
                  className="h-2 w-2 rounded-full mr-1 transition-transform duration-200 group-hover:scale-125"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </Badge>
            );
          })}
        </div>
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground mt-2 group-hover:text-foreground/80 transition-colors">
            <Calendar className="h-3 w-3 mr-1" />
            <span className={cn(isOverdue && "text-priority-high font-medium")}>
              {formatDate(task.dueDate)}
              {isOverdue && " (Overdue)"}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
