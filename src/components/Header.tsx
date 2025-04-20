
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SearchBar from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import TaskExport from "./TaskExport";

interface HeaderProps {
  onAddTask: () => void;
}

export default function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <SearchBar />
          <Button onClick={onAddTask} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
          <TaskExport />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
