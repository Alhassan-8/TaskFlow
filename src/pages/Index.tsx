import React from "react";
import { TaskProvider } from "@/context/TaskContext";
import Layout from "@/components/Layout";
import ListView from "@/components/ListView";
import BoardView from "@/components/BoardView";
import { useTaskContext } from "@/context/TaskContext";

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
  
  return (
    <Layout>
      {viewType === "list" ? <ListView onTaskClick={() => {}} /> : <BoardView onTaskClick={() => {}} />}
    </Layout>
  );
};

export default Index;
