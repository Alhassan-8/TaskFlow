import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, Project, Priority, Status, Template, Tag } from "@/types";

type ViewType = "list" | "board";

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  templates: Template[];
  currentProject: string;
  viewType: ViewType;
  searchResults: Task[] | null;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  deleteProject: (id: string) => void;
  addTemplate: (template: Omit<Template, "id">) => void;
  deleteTemplate: (id: string) => void;
  setCurrentProject: (projectId: string) => void;
  setViewType: (view: ViewType) => void;
  setSearchResults: (results: Task[] | null) => void;
  addTag: (projectId: string, tag: Omit<Tag, "id">) => void;
  removeTag: (projectId: string, tagId: string) => void;
  updateTaskTags: (taskId: string, tagIds: string[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "Personal",
    color: "#6366f1",
    tags: [
      { id: "t1", name: "Home", color: "#ef4444" },
      { id: "t2", name: "Family", color: "#3b82f6" },
    ],
  },
  {
    id: "p2",
    name: "Work",
    color: "#8b5cf6",
    tags: [
      { id: "t3", name: "Development", color: "#22c55e" },
      { id: "t4", name: "Meeting", color: "#f97316" },
    ],
  },
];

const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Complete project proposal",
    description: "Draft the initial proposal for the client project",
    priority: "high",
    status: "todo",
    projectId: "p2",
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    createdAt: new Date(),
  },
  {
    id: "t2",
    title: "Grocery shopping",
    description: "Buy fruits, vegetables, and essentials",
    priority: "medium",
    status: "todo",
    projectId: "p1",
    dueDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
    createdAt: new Date(),
  },
  {
    id: "t3",
    title: "Weekly team meeting",
    description: "Discuss project progress and roadblocks",
    priority: "medium",
    status: "in-progress",
    projectId: "p2",
    dueDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
    createdAt: new Date(),
  },
];

const initialTemplates: Template[] = [
  {
    id: "template1",
    name: "Bug Report",
    title: "Bug: ",
    description:
      "Steps to reproduce:\n1.\n2.\n3.\n\nExpected behavior:\n\nActual behavior:",
    priority: "high",
    projectId: "p2",
  },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [currentProject, setCurrentProject] = useState<string>("all");
  const [viewType, setViewType] = useState<ViewType>("list");
  const [searchResults, setSearchResults] = useState<Task[] | null>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedProjects = localStorage.getItem("projects");
    const storedCurrentProject = localStorage.getItem("currentProject");
    const storedViewType = localStorage.getItem("viewType");

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedCurrentProject) setCurrentProject(storedCurrentProject);
    if (storedViewType) setViewType(storedViewType as ViewType);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("currentProject", currentProject);
    localStorage.setItem("viewType", viewType);
  }, [tasks, projects, currentProject, viewType]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      dependencies: task.dependencies || [],
      subtasks: task.subtasks || [],
      estimatedTime: task.estimatedTime,
      timeSpent: task.timeSpent,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...taskData } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    // Remove task from dependencies of other tasks
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        dependencies: task.dependencies?.filter((depId) => depId !== id) || [],
      }))
    );
    // Remove the task itself
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const addProject = (project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
    };
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const deleteProject = (id: string) => {
    // Remove project from projects list
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== id)
    );

    // Remove tasks associated with the project
    setTasks((prevTasks) => prevTasks.filter((task) => task.projectId !== id));

    // If the deleted project was the current project, switch to "all" view
    if (currentProject === id) {
      setCurrentProject("all");
    }
  };

  const addTemplate = (template: Omit<Template, "id">) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id));
  };

  const addTag = (projectId: string, tag: Omit<Tag, "id">) => {
    const newTag: Tag = {
      ...tag,
      id: `tag-${Date.now()}`,
    };
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, tags: [...(project.tags || []), newTag] }
          : project
      )
    );
  };

  const removeTag = (projectId: string, tagId: string) => {
    // Remove tag from projects
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tags: project.tags?.filter((tag) => tag.id !== tagId),
            }
          : project
      )
    );
    // Remove tag from tasks
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        tags: task.tags?.filter((id) => id !== tagId),
      }))
    );
  };

  const updateTaskTags = (taskId: string, tagIds: string[]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, tags: tagIds } : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        templates,
        currentProject,
        viewType,
        searchResults,
        addTask,
        updateTask,
        deleteTask,
        addProject,
        deleteProject,
        addTemplate,
        deleteTemplate,
        setCurrentProject,
        setViewType,
        setSearchResults,
        addTag,
        removeTag,
        updateTaskTags,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
