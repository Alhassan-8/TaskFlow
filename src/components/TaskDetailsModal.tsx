
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Task } from "@/types";
import { Calendar, Clock } from "lucide-react";

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDetailsModal({
  task,
  open,
  onOpenChange,
}: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={`priority-${task.priority}`}>
              {task.priority}
            </Badge>
            <Badge variant="outline">{task.status}</Badge>
          </div>
          
          <p className="text-muted-foreground">{task.description}</p>
          
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due: {format(new Date(task.dueDate), "PPP")}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Created: {format(new Date(task.createdAt), "PPP")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
