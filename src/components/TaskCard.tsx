
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
    urgent: "bg-priority-urgent/10 text-priority-urgent"
  };

  const statusClasses = {
    "todo": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "in-progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    "done": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  const statusText = {
    "todo": "To Do",
    "in-progress": "In Progress",
    "done": "Done",
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return format(new Date(date), "MMM d, yyyy");
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : undefined;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "done";

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base truncate">{task.title}</h3>
          {project && (
            <div 
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: project.color }}
            />
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={cn(priorityClasses[task.priority])}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          <Badge variant="outline" className={cn(statusClasses[task.status])}>
            {statusText[task.status]}
          </Badge>
        </div>
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground mt-2">
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
