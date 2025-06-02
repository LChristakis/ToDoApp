import { createAppSlice } from "@/lib/createAppSlice";
import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasksRequest,
  updateTaskRequest
} from "./taskAPI";

export interface Task {
  id?: number;
  title: string;
  description: string;
  status?: number;
  error?: string;
}
export interface TasksSliceState {
  tasks: Task[];
  status: "idle" | "loading" | "failed";
}

const initialState: TasksSliceState = {
  tasks: [],
  status: "idle",
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const taskSlice = createAppSlice({
  name: "task",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async () => {
        const response = await fetchTasksRequest();
        return response.tasks;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.tasks = action.payload;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      }
    ),
    createTask: create.asyncThunk(
      async (task: Task) => {
        const response = await createTaskRequest(task);
        return response;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.tasks.push(action.payload);
        },
        rejected: (state) => {
          state.status = "failed";
        },
      }
    ),
    updateTask: create.asyncThunk(
      async (task: Task) => {
        const response = await updateTaskRequest(task);
        return response;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          const item_index = state.tasks.findIndex((t) => t.id === action.payload.id);
          if (item_index !== -1) {
            state.tasks[item_index] = action.payload;
          } else {
            state.tasks.push(action.payload);
          }
        },
        rejected: (state) => {
          state.status = "failed";
        },
      }
    ),
    deleteTask: create.asyncThunk(
      async (taskId: number) => {
        const response = await deleteTaskRequest(taskId);
        return response;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          const item_index = state.tasks.findIndex((t) => t.id === action.payload);
          if (item_index !== -1) {
            state.tasks.splice(item_index, 1);
          }
        },
        rejected: (state) => {
          state.status = "failed";
        },
      }
    ),
  }),
  selectors: {
    selectTasks: (state: TasksSliceState) => state.tasks,
    selectTaskById: (state: TasksSliceState, taskId: number) =>
      state.tasks.find((task) => task.id === taskId),
  },
});

export const { fetchTasks, createTask, updateTask, deleteTask } = taskSlice.actions;

export const { selectTasks, selectTaskById } = taskSlice.selectors;
