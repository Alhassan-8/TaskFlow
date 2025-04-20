import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "./TaskCard";
import { Task, Status } from "@/types";
import { cn } from "@/lib/utils";

interface BoardViewProps {
  onTaskClick: (task: Task) => void;
}

export default function BoardView({ onTaskClick }: BoardViewProps) {
  const { tasks, projects, currentProject, searchResults } = useTaskContext();

  const tasksToFilter = searchResults || tasks;
  const filteredTasks = currentProject === "all"
    ? tasksToFilter
    : tasksToFilter.filter(task => task.projectId === currentProject);

  const columns: { title: string; status: Status; color: string }[] = [
    { title: "To Do", status: "todo", color: "bg-blue-500/10 border-blue-500/20" },
    { title: "In Progress", status: "in-progress", color: "bg-amber-500/10 border-amber-500/20" },
    { title: "Done", status: "done", color: "bg-green-500/10 border-green-500/20" },
  ];

  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const getTasksByStatus = (status: Status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  return (
    <div className="p-6 overflow-x-auto">
      <div className="grid grid-cols-3 gap-4 min-w-[768px]">
        {columns.map(column => (
          <div key={column.status} className="flex flex-col">
            <div className={cn("rounded-t-md p-3 font-medium", column.color)}>
              <div className="flex justify-between items-center">
                <h3>{column.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {getTasksByStatus(column.status).length}
                </span>
              </div>
            </div>
            <div 
              className="flex-1 bg-muted/30 rounded-b-md p-3 flex flex-col gap-3"
              style={{ minHeight: "calc(100vh - 240px)" }}
            >
              {getTasksByStatus(column.status).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={getProjectById(task.projectId)}
                  onClick={() => onTaskClick(task)}
                />
              ))}
              {getTasksByStatus(column.status).length === 0 && (
                <div className="flex items-center justify-center h-24 border border-dashed rounded-md border-muted text-muted-foreground text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
