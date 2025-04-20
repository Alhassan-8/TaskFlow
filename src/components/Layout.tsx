
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTaskContext } from "@/context/TaskContext";
import TaskForm from "./TaskForm";
import { Task } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const handleAddTask = () => {
    setEditingTask(undefined);
    setFormMode("create");
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormMode("edit");
    setIsTaskFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header onAddTask={handleAddTask} />
        <main>
          {React.cloneElement(children as React.ReactElement, {
            onTaskClick: handleEditTask,
          })}
        </main>
      </div>
      <TaskForm
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        initialTask={editingTask}
        mode={formMode}
      />
    </div>
  );
}
