
import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { useToast } from "@/hooks/use-toast";

export default function TaskExport() {
  const { tasks, currentProject } = useTaskContext();
  const { toast } = useToast();

  const handleExport = () => {
    const filteredTasks = currentProject === "all" 
      ? tasks 
      : tasks.filter(task => task.projectId === currentProject);

    // Convert tasks to CSV format
    const headers = ["Title", "Description", "Priority", "Status", "Due Date", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredTasks.map(task => [
        `"${task.title}"`,
        `"${task.description}"`,
        task.priority,
        task.status,
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
        new Date(task.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tasks-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: "Your tasks have been exported to CSV"
    });
  };

  return (
    <Button onClick={handleExport} size="sm" variant="outline">
      <FileSpreadsheet className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
}
