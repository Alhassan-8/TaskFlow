import React from "react";
import { Priority, Status } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TaskDependencies from "./TaskDependencies";

interface TaskFormFieldsProps {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  projectId: string;
  dueDate?: Date;
  datePickerOpen: boolean;
  projects: Array<{ id: string; name: string; color: string }>;
  estimatedTime?: number;
  timeSpent?: number;
  prerequisites?: string[];
  checklist?: any[];
  allTasks: any[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: Priority) => void;
  onStatusChange: (value: Status) => void;
  onProjectChange: (value: string) => void;
  onDueDateChange: (date?: Date) => void;
  onDatePickerOpenChange: (open: boolean) => void;
  onEstimatedTimeChange: (value: number) => void;
  onTimeSpentChange: (value: number) => void;
  onAddPrerequisite: (prerequisiteId: string) => void;
  onRemovePrerequisite: (prerequisiteId: string) => void;
  onAddChecklistItem: (item: any) => void;
  onRemoveChecklistItem: (itemId: string) => void;
}

export default function TaskFormFields({
  title,
  description,
  priority,
  status,
  projectId,
  dueDate,
  datePickerOpen,
  projects,
  estimatedTime,
  timeSpent,
  prerequisites,
  checklist,
  allTasks,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  onProjectChange,
  onDueDateChange,
  onDatePickerOpenChange,
  onEstimatedTimeChange,
  onTimeSpentChange,
  onAddPrerequisite,
  onRemovePrerequisite,
  onAddChecklistItem,
  onRemoveChecklistItem,
}: TaskFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Task title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Task description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={priority}
            onValueChange={(value) => onPriorityChange(value as Priority)}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => onStatusChange(value as Status)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="project">Project</Label>
          <Select value={projectId} onValueChange={onProjectChange}>
            <SelectTrigger id="project">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center">
                    <div 
                      className="h-2 w-2 rounded-full mr-2" 
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="due-date">Due Date</Label>
          <Popover open={datePickerOpen} onOpenChange={onDatePickerOpenChange}>
            <PopoverTrigger asChild>
              <Button
                id="due-date"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  onDueDateChange(date);
                  onDatePickerOpenChange(false);
                }}
                initialFocus
                disabled={(date) => date < new Date()}
                fromDate={new Date()}
                fixedWeeks
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="estimated-time">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Estimated Time (minutes)
            </div>
          </Label>
          <Input
            id="estimated-time"
            type="number"
            min="0"
            value={estimatedTime || ""}
            onChange={(e) => onEstimatedTimeChange(Number(e.target.value))}
            placeholder="Enter estimated time"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time-spent">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Spent (minutes)
            </div>
          </Label>
          <Input
            id="time-spent"
            type="number"
            min="0"
            value={timeSpent || ""}
            onChange={(e) => onTimeSpentChange(Number(e.target.value))}
            placeholder="Enter time spent"
          />
        </div>
      </div>
      <TaskDependencies
        task={{ id: "", prerequisites, checklist } as any}
        allTasks={allTasks}
        onAddPrerequisite={onAddPrerequisite}
        onRemovePrerequisite={onRemovePrerequisite}
        onAddChecklistItem={onAddChecklistItem}
        onRemoveChecklistItem={onRemoveChecklistItem}
      />
    </div>
  );
}
