"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("useEffect ran"+ count);
  }, [count]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 p-8">
        <h1 className="text-3xl font-bold text-main">{count}</h1>

        <button
          onClick={() => setCount(count + 1)}
          className="rounded-xl bg-main px-4 py-2 text-white"
        >
          Increase
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="rounded-xl bg-main px-4 py-2 text-white"
        >
          Increase
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="rounded-xl bg-main px-4 py-2 text-white"
        >
          Increase
        </button>
        
        
      </div>
    </main>
  );
}
