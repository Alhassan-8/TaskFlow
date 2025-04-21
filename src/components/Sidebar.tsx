import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import {
  Plus,
  Folder,
  LayoutDashboard,
  ListTodo,
  MenuIcon,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const {
    projects,
    currentProject,
    setCurrentProject,
    addProject,
    deleteProject,
  } = useTaskContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#6366f1");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject({
        name: newProjectName.trim(),
        color: newProjectColor,
      });
      setNewProjectName("");
      setIsProjectDialogOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  const colorOptions = [
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#d946ef", // Fuchsia
    "#ec4899", // Pink
    "#f43f5e", // Rose
    "#ef4444", // Red
    "#f97316", // Orange
    "#f59e0b", // Amber
    "#eab308", // Yellow
    "#84cc16", // Lime
    "#22c55e", // Green
    "#10b981", // Emerald
    "#14b8a6", // Teal
    "#06b6d4", // Cyan
    "#0ea5e9", // Sky
    "#3b82f6", // Blue
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            PROJECTS
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsProjectDialogOpen(true)}
            className="h-7 w-7"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1 mt-3">
          <Button
            variant={currentProject === "all" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentProject("all")}
          >
            <ListTodo className="mr-2 h-4 w-4" />
            All Tasks
          </Button>

          {projects.map((project) => (
            <div key={project.id} className="flex items-center gap-2">
              <Button
                variant={currentProject === project.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  "hover:bg-accent/50 hover:text-accent-foreground",
                  "active:scale-[0.98]",
                  currentProject === project.id &&
                    "bg-accent/80 text-accent-foreground border-l-4 border-primary/80 shadow-sm"
                )}
                onClick={() => setCurrentProject(project.id)}
              >
                <div
                  className={cn(
                    "mr-2 h-3 w-3 rounded-full transition-transform duration-200",
                    "hover:scale-110",
                    currentProject === project.id && "scale-110"
                  )}
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate">{project.name}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40"
          onClick={toggleSidebar}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      )}

      <aside
        className={cn(
          "bg-sidebar fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-sidebar-border",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        {sidebarContent}
      </aside>

      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project to organize your tasks. You can customize the
              project name and color.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project name</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Project color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    className={cn(
                      "h-8 w-8 rounded-full cursor-pointer border-2",
                      newProjectColor === color
                        ? "border-primary"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewProjectColor(color)}
                    role="button"
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProjectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!projectToDelete}
        onOpenChange={() => setProjectToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone and will also delete all tasks associated with this
              project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
