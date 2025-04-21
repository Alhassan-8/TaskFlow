import React, { useState } from "react";
import { Task } from "@/types";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "./TaskCard";
import TaskStatistics from "./TaskStatistics";
import TaskFilters from "./TaskFilters";
import TaskDetailsModal from "./TaskDetailsModal";

interface ListViewProps {
  onTaskClick: (task: Task) => void;
}

export default function ListView({ onTaskClick }: ListViewProps) {
  const { tasks, projects, currentProject, searchResults } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | Task["priority"]
  >("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all"
  );

  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    onTaskClick(task);
  };

  // Filter tasks based on current project, search results, and filters
  const filteredTasks = (searchResults || tasks).filter((task) => {
    const matchesProject =
      currentProject === "all" || task.projectId === currentProject;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesProject && matchesPriority && matchesStatus;
  });

  // Sort tasks by due date and priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First, sort by due date (tasks with due dates come first)
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
    }

    // Then, sort by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

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
        {sortedTasks.map((task) => (
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
