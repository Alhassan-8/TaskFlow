import React, { useState } from "react";
import { Task } from "../types/task";
import { useAdvancedTask } from "../context/AdvancedTaskContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Trash2, Link2 } from "lucide-react";
import { formatDate } from "../utils/format";

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
}

export const TaskDependencies: React.FC<TaskDependenciesProps> = ({
  task,
  allTasks,
}) => {
  const { addDependency, removeDependency } = useAdvancedTask();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const availableTasks = allTasks.filter(
    (t) => t.id !== task.id && !task.dependencies.includes(t.id)
  );

  const filteredTasks = availableTasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDependency = (dependencyId: string) => {
    addDependency(task.id, dependencyId);
    setIsAdding(false);
    setSearchQuery("");
  };

  const handleRemoveDependency = (dependencyId: string) => {
    removeDependency(task.id, dependencyId);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Dependencies</h3>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Dependency
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Task Dependency</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                />
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{t.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due {formatDate(t.dueDate)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddDependency(t.id)}
                      >
                        <Link2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {task.dependencies.length > 0 ? (
            task.dependencies.map((dependencyId) => {
              const dependency = allTasks.find((t) => t.id === dependencyId);
              if (!dependency) return null;

              return (
                <div
                  key={dependencyId}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                >
                  <div>
                    <p className="font-medium">{dependency.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {formatDate(dependency.dueDate)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDependency(dependencyId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No dependencies</p>
          )}
        </div>
      </div>
    </Card>
  );
};
