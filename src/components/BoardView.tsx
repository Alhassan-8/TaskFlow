import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Task, Status } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Tag } from "lucide-react";
import { format } from "date-fns";

interface BoardViewProps {
  onTaskClick: (task: Task) => void;
}

export default function BoardView({ onTaskClick }: BoardViewProps) {
  const { tasks, currentProject, projects } = useTaskContext();

  const filteredTasks = tasks.filter(
    (task) => currentProject === "all" || task.projectId === currentProject
  );

  const statusColumns: { status: Status; title: string }[] = [
    { status: "todo", title: "To Do" },
    { status: "in-progress", title: "In Progress" },
    { status: "done", title: "Done" },
  ];

  const getTasksByStatus = (status: Status) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const getProjectColor = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.color || "#000000";
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {statusColumns.map((column) => (
        <div key={column.status} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{column.title}</h2>
            <Badge variant="outline">
              {getTasksByStatus(column.status).length}
            </Badge>
          </div>
          <div className="space-y-2">
            {getTasksByStatus(column.status).map((task) => (
              <Card
                key={task.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onTaskClick(task)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-base truncate">
                      {task.title}
                    </h3>
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: getProjectColor(task.projectId),
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        task.priority === "low" &&
                          "bg-priority-low/10 text-priority-low",
                        task.priority === "medium" &&
                          "bg-priority-medium/10 text-priority-medium",
                        task.priority === "high" &&
                          "bg-priority-high/10 text-priority-high",
                        task.priority === "urgent" &&
                          "bg-priority-urgent/10 text-priority-urgent"
                      )}
                    >
                      {task.priority}
                    </Badge>
                    {task.tags?.map((tagId) => {
                      const tag = projects
                        .find((p) => p.id === task.projectId)
                        ?.tags?.find((t) => t.id === tagId);
                      if (!tag) return null;
                      return (
                        <Badge
                          key={tagId}
                          variant="outline"
                          className="flex items-center gap-1"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            borderColor: tag.color,
                          }}
                        >
                          <Tag
                            className="h-3 w-3"
                            style={{ color: tag.color }}
                          />
                          {tag.name}
                        </Badge>
                      );
                    })}
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  {(task.estimatedTime || task.timeSpent) && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {task.timeSpent ? `${task.timeSpent}m spent` : ""}
                        {task.estimatedTime && task.timeSpent ? " / " : ""}
                        {task.estimatedTime
                          ? `${task.estimatedTime}m estimated`
                          : ""}
                      </span>
                    </div>
                  )}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {task.subtasks.length} subtasks
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
