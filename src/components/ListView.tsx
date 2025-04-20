
import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "./TaskCard";
import { Task } from "@/types";

interface ListViewProps {
  onTaskClick: (task: Task) => void;
}

export default function ListView({ onTaskClick }: ListViewProps) {
  const { tasks, projects, currentProject } = useTaskContext();

  const filteredTasks = currentProject === "all"
    ? tasks
    : tasks.filter(task => task.projectId === currentProject);

  // Sort tasks: todo first, then in-progress, then done
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const statusOrder = { "todo": 0, "in-progress": 1, "done": 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            project={getProjectById(task.projectId)}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {sortedTasks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground">
              Add a new task to get started or change your project filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
