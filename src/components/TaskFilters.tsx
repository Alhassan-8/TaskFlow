import React from "react";
import { Priority, Status } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, Clock, ListTodo } from "lucide-react";

interface TaskFiltersProps {
  priority: Priority | "all";
  status: Status | "all";
  onPriorityChange: (priority: Priority | "all") => void;
  onStatusChange: (status: Status | "all") => void;
}

export default function TaskFilters({
  priority,
  status,
  onPriorityChange,
  onStatusChange,
}: TaskFiltersProps) {
  const priorityOptions: (Priority | "all")[] = [
    "all",
    "low",
    "medium",
    "high",
    "urgent",
  ];
  const statusOptions: (Status | "all")[] = [
    "all",
    "todo",
    "in-progress",
    "done",
  ];

  const priorityLabels = {
    all: "All Priorities",
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  const statusLabels = {
    all: "All Statuses",
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  const priorityIcons = {
    all: <AlertTriangle className="h-4 w-4" />,
    low: <AlertTriangle className="h-4 w-4 text-green-500" />,
    medium: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    high: <AlertTriangle className="h-4 w-4 text-orange-500" />,
    urgent: <AlertTriangle className="h-4 w-4 text-red-500" />,
  };

  const statusIcons = {
    all: <ListTodo className="h-4 w-4" />,
    todo: <ListTodo className="h-4 w-4 text-blue-500" />,
    "in-progress": <Clock className="h-4 w-4 text-amber-500" />,
    done: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Priority Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          Filter by Priority
        </div>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <Button
              key={option}
              variant={priority === option ? "default" : "outline"}
              size="sm"
              onClick={() => onPriorityChange(option)}
              className={cn(
                "transition-colors",
                "flex items-center gap-2",
                priority === option && "bg-primary text-primary-foreground"
              )}
            >
              {priorityIcons[option]}
              {priorityLabels[option]}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Status Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ListTodo className="h-4 w-4" />
          Filter by Status
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option}
              variant={status === option ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(option)}
              className={cn(
                "transition-colors",
                "flex items-center gap-2",
                status === option && "bg-primary text-primary-foreground"
              )}
            >
              {statusIcons[option]}
              {statusLabels[option]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
