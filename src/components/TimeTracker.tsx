import React, { useState, useEffect } from "react";
import { Task } from "../types/task";
import { useAdvancedTask } from "../context/AdvancedTaskContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Timer, Pause, Play, RotateCcw } from "lucide-react";
import { formatDuration } from "../utils/format";

interface TimeTrackerProps {
  task: Task;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ task }) => {
  const { startTimer, stopTimer, updateEstimatedTime } = useAdvancedTask();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(task.estimatedTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    startTimer(task.id);
  };

  const handlePause = () => {
    setIsRunning(false);
    stopTimer(task.id);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    stopTimer(task.id);
  };

  const handleEstimatedTimeChange = (minutes: number) => {
    setEstimatedTime(minutes);
    updateEstimatedTime(task.id, minutes);
  };

  const progress = estimatedTime > 0 ? (elapsedTime / estimatedTime) * 100 : 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Time Tracking</h3>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span className="text-lg font-medium">
              {formatDuration(elapsedTime)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Estimated Time
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) =>
                  handleEstimatedTimeChange(parseInt(e.target.value))
                }
                className="w-20 p-1 border rounded"
                min="0"
              />
              <span className="text-sm">minutes</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-center space-x-2">
          {!isRunning ? (
            <Button onClick={handleStart}>
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button variant="outline" onClick={handlePause}>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Total time spent: {formatDuration(task.timeSpent)}</p>
          {estimatedTime > 0 && (
            <p>
              {elapsedTime >= estimatedTime
                ? "Time exceeded!"
                : `Remaining: ${formatDuration(estimatedTime - elapsedTime)}`}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
