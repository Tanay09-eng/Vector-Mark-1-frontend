import { useCallback, useEffect } from "react";
import { useVector } from "../store/VectorContext";
import { tasksAPI } from "../services/api";

export function useTasks() {
  const { state, dispatch, notify } = useVector();

  const loadTasks = useCallback(async () => {
    dispatch({ type: "SET_TASKS_LOADING", payload: true });
    try {
      const data = await tasksAPI.getAll("pending");
      dispatch({ type: "SET_TASKS", payload: data });
    } catch {
      dispatch({ type: "SET_TASKS_LOADING", payload: false });
    }
  }, [dispatch]);

  const addTask = useCallback(async (taskData) => {
    try {
      const task = await tasksAPI.create(taskData);
      dispatch({ type: "ADD_TASK", payload: task });
      notify(`Task added: ${task.title}`, "success");
      return task;
    } catch (err) {
      notify(`Failed to add task: ${err.message}`, "error");
    }
  }, [dispatch, notify]);

  const completeTask = useCallback(async (id) => {
    try {
      const updated = await tasksAPI.complete(id);
      dispatch({ type: "UPDATE_TASK", payload: updated });
      notify("Task completed!", "success");
    } catch (err) {
      notify(`Error: ${err.message}`, "error");
    }
  }, [dispatch, notify]);

  const deleteTask = useCallback(async (id) => {
    try {
      await tasksAPI.delete(id);
      dispatch({ type: "REMOVE_TASK", payload: id });
    } catch (err) {
      notify(`Error: ${err.message}`, "error");
    }
  }, [dispatch, notify]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  return { tasks: state.tasks, loading: state.tasksLoading, loadTasks, addTask, completeTask, deleteTask };
}
