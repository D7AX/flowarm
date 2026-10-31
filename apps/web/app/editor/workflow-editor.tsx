'use client';

export function WorkflowEditor() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0f1117] text-white">
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <div>
          <h1 className="text-lg font-semibold">FlowArm Editor</h1>
          <p className="text-xs text-gray-400">Untitled Workflow</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
            Save
          </button>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
            Execute
          </button>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Workflow Canvas</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your automation workspace is ready.
          </p>
        </div>
      </section>
    </main>
  );
}