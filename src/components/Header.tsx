
import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onAddTask: () => void;
}

export default function Header({ onAddTask }: HeaderProps) {
  const { projects, currentProject, viewType, setViewType } = useTaskContext();
  
  const currentProjectName = currentProject === "all" 
    ? "All Tasks" 
    : projects.find(p => p.id === currentProject)?.name || "Unknown Project";

  return (
    <header className="h-16 border-b flex items-center justify-between px-4">
      <div className="ml-16 md:ml-64">
        <h1 className="text-xl font-bold">{currentProjectName}</h1>
        {currentProject !== "all" && (
          <Badge 
            variant="outline" 
            className="ml-1"
            style={{ 
              backgroundColor: projects.find(p => p.id === currentProject)?.color + "20",
              color: projects.find(p => p.id === currentProject)?.color
            }}
          >
            Project
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-md p-0.5">
          <Button
            variant={viewType === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewType("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "board" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewType("board")}
            aria-label="Board view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
