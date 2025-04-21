import React from "react";
import { Task } from "@/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

interface TaskStatisticsProps {
  tasks: Task[];
}

export default function TaskStatistics({ tasks }: TaskStatisticsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "done"
  ).length;

  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <h3 className="text-2xl font-bold">{totalTasks}</h3>
          </div>
          <Calendar className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <h3 className="text-2xl font-bold">{completedTasks}</h3>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">In Progress</p>
            <h3 className="text-2xl font-bold">{inProgressTasks}</h3>
          </div>
          <Clock className="h-8 w-8 text-amber-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Overdue</p>
            <h3 className="text-2xl font-bold">{overdueTasks}</h3>
          </div>
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
      </Card>

      <div className="col-span-full">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Completion Rate</p>
          <p className="text-sm text-muted-foreground">
            {Math.round(completionRate)}%
          </p>
        </div>
        <Progress value={completionRate} className="h-2" />
      </div>
    </div>
  );
}
