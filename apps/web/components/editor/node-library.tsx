'use client';

type NodeLibraryProps = {
  onAddNode: (type: 'manualTrigger' | 'httpRequest') => void;
  onClose: () => void;
};

export function NodeLibrary({
  onAddNode,
  onClose,
}: NodeLibraryProps) {
  return (
    <aside className="w-[250px] shrink-0 border-r border-[#303744] bg-[#151920] text-[#e5eaf2]">
      <div className="flex items-start justify-between border-b border-[#303744] px-4 py-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em]">
            Node Library
          </h2>
          <p className="mt-1 text-[11px] text-[#818b9b]">
            Add nodes to your workflow
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close node library"
          title="Close Library"
          className="flex h-7 w-7 shrink-0 items-center justify-center text-lg text-[#818b9b] transition-colors hover:bg-[#252c37] hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#778295]">
          Triggers
        </p>

        <button
          type="button"
          onClick={() => onAddNode('manualTrigger')}
          className="flex w-full items-center gap-3 border border-transparent px-2.5 py-2.5 text-left transition-colors hover:border-[#343b48] hover:bg-[#1c2330]"
        >
          <span className="flex h-8 w-8 items-center justify-center border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
            ▶
          </span>
          <span>
            <span className="block text-xs font-medium">Manual Trigger</span>
            <span className="mt-0.5 block text-[10px] text-[#818b9b]">
              Start manually
            </span>
          </span>
        </button>

        <p className="mb-2 mt-6 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#778295]">
          Actions
        </p>

        <button
          type="button"
          onClick={() => onAddNode('httpRequest')}
          className="flex w-full items-center gap-3 border border-transparent px-2.5 py-2.5 text-left transition-colors hover:border-[#343b48] hover:bg-[#1c2330]"
        >
          <span className="flex h-8 w-8 items-center justify-center border border-blue-400/20 bg-blue-400/10 text-blue-400">
            ↗
          </span>
          <span>
            <span className="block text-xs font-medium">HTTP Request</span>
            <span className="mt-0.5 block text-[10px] text-[#818b9b]">
              Send an HTTP request
            </span>
          </span>
        </button>
      </div>

      <div className="border-t border-[#303744] px-4 py-3">
        <p className="text-[10px] text-[#778295]">
          2 nodes available
        </p>
      </div>
    </aside>
  );
}
