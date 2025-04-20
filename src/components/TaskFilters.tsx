
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Priority, Status } from "@/types";

interface TaskFiltersProps {
  priority: Priority | "all";
  status: Status | "all";
  onPriorityChange: (value: Priority | "all") => void;
  onStatusChange: (value: Status | "all") => void;
}

export default function TaskFilters({
  priority,
  status,
  onPriorityChange,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
