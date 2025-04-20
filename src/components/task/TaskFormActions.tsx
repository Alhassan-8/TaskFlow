
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface TaskFormActionsProps {
  mode: "create" | "edit";
  onDelete?: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function TaskFormActions({
  mode,
  onDelete,
  onCancel,
  onSubmit,
}: TaskFormActionsProps) {
  return (
    <DialogFooter className="flex justify-between">
      {mode === "edit" && onDelete && (
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      )}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" onClick={onSubmit}>
          {mode === "create" ? "Create task" : "Save changes"}
        </Button>
      </div>
    </DialogFooter>
  );
}
