
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTaskContext } from "@/context/TaskContext";
import { Template } from "@/types";
import { FileText, FilePlus, FileX } from "lucide-react";

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplatesDialog({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplatesDialogProps) {
  const { templates, addTemplate, deleteTemplate } = useTaskContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    title: "",
    description: "",
    priority: "medium" as const,
    projectId: "",
  });

  const handleCreateTemplate = () => {
    if (newTemplate.name.trim()) {
      addTemplate(newTemplate);
      setNewTemplate({
        name: "",
        title: "",
        description: "",
        priority: "medium",
        projectId: "",
      });
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isCreating ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="title">Default Title</Label>
                <Input
                  id="title"
                  value={newTemplate.title}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Default Description</Label>
                <Input
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTemplate}>Save Template</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsCreating(true)}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Create New Template
              </Button>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start"
                      onClick={() => {
                        onSelectTemplate(template);
                        onOpenChange(false);
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {template.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <FileX className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
