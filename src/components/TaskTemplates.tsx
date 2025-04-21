import React, { useState } from "react";
import { TaskTemplate } from "../types/task";
import { useAdvancedTask } from "../context/AdvancedTaskContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Trash2, Copy } from "lucide-react";
import { Priority } from "../types/enums";

export const TaskTemplates: React.FC = () => {
  const { createTemplate, applyTemplate } = useAdvancedTask();
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState<
    Omit<TaskTemplate, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    description: "",
    defaultPriority: Priority.MEDIUM,
    defaultTags: [],
    defaultCategory: "",
    defaultLabels: [],
    defaultEstimatedTime: 0,
    defaultSubtasks: [],
  });

  const handleCreateTemplate = () => {
    createTemplate(newTemplate);
    setIsCreating(false);
    setNewTemplate({
      name: "",
      description: "",
      defaultPriority: Priority.MEDIUM,
      defaultTags: [],
      defaultCategory: "",
      defaultLabels: [],
      defaultEstimatedTime: 0,
      defaultSubtasks: [],
    });
  };

  const handleAddSubtask = () => {
    setNewTemplate((prev) => ({
      ...prev,
      defaultSubtasks: [
        ...prev.defaultSubtasks,
        { title: "", completed: false },
      ],
    }));
  };

  const handleSubtaskChange = (index: number, value: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      defaultSubtasks: prev.defaultSubtasks.map((subtask, i) =>
        i === index ? { ...subtask, title: value } : subtask
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Task Templates</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Template name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Template description"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Default Priority</label>
                <select
                  value={newTemplate.defaultPriority}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      defaultPriority: e.target.value as Priority,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                >
                  {Object.values(Priority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Default Tags</label>
                <Input
                  value={newTemplate.defaultTags.join(", ")}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      defaultTags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim()),
                    }))
                  }
                  placeholder="Comma-separated tags"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Default Category</label>
                <Input
                  value={newTemplate.defaultCategory}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      defaultCategory: e.target.value,
                    }))
                  }
                  placeholder="Category"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Default Labels</label>
                <Input
                  value={newTemplate.defaultLabels.join(", ")}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      defaultLabels: e.target.value
                        .split(",")
                        .map((label) => label.trim()),
                    }))
                  }
                  placeholder="Comma-separated labels"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Default Estimated Time (minutes)
                </label>
                <Input
                  type="number"
                  value={newTemplate.defaultEstimatedTime}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      defaultEstimatedTime: parseInt(e.target.value),
                    }))
                  }
                  placeholder="Estimated time in minutes"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Default Subtasks</label>
                <div className="space-y-2">
                  {newTemplate.defaultSubtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={subtask.title}
                        onChange={(e) =>
                          handleSubtaskChange(index, e.target.value)
                        }
                        placeholder="Subtask title"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            defaultSubtasks: prev.defaultSubtasks.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleAddSubtask}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subtask
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Priority:</span>
                <span className="text-sm font-medium">
                  {template.defaultPriority}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Estimated Time:</span>
                <span className="text-sm font-medium">
                  {template.defaultEstimatedTime} minutes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Subtasks:</span>
                <span className="text-sm font-medium">
                  {template.defaultSubtasks.length}
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement template application
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
