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
import { Plus, Tag, Folder, X } from "lucide-react";
import { Badge } from "./ui/badge";

interface TaskCategoriesProps {
  task: Task;
}

export const TaskCategories: React.FC<TaskCategoriesProps> = ({ task }) => {
  const { addCategory, removeCategory, addLabel, removeLabel } =
    useAdvancedTask();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(task.id, newCategory.trim());
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      addLabel(task.id, newLabel.trim());
      setNewLabel("");
      setIsAddingLabel(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Categories */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Folder className="w-4 h-4" />
              <h3 className="font-medium">Categories</h3>
            </div>
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category name"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingCategory(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddCategory}>Add</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-2">
            {task.category ? (
              <Badge variant="secondary" className="flex items-center">
                {task.category}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => removeCategory(task.id, task.category)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground">No category</p>
            )}
          </div>
        </div>
      </Card>

      {/* Labels */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <h3 className="font-medium">Labels</h3>
            </div>
            <Dialog open={isAddingLabel} onOpenChange={setIsAddingLabel}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Label
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Label</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Label name"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingLabel(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddLabel}>Add</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-2">
            {task.labels.length > 0 ? (
              task.labels.map((label) => (
                <Badge
                  key={label}
                  variant="secondary"
                  className="flex items-center"
                >
                  {label}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => removeLabel(task.id, label)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No labels</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
