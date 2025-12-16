import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { api } from "../utils/api";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "ToDo" | "InProgress" | "Review" | "Completed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  dueDate: string;
  creatorId: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const {
    data: tasks = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Task[]>(api.myTasks, fetcher);

  // Filter and sort tasks
  useEffect(() => {
    let result = [...tasks];

    // Apply filters
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredTasks(result);
  }, [tasks, statusFilter, priorityFilter, sortBy]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await api.authenticatedRequest(api.task(id), {
          method: "DELETE",
        });

        if (response.ok) {
          mutate(); // Refresh the task list
        } else {
          alert("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("An error occurred while deleting the task");
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ToDo":
        return "badge-neutral";
      case "InProgress":
        return "badge-warning";
      case "Review":
        return "badge-info";
      case "Completed":
        return "badge-success";
      default:
        return "badge-neutral";
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "Low":
        return "priority-low";
      case "Medium":
        return "priority-medium";
      case "High":
        return "priority-high";
      case "Urgent":
        return "priority-urgent";
      default:
        return "priority-medium";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load tasks. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <button
            onClick={() => navigate("/tasks/new")}
            className="btn btn-primary"
          >
            Create New Task
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="card">
          <div className="card-body">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Status Filter */}
              <div className="input-group">
                <select
                  id="status-filter"
                  className="input-field"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="ToDo">To Do</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
                <label htmlFor="status-filter" className="floating-label">
                  Status
                </label>
              </div>

              {/* Priority Filter */}
              <div className="input-group">
                <select
                  id="priority-filter"
                  className="input-field"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <label htmlFor="priority-filter" className="floating-label">
                  Priority
                </label>
              </div>

              {/* Sort By */}
              <div className="input-group">
                <select
                  id="sort-by"
                  className="input-field"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt">Created Date</option>
                  <option value="dueDate">Due Date</option>
                </select>
                <label htmlFor="sort-by" className="floating-label">
                  Sort By
                </label>
              </div>
            </div>

            {/* Task List */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No tasks
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new task.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/tasks/new")}
                    className="btn btn-primary"
                  >
                    Create New Task
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <li key={task.id}>
                      <div className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium text-indigo-600">
                              {task.title}
                            </p>
                            <div className="ml-2 flex flex-shrink-0">
                              <span
                                className={`${getStatusBadgeClass(
                                  task.status,
                                )} badge`}
                              >
                                {task.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {task.description}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span
                                className={`${getPriorityBadgeClass(
                                  task.priority,
                                )} badge mr-2`}
                              >
                                {task.priority}
                              </span>
                              <time dateTime={task.dueDate}>
                                {new Date(task.dueDate).toLocaleDateString()}
                              </time>
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-3">
                            <button
                              onClick={() => navigate(`/tasks/${task.id}/edit`)}
                              className="btn btn-secondary btn-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
