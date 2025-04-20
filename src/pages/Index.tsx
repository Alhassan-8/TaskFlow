
import React from "react";
import { TaskProvider } from "@/context/TaskContext";
import Layout from "@/components/Layout";
import ListView from "@/components/ListView";
import BoardView from "@/components/BoardView";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/types";

// Main component wrapper with context provider
const Index = () => {
  return (
    <TaskProvider>
      <IndexContent />
    </TaskProvider>
  );
};

// Inner component that accesses the context
const IndexContent = () => {
  const { viewType } = useTaskContext();
  
  // This is just a placeholder since Layout will inject the actual onTaskClick handler
  const handleTaskClick = (task: Task) => {
    // No implementation needed here as Layout will override this
    console.log("Task clicked in IndexContent", task);
  };
  
  return (
    <Layout>
      {viewType === "list" ? 
        <ListView onTaskClick={handleTaskClick} /> : 
        <BoardView onTaskClick={handleTaskClick} />
      }
    </Layout>
  );
};

export default Index;
