import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Task,
  Subtask,
  Attachment,
  Comment,
  RecurrencePattern,
  TaskTemplate,
} from "../types/task";
import { toast } from "sonner";

interface AdvancedTaskContextType {
  // Task Management
  addSubtask: (
    taskId: string,
    subtask: Omit<Subtask, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateSubtask: (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Dependencies
  addDependency: (taskId: string, dependencyId: string) => void;
  removeDependency: (taskId: string, dependencyId: string) => void;

  // Attachments
  addAttachment: (taskId: string, file: File) => Promise<void>;
  deleteAttachment: (taskId: string, attachmentId: string) => void;

  // Comments
  addComment: (taskId: string, content: string, userId: string) => void;
  updateComment: (taskId: string, commentId: string, content: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  addReply: (
    taskId: string,
    commentId: string,
    content: string,
    userId: string
  ) => void;

  // Time Tracking
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
  updateEstimatedTime: (taskId: string, minutes: number) => void;

  // Recurrence
  setRecurrence: (taskId: string, pattern: RecurrencePattern) => void;
  removeRecurrence: (taskId: string) => void;

  // Templates
  createTemplate: (
    template: Omit<TaskTemplate, "id" | "createdAt" | "updatedAt">
  ) => void;
  applyTemplate: (taskId: string, templateId: string) => void;

  // Archiving
  archiveTask: (taskId: string) => void;
  unarchiveTask: (taskId: string) => void;

  // Categories and Labels
  addCategory: (taskId: string, name: string) => void;
  removeCategory: (taskId: string, name: string) => void;
  addLabel: (taskId: string, name: string) => void;
  removeLabel: (taskId: string, name: string) => void;

  // Progress Tracking
  updateProgress: (taskId: string, progress: number) => void;
}

const AdvancedTaskContext = createContext<AdvancedTaskContextType | undefined>(
  undefined
);

export const AdvancedTaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [activeTimers, setActiveTimers] = useState<
    Record<string, NodeJS.Timeout>
  >({});

  // Task Management
  const addSubtask = useCallback(
    (
      taskId: string,
      subtask: Omit<Subtask, "id" | "createdAt" | "updatedAt">
    ) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            const newSubtask: Subtask = {
              ...subtask,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return {
              ...task,
              subtasks: [...task.subtasks, newSubtask],
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        })
      );
      toast.success("Subtask added");
    },
    []
  );

  const updateSubtask = useCallback(
    (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? {
                      ...subtask,
                      ...updates,
                      updatedAt: new Date().toISOString(),
                    }
                  : subtask
              ),
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        })
      );
      toast.success("Subtask updated");
    },
    []
  );

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter(
              (subtask) => subtask.id !== subtaskId
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    toast.success("Subtask deleted");
  }, []);

  // Dependencies
  const addDependency = useCallback((taskId: string, dependencyId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            dependencies: [...task.dependencies, dependencyId],
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    toast.success("Dependency added");
  }, []);

  const removeDependency = useCallback(
    (taskId: string, dependencyId: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              dependencies: task.dependencies.filter(
                (id) => id !== dependencyId
              ),
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        })
      );
      toast.success("Dependency removed");
    },
    []
  );

  // Time Tracking
  const startTimer = useCallback((taskId: string) => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              timeSpent: task.timeSpent + 1,
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        })
      );
    }, 60000); // Update every minute

    setActiveTimers((prev) => ({ ...prev, [taskId]: interval }));
    toast.success("Timer started");
  }, []);

  const stopTimer = useCallback(
    (taskId: string) => {
      if (activeTimers[taskId]) {
        clearInterval(activeTimers[taskId]);
        setActiveTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[taskId];
          return newTimers;
        });
        toast.success("Timer stopped");
      }
    },
    [activeTimers]
  );

  // Progress Tracking
  const updateProgress = useCallback((taskId: string, progress: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            progress: Math.max(0, Math.min(100, progress)),
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    toast.success("Progress updated");
  }, []);

  // Templates
  const createTemplate = useCallback(
    (template: Omit<TaskTemplate, "id" | "createdAt" | "updatedAt">) => {
      const newTemplate: TaskTemplate = {
        ...template,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTemplates((prev) => [...prev, newTemplate]);
      toast.success("Template created");
    },
    []
  );

  const applyTemplate = useCallback(
    (taskId: string, templateId: string) => {
      const template = templates.find((t) => t.id === templateId);
      if (!template) {
        toast.error("Template not found");
        return;
      }

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              priority: template.defaultPriority,
              tags: [...new Set([...task.tags, ...template.defaultTags])],
              category: template.defaultCategory,
              labels: [...new Set([...task.labels, ...template.defaultLabels])],
              estimatedTime: template.defaultEstimatedTime,
              subtasks: [
                ...task.subtasks,
                ...template.defaultSubtasks.map((subtask) => ({
                  ...subtask,
                  id: crypto.randomUUID(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                })),
              ],
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        })
      );
      toast.success("Template applied");
    },
    [templates]
  );

  // Categories and Labels
  const addCategory = useCallback((taskId: string, name: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            category: name,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    toast.success("Category added");
  }, []);

  const removeCategory = useCallback((taskId: string, name: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            category: "",
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    toast.success("Category removed");
  }, []);

  const addLabel = useCallback((taskId: string, name: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            labels: [...new Set([...task.labels, name])],
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    toast.success("Label added");
  }, []);

  const removeLabel = useCallback((taskId: string, name: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            labels: task.labels.filter((label) => label !== name),
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    toast.success("Label removed");
  }, []);

  const value = {
    addSubtask,
    updateSubtask,
    deleteSubtask,
    addDependency,
    removeDependency,
    startTimer,
    stopTimer,
    updateProgress,
    createTemplate,
    applyTemplate,
    addCategory,
    removeCategory,
    addLabel,
    removeLabel,
  };

  return (
    <AdvancedTaskContext.Provider value={value}>
      {children}
    </AdvancedTaskContext.Provider>
  );
};

export const useAdvancedTask = () => {
  const context = useContext(AdvancedTaskContext);
  if (context === undefined) {
    throw new Error(
      "useAdvancedTask must be used within an AdvancedTaskProvider"
    );
  }
  return context;
};
