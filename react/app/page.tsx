import type { Metadata } from "next";
import TaskList from "./components/tasks/TaskList";

export default function IndexPage() {
  return <TaskList />;
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
