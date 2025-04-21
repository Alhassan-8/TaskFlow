import React from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  onAddPrerequisite: (prerequisiteId: string) => void;
  onRemovePrerequisite: (prerequisiteId: string) => void;
  onAddChecklistItem: (item: Omit<Task, "id" | "createdAt">) => void;
  onRemoveChecklistItem: (itemId: string) => void;
}

export default function TaskDependencies({
  task,
  allTasks,
  onAddPrerequisite,
  onRemovePrerequisite,
  onAddChecklistItem,
  onRemoveChecklistItem,
}: TaskDependenciesProps) {
  const [newChecklistItemTitle, setNewChecklistItemTitle] = React.useState("");
  const [selectedPrerequisite, setSelectedPrerequisite] = React.useState("");

  const availableTasks = allTasks.filter(
    (t) => t.id !== task.id && !task.prerequisites?.includes(t.id)
  );

  const handleAddChecklistItem = () => {
    if (newChecklistItemTitle.trim()) {
      onAddChecklistItem({
        title: newChecklistItemTitle.trim(),
        description: "",
        priority: "medium",
        status: "todo",
        projectId: task.projectId,
        parentId: task.id,
      });
      setNewChecklistItemTitle("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Prerequisites Section */}
      <div>
        <Label>Prerequisites</Label>
        <div className="flex gap-2 mt-2">
          <select
            value={selectedPrerequisite}
            onChange={(e) => setSelectedPrerequisite(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a task</option>
            {availableTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (selectedPrerequisite) {
                onAddPrerequisite(selectedPrerequisite);
                setSelectedPrerequisite("");
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 space-y-1">
          {task.prerequisites?.map((prerequisiteId) => {
            const prerequisite = allTasks.find((t) => t.id === prerequisiteId);
            if (!prerequisite) return null;
            return (
              <div
                key={prerequisiteId}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <span>{prerequisite.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemovePrerequisite(prerequisiteId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklist Section */}
      <div>
        <Label>Checklist</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="New checklist item"
            value={newChecklistItemTitle}
            onChange={(e) => setNewChecklistItemTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddChecklistItem();
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddChecklistItem}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 space-y-1">
          {task.checklist?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <span>{item.title}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveChecklistItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
