import React, { useState } from "react";
import { Task, RecurrencePattern } from "../types/task";
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
import { Plus, Trash2, Calendar } from "lucide-react";
import { formatDate } from "../utils/format";

interface TaskRecurrenceProps {
  task: Task;
}

export const TaskRecurrence: React.FC<TaskRecurrenceProps> = ({ task }) => {
  const { setRecurrence, removeRecurrence } = useAdvancedTask();
  const [isEditing, setIsEditing] = useState(false);
  const [pattern, setPattern] = useState<RecurrencePattern>({
    type: "weekly",
    interval: 1,
    daysOfWeek: [],
    endDate: undefined,
    occurrences: undefined,
  });

  const handleSave = () => {
    setRecurrence(task.id, pattern);
    setIsEditing(false);
  };

  const handleRemove = () => {
    removeRecurrence(task.id);
  };

  const handleDayToggle = (day: number) => {
    setPattern((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek?.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...(prev.daysOfWeek || []), day],
    }));
  };

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Recurrence</h3>
          {task.recurrence ? (
            <Button variant="outline" size="sm" onClick={handleRemove}>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          ) : (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recurrence
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Recurrence Pattern</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Recurrence Type
                    </label>
                    <select
                      value={pattern.type}
                      onChange={(e) =>
                        setPattern((prev) => ({
                          ...prev,
                          type: e.target.value as RecurrencePattern["type"],
                        }))
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Interval</label>
                    <input
                      type="number"
                      value={pattern.interval}
                      onChange={(e) =>
                        setPattern((prev) => ({
                          ...prev,
                          interval: parseInt(e.target.value),
                        }))
                      }
                      min="1"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  {pattern.type === "weekly" && (
                    <div>
                      <label className="text-sm font-medium">
                        Days of Week
                      </label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {daysOfWeek.map((day) => (
                          <label
                            key={day.value}
                            className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-muted"
                          >
                            <input
                              type="checkbox"
                              checked={pattern.daysOfWeek?.includes(day.value)}
                              onChange={() => handleDayToggle(day.value)}
                              className="h-4 w-4"
                            />
                            <span>{day.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {pattern.type === "monthly" && (
                    <div>
                      <label className="text-sm font-medium">
                        Day of Month
                      </label>
                      <input
                        type="number"
                        value={pattern.dayOfMonth}
                        onChange={(e) =>
                          setPattern((prev) => ({
                            ...prev,
                            dayOfMonth: parseInt(e.target.value),
                          }))
                        }
                        min="1"
                        max="31"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  )}

                  {pattern.type === "yearly" && (
                    <div>
                      <label className="text-sm font-medium">Month</label>
                      <select
                        value={pattern.month}
                        onChange={(e) =>
                          setPattern((prev) => ({
                            ...prev,
                            month: parseInt(e.target.value),
                          }))
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {new Date(2000, i, 1).toLocaleString("default", {
                              month: "long",
                            })}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={pattern.endDate}
                      onChange={(e) =>
                        setPattern((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {task.recurrence && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                Repeats {task.recurrence.type} every {task.recurrence.interval}{" "}
                {task.recurrence.type === "daily"
                  ? "day"
                  : task.recurrence.type === "weekly"
                  ? "week"
                  : task.recurrence.type === "monthly"
                  ? "month"
                  : "year"}
              </span>
            </div>
            {task.recurrence.daysOfWeek &&
              task.recurrence.daysOfWeek.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  On:{" "}
                  {task.recurrence.daysOfWeek
                    .map((day) => daysOfWeek[day].label)
                    .join(", ")}
                </div>
              )}
            {task.recurrence.endDate && (
              <div className="text-sm text-muted-foreground">
                Ends on: {formatDate(task.recurrence.endDate)}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
