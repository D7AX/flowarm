'use client';

import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';

import { ManualTriggerNode } from './nodes/manual-trigger-node';
import { HttpRequestNode } from './nodes/http-request-node';
import { NodeLibrary } from './node-library';
import { NodeConfigurationPanel } from './node-configuration-panel';
import { useRef, useState, type PointerEvent } from 'react';

const nodeTypes = {
  manualTrigger: ManualTriggerNode,
  httpRequest: HttpRequestNode,
};

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'manualTrigger',
    position: { x: 250, y: 100 },
    data: { label: 'Manual Trigger' },
  },
  {
    id: 'action-1',
    type: 'httpRequest',
    position: { x: 250, y: 250 },
    data: {
      label: 'HTTP Request',
      method: 'GET',
      url: 'https://api.example.com',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'edge-1',
    source: 'trigger-1',
    target: 'action-1',
    animated: true,
  },
];

type ExecutionLog = {
  id: string;
  timestamp: Date;
  status: 'ready' | 'failed';
  message: string;
};

export function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<
    'idle' | 'validating' | 'ready' | 'failed'
  >('idle');
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [historyHeight, setHistoryHeight] = useState(70);
  const [isResizingHistory, setIsResizingHistory] = useState(false);
  const historyResizeStart = useRef<{
    pointerY: number;
    height: number;
  } | null>(null);
  const handleHistoryResizeStart = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    historyResizeStart.current = {
      pointerY: event.clientY,
      height: historyHeight,
    };

    setIsResizingHistory(true);
  };
  const handleHistoryResizeMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isResizingHistory || !historyResizeStart.current) return;

    const delta = historyResizeStart.current.pointerY - event.clientY;

    const nextHeight = Math.min(
      450,
      Math.max(70, historyResizeStart.current.height + delta),
    );

    setHistoryHeight(nextHeight);
  };
  const handleHistoryResizeEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    historyResizeStart.current = null;
    setIsResizingHistory(false);
  };
  const [isNodeLibraryOpen, setIsNodeLibraryOpen] = useState(true);

  const selectedNode =
    nodes.find((node) => node.id === selectedNodeId) ?? null;

  function handleUpdateNode(
    nodeId: string,
    updates: Record<string, unknown>,
  ) {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...updates,
              },
            }
          : node,
      ),
    );
  }

  function handleExecute() {
    setExecutionStatus('validating');

    const invalidNode = nodes.find((node) => {
      if (node.type !== 'httpRequest') return false;

      const data = node.data as {
        method?: string;
        body?: string;
      };

      if (
        !['POST', 'PUT', 'PATCH'].includes(data.method ?? 'GET') ||
        !data.body?.trim()
      ) {
        return false;
      }

      try {
        JSON.parse(data.body);
        return false;
      } catch {
        return true;
      }
    });

    const log: ExecutionLog = {
      id: `${Date.now()}`,
      timestamp: new Date(),
      status: invalidNode ? 'failed' : 'ready',
      message: invalidNode
        ? `Invalid JSON in node: ${String(invalidNode.data.label ?? invalidNode.id)}`
        : 'Workflow configuration is valid.',
    };

    setExecutionLogs((currentLogs) => [log, ...currentLogs]);

    if (invalidNode) {
      setSelectedNodeId(invalidNode.id);
      setExecutionStatus('failed');
      return;
    }

    setExecutionStatus('ready');
  }

  function handleConnect(connection: Connection) {
    setEdges((currentEdges) => addEdge(connection, currentEdges));
  }

  function handleAddNode(type: 'manualTrigger' | 'httpRequest') {
    const label =
      type === 'manualTrigger' ? 'Manual Trigger' : 'HTTP Request';

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: 250,
        y: 100 + nodes.length * 140,
      },
      data:
        type === 'httpRequest'
          ? {
              label,
              method: 'GET',
              url: 'https://api.example.com',
            }
          : { label },
    };
    setNodes((currentNodes) => [...currentNodes, newNode]);
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0f1117] text-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
        <div>
          <h1 className="text-lg font-semibold">FlowArm Editor</h1>
          <p className="text-xs text-gray-400">Untitled Workflow</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${
              executionStatus === 'ready'
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                : executionStatus === 'failed'
                  ? 'border-red-500/20 bg-red-500/5 text-red-400'
                  : executionStatus === 'validating'
                    ? 'border-amber-500/20 bg-amber-500/5 text-amber-400'
                    : 'border-[#343b48] text-[#818b9b]'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                executionStatus === 'ready'
                  ? 'bg-emerald-400'
                  : executionStatus === 'failed'
                    ? 'bg-red-400'
                    : executionStatus === 'validating'
                      ? 'bg-amber-400'
                      : 'bg-[#818b9b]'
              }`}
            />
            {executionStatus === 'idle' && 'IDLE'}
            {executionStatus === 'validating' && 'VALIDATING'}
            {executionStatus === 'ready' && 'READY'}
            {executionStatus === 'failed' && 'FAILED'}
          </span>
          <button
            type="button"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleExecute}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
          >
            Execute
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div
          className={`shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-in-out ${
            isNodeLibraryOpen
              ? 'w-[250px] opacity-100'
              : 'w-0 opacity-0'
          }`}
        >
          <NodeLibrary
            onAddNode={handleAddNode}
            onClose={() => setIsNodeLibraryOpen(false)}
          />
        </div>

        <section className="relative min-w-0 flex-1">
          {!isNodeLibraryOpen && (
            <button
              type="button"
              onClick={() => setIsNodeLibraryOpen(true)}
              title="Open Node Library"
              aria-label="Open Node Library"
              className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center border border-[#343b48] bg-[#151920] text-[#aeb9ca] shadow-lg transition-colors hover:border-[#64748b] hover:text-white"
            >
              <span className="text-lg">›</span>
            </button>
          )}
          <ReactFlow
            className="h-full w-full"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes}
            fitView
            colorMode="dark"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#3f4654"
            />

            <Controls />
              <MiniMap />
            </ReactFlow>
          </section>

          <div
            className={`shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-in-out ${
              selectedNode
                ? 'w-[290px] opacity-100'
                : 'w-0 opacity-0'
            }`}
          >
            <NodeConfigurationPanel
              selectedNode={selectedNode}
              onUpdateNode={handleUpdateNode}
            />
          </div>
      </div>
      <section
        style={{ height: `${historyHeight}px` }}
        className={`shrink-0 border-t border-[#303744] bg-[#151920] text-[#e5eaf2] flex flex-col ${
          isResizingHistory ? '' : 'transition-[height] duration-200 ease-out'
        }`}
      >
        {/* Resize Handle */}
        <div
          onPointerDown={handleHistoryResizeStart}
          onPointerMove={handleHistoryResizeMove}
          onPointerUp={handleHistoryResizeEnd}
          onPointerCancel={handleHistoryResizeEnd}
          title="Drag to resize Execution History"
          role="separator"
          aria-orientation="horizontal"
          className="group flex h-2 shrink-0 cursor-row-resize touch-none items-center justify-center border-b border-[#303744] hover:bg-[#252d3a]"
        >
          <div className="h-[2px] w-10 rounded-full bg-[#566174] transition-colors group-hover:bg-[#60a5fa]" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#303744] px-5 py-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider">
              Execution History
            </h2>
            <p className="mt-1 text-[10px] text-[#818b9b]">
              Recent workflow validation results
            </p>
          </div>

          <span className="text-[10px] text-[#818b9b]">
            {executionLogs.length} records
          </span>
        </div>

        {/* Logs */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {executionLogs.length === 0 ? (
            <p className="px-5 py-5 text-xs text-[#818b9b]">
              No execution history yet.
            </p>
          ) : (
            executionLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-4 border-b border-[#303744]/60 px-5 py-3"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    log.status === 'ready' ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                />

                <span
                  className={`w-16 text-[10px] font-semibold ${
                    log.status === 'ready'
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {log.status.toUpperCase()}
                </span>

                <span className="min-w-0 flex-1 truncate text-xs text-[#aeb9ca]">
                  {log.message}
                </span>

                <time className="shrink-0 text-[10px] text-[#778295]">
                  {log.timestamp.toLocaleTimeString()}
                </time>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
