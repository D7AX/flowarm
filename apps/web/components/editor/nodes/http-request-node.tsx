'use client';

import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from '@xyflow/react';

type HttpRequestNodeData = {
  label: string;
  method: string;
  url: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export function HttpRequestNode({
  data,
  selected,
}: NodeProps<HttpRequestNodeType>) {
  return (
    <div
      className={`w-[270px] overflow-hidden border bg-[#191d25] transition-colors ${
        selected
          ? 'border-[#64748b] shadow-[0_0_0_1px_rgba(148,163,184,0.12)]'
          : 'border-[#343b48] hover:border-[#536176]'
      }`}
    >
      <div className="flex items-center gap-3 px-3.5 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-blue-400/20 bg-blue-400/10 text-blue-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
          >
            <path d="M7 7h10M7 12h10M7 17h6" />
            <path d="M4 3h16v18H4z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#e5eaf2]">
            {data.label}
          </p>
          <p className="mt-0.5 text-[11px] text-[#818b9b]">
            Send an HTTP request
          </p>
        </div>

        <span className="border border-blue-400/20 bg-blue-400/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-blue-400">
          {data.method}
        </span>
      </div>

      <div className="border-t border-[#303744] px-3.5 py-3">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[#778295]">
          Endpoint
        </p>

        <div className="border border-[#303744] bg-[#11151c] px-2.5 py-2">
          <code className="break-all text-[11px] text-[#aeb9ca]">
            {data.url}
          </code>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#303744] px-3.5 py-2.5">
        <span className="text-[10px] font-semibold tracking-wider text-blue-400">
          ACTION
        </span>

        <span className="flex items-center gap-1.5 text-[10px] text-[#8994a5]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          READY
        </span>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-[#191d25] !bg-[#8b9bb2]"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2 !border-[#191d25] !bg-blue-400"
      />
    </div>
  );
}
