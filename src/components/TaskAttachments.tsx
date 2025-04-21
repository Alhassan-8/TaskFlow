import React, { useState } from "react";
import { Task, Attachment } from "../types/task";
import { useAdvancedTask } from "../context/AdvancedTaskContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Trash2, FileText, Image, Download } from "lucide-react";
import { formatFileSize, formatDateTime } from "../utils/format";

interface TaskAttachmentsProps {
  task: Task;
}

export const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ task }) => {
  const { addAttachment, deleteAttachment } = useAdvancedTask();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await addAttachment(task.id, selectedFile);
      setSelectedFile(null);
      setIsAdding(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Attachments</h3>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Attachment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Attachment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    {selectedFile ? (
                      <div className="space-y-2">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Plus className="w-8 h-8 mx-auto" />
                        <p>Click to select a file</p>
                        <p className="text-sm text-muted-foreground">
                          or drag and drop
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setSelectedFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={!selectedFile}>
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {task.attachments.length > 0 ? (
            task.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted"
              >
                <div className="flex items-center space-x-2">
                  {getFileIcon(attachment.type)}
                  <div>
                    <p className="font-medium">{attachment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(attachment.size)} • Uploaded{" "}
                      {formatDateTime(attachment.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(attachment.url, "_blank")}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAttachment(task.id, attachment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No attachments</p>
          )}
        </div>
      </div>
    </Card>
  );
};
