import dynamic from "next/dynamic";

const Todo = dynamic(() => import("./components/Todo"), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Todo />
    </main>
  );
}
