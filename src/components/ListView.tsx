
import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "./TaskCard";
import { Task, Priority, Status } from "@/types";
import TaskDetailsModal from "./TaskDetailsModal";
import TaskFilters from "./TaskFilters";
import TaskStatistics from "./TaskStatistics";

interface ListViewProps {
  onTaskClick: (task: Task) => void;
}

export default function ListView({ onTaskClick }: ListViewProps) {
  const { tasks, projects, currentProject, searchResults } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const tasksToFilter = searchResults || tasks;
  const filteredTasks = tasksToFilter
    .filter(task => currentProject === "all" ? true : task.projectId === currentProject)
    .filter(task => priorityFilter === "all" ? true : task.priority === priorityFilter)
    .filter(task => statusFilter === "all" ? true : task.status === statusFilter);

  // Sort tasks: todo first, then in-progress, then done
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const statusOrder = { "todo": 0, "in-progress": 1, "done": 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="p-6">
      <TaskStatistics tasks={filteredTasks} />
      
      <TaskFilters
        priority={priorityFilter}
        status={statusFilter}
        onPriorityChange={setPriorityFilter}
        onStatusChange={setStatusFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            project={getProjectById(task.projectId)}
            onClick={() => handleTaskClick(task)}
          />
        ))}
        {sortedTasks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground">
              Add a new task to get started or change your filters.
            </p>
          </div>
        )}
      </div>

      <TaskDetailsModal
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </div>
  );
}
