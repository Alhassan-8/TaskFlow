import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { Task, Priority, Status, Template, Tag } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import TaskFormFields from "./task/TaskFormFields";
import TaskFormActions from "./task/TaskFormActions";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";
import TemplatesDialog from "./TemplatesDialog";
import { TagManager } from "./TagManager";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: Task;
  mode: "create" | "edit";
}

export default function TaskForm({
  open,
  onOpenChange,
  initialTask,
  mode,
}: TaskFormProps) {
  const {
    projects,
    currentProject,
    addTask,
    updateTask,
    deleteTask,
    tasks,
    addTag,
    removeTag,
    updateTaskTags,
  } = useTaskContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("todo");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(
    undefined
  );
  const [timeSpent, setTimeSpent] = useState<number | undefined>(undefined);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTask?.tags || []
  );

  useEffect(() => {
    if (open) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description);
        setPriority(initialTask.priority);
        setStatus(initialTask.status);
        setProjectId(initialTask.projectId);
        setDueDate(
          initialTask.dueDate ? new Date(initialTask.dueDate) : undefined
        );
        setEstimatedTime(initialTask.estimatedTime);
        setTimeSpent(initialTask.timeSpent);
        setPrerequisites(initialTask.prerequisites || []);
        setChecklist(initialTask.checklist || []);
        setSelectedTags(initialTask.tags || []);
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setStatus("todo");
        setProjectId(
          currentProject === "all" ? projects[0]?.id || "" : currentProject
        );
        setDueDate(undefined);
        setEstimatedTime(undefined);
        setTimeSpent(undefined);
        setPrerequisites([]);
        setChecklist([]);
        setSelectedTags([]);
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
        estimatedTime,
        timeSpent,
        prerequisites,
        checklist,
        tags: selectedTags,
      });
    } else if (initialTask) {
      updateTask(initialTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        projectId,
        dueDate,
        estimatedTime,
        timeSpent,
        prerequisites,
        checklist,
        tags: selectedTags,
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

  const handleAddPrerequisite = (prerequisiteId: string) => {
    setPrerequisites((prev) => [...prev, prerequisiteId]);
  };

  const handleRemovePrerequisite = (prerequisiteId: string) => {
    setPrerequisites((prev) => prev.filter((id) => id !== prerequisiteId));
  };

  const handleAddChecklistItem = (item: any) => {
    const newItem = {
      ...item,
      id: `checklist-${Date.now()}`,
      createdAt: new Date(),
    };
    setChecklist((prev) => [...prev, newItem]);
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAddTag = (tag: Omit<Tag, "id">) => {
    if (projectId) {
      addTag(projectId, tag);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    if (projectId) {
      removeTag(projectId, tagId);
    }
  };

  const currentProjectTags =
    projects.find((p) => p.id === projectId)?.tags || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between mb-4">
              <DialogTitle>
                {mode === "create" ? "Create new task" : "Edit task"}
              </DialogTitle>
              {mode === "create" && (
                <Button
                  variant="outline"
                  onClick={() => setIsTemplatesOpen(true)}
                  className="mr-2"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              )}
            </div>
            <DialogDescription>
              {mode === "create"
                ? "Create a new task with title, description, priority, and other details."
                : "Edit the task details including title, description, priority, and other information."}
            </DialogDescription>
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
            estimatedTime={estimatedTime}
            timeSpent={timeSpent}
            prerequisites={prerequisites}
            checklist={checklist}
            allTasks={tasks}
            selectedTags={selectedTags}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPriorityChange={setPriority}
            onStatusChange={setStatus}
            onProjectChange={setProjectId}
            onDueDateChange={setDueDate}
            onDatePickerOpenChange={setDatePickerOpen}
            onEstimatedTimeChange={setEstimatedTime}
            onTimeSpentChange={setTimeSpent}
            onAddPrerequisite={handleAddPrerequisite}
            onRemovePrerequisite={handleRemovePrerequisite}
            onAddChecklistItem={handleAddChecklistItem}
            onRemoveChecklistItem={handleRemoveChecklistItem}
            onTagToggle={handleTagToggle}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />

          <DialogFooter>
            {mode === "edit" && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button onClick={handleSubmit}>Save</Button>
          </DialogFooter>
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
