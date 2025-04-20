import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, Project, Priority, Status, Template } from "@/types";

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
  addTemplate: (template: Omit<Template, "id">) => void;
  deleteTemplate: (id: string) => void;
  setCurrentProject: (projectId: string) => void;
  setViewType: (view: ViewType) => void;
  setSearchResults: (results: Task[] | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialProjects: Project[] = [
  { id: "p1", name: "Personal", color: "#6366f1" },
  { id: "p2", name: "Work", color: "#8b5cf6" },
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
    description: "Steps to reproduce:\n1.\n2.\n3.\n\nExpected behavior:\n\nActual behavior:",
    priority: "high",
    projectId: "p2"
  }
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const addProject = (project: Omit<Project, "id">) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
    };
    setProjects((prevProjects) => [...prevProjects, newProject]);
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
        addTemplate,
        deleteTemplate,
        setCurrentProject,
        setViewType,
        setSearchResults,
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
