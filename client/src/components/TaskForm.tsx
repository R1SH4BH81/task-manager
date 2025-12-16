import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../utils/api";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"), // Keep as string to match HTML input
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["ToDo", "InProgress", "Review", "Completed"]),
  assignedToId: z.string().optional(),
});

type TaskFormInputs = z.infer<typeof taskSchema>;

const TaskForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "ToDo",
      assignedToId: "",
    },
  });

  // Fetch task data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchTask = async () => {
        try {
          const response = await api.authenticatedRequest(api.task(id!), {
            method: "GET",
          });

          if (response.ok) {
            const taskData = await response.json();

            // Populate form with task data
            setValue("title", taskData.title);
            setValue("description", taskData.description || "");
            setValue("dueDate", taskData.dueDate.split("T")[0]); // Format date for input
            setValue("priority", taskData.priority);
            setValue("status", taskData.status);
            setValue("assignedToId", taskData.assignedToId || "");
          } else {
            setError("Failed to load task");
          }
        } catch (err) {
          setError("An error occurred while loading the task");
        }
      };

      fetchTask();
    }
  }, [id, isEditing, setValue]);

  const onSubmit = async (data: TaskFormInputs) => {
    setLoading(true);
    setError(null);

    try {
      const url = isEditing ? api.task(id!) : api.tasks;
      const method = isEditing ? "PUT" : "POST";

      const response = await api.authenticatedRequest(url, {
        method,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate("/tasks");
      } else {
        const result = await response.json();
        setError(
          result.message ||
            `${isEditing ? "Updating" : "Creating"} task failed`,
        );
      }
    } catch (err) {
      setError(
        `An error occurred while ${
          isEditing ? "updating" : "creating"
        } the task`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h1>
          <button
            onClick={() => navigate("/tasks")}
            className="btn btn-secondary"
          >
            Back to Tasks
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="card">
          <div className="card-body">
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div className="input-group">
                <input
                  id="title"
                  {...register("title")}
                  placeholder=" "
                  className="input-field"
                />
                <label htmlFor="title" className="floating-label">
                  Title
                </label>
                {errors.title && (
                  <p className="form-error mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description Field */}
              <div className="input-group">
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  placeholder=" "
                  className="input-field"
                />
                <label htmlFor="description" className="floating-label">
                  Description
                </label>
                {errors.description && (
                  <p className="form-error mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Due Date Field */}
              <div className="input-group">
                <input
                  type="date"
                  id="dueDate"
                  {...register("dueDate")}
                  placeholder=" "
                  className="input-field"
                />
                <label htmlFor="dueDate" className="floating-label">
                  Due Date
                </label>
                {errors.dueDate && (
                  <p className="form-error mt-1">{errors.dueDate.message}</p>
                )}
              </div>

              {/* Priority Field */}
              <div className="input-group">
                <select
                  id="priority"
                  {...register("priority")}
                  className="input-field"
                >
                  <option value=""></option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <label htmlFor="priority" className="floating-label">
                  Priority
                </label>
                {errors.priority && (
                  <p className="form-error mt-1">{errors.priority.message}</p>
                )}
              </div>

              {/* Status Field */}
              <div className="input-group">
                <select
                  id="status"
                  {...register("status")}
                  className="input-field"
                >
                  <option value=""></option>
                  <option value="ToDo">To Do</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
                <label htmlFor="status" className="floating-label">
                  Status
                </label>
                {errors.status && (
                  <p className="form-error mt-1">{errors.status.message}</p>
                )}
              </div>

              {/* Assign To Field */}
              <div className="input-group">
                <input
                  type="text"
                  id="assignedToId"
                  {...register("assignedToId")}
                  placeholder=" "
                  className="input-field"
                />
                <label htmlFor="assignedToId" className="floating-label">
                  Assign To (User ID) - optional
                </label>
                {errors.assignedToId && (
                  <p className="form-error mt-1">
                    {errors.assignedToId.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/tasks")}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isEditing ? "Updating..." : "Create Task"}
                    </>
                  ) : isEditing ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
