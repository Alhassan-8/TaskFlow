import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Task, Priority, Status, Template } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskFormFields from "./task/TaskFormFields";
import TaskFormActions from "./task/TaskFormActions";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";
import TemplatesDialog from "./TemplatesDialog";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: Task;
  mode: "create" | "edit";
}

export default function TaskForm({ open, onOpenChange, initialTask, mode }: TaskFormProps) {
  const { projects, currentProject, addTask, updateTask, deleteTask } = useTaskContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("todo");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description);
        setPriority(initialTask.priority);
        setStatus(initialTask.status);
        setProjectId(initialTask.projectId);
        setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : undefined);
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setStatus("todo");
        setProjectId(currentProject === "all" ? projects[0]?.id || "" : currentProject);
        setDueDate(undefined);
      }
    }
  }, [open, initialTask, currentProject, projects]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (mode === "create") {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        projectId,
        dueDate,
      });
    } else if (initialTask) {
      updateTask(initialTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        projectId,
        dueDate,
      });
    }

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (initialTask) {
      deleteTask(initialTask.id);
      onOpenChange(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setTitle(template.title);
    setDescription(template.description);
    setPriority(template.priority);
    setProjectId(template.projectId || currentProject);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{mode === "create" ? "Create new task" : "Edit task"}</DialogTitle>
              {mode === "create" && (
                <Button variant="outline" onClick={() => setIsTemplatesOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              )}
            </div>
          </DialogHeader>
          
          <TaskFormFields
            title={title}
            description={description}
            priority={priority}
            status={status}
            projectId={projectId}
            dueDate={dueDate}
            datePickerOpen={datePickerOpen}
            projects={projects}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPriorityChange={setPriority}
            onStatusChange={setStatus}
            onProjectChange={setProjectId}
            onDueDateChange={setDueDate}
            onDatePickerOpenChange={setDatePickerOpen}
          />

          <TaskFormActions
            mode={mode}
            onDelete={handleDelete}
            onCancel={() => onOpenChange(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <TemplatesDialog
        open={isTemplatesOpen}
        onOpenChange={setIsTemplatesOpen}
        onSelectTemplate={handleTemplateSelect}
      />
    </>
  );
}
