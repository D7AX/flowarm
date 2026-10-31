'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

export function ManualTriggerNode({ selected }: NodeProps) {
  return (
    <div
      className={`min-w-[220px] rounded-[3px] border bg-[#1c2330] shadow-lg transition-colors ${
      selected
        ? 'border-[#64748b] shadow-black/20'
        : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <span className="text-xl">▶</span>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            Manual Trigger
          </p>
          <p className="text-xs text-gray-400">
            Starts workflow manually
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400">
          Trigger · Ready
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-[#1c2330] !bg-emerald-400"
      />
    </div>
  );
}