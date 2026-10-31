'use client';

import type { Node } from '@xyflow/react';

type NodeConfigurationPanelProps = {
  selectedNode: Node | null;
  onUpdateNode: (
    nodeId: string,
    updates: Record<string, unknown>,
  ) => void;
};

type NodeData = {
  label?: string;
  method?: string;
  url?: string;
  body?: string;
};

export function NodeConfigurationPanel({
    selectedNode,
    onUpdateNode,
}: NodeConfigurationPanelProps) {
    if (!selectedNode) {
        return (
            <aside className="w-[290px] shrink-0 border-l border-[#303744] bg-[#151920]">
                <div className="border-b border-[#303744] px-4 py-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#e5eaf2]">
                    Configuration
                </h2>
                </div>

                <div className="px-4 py-6">
                <p className="text-xs text-[#818b9b]">
                    Select a node to view its configuration.
                </p>
                </div>
            </aside>
        );
    }

    const data = selectedNode.data as NodeData;

    const requiresBody = ['POST', 'PUT', 'PATCH'].includes(
        data.method ?? 'GET',
    );

    let bodyError = '';

    if (requiresBody && data.body?.trim()) {
    try {
        JSON.parse(data.body);
    } catch {
        bodyError = 'Invalid JSON syntax. Check your request body.';
    }
    }

  return (
    <aside className="w-[290px] shrink-0 border-l border-[#303744] bg-[#151920] text-[#e5eaf2]">
      <div className="border-b border-[#303744] px-4 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em]">
          Configuration
        </h2>
        <p className="mt-1 text-[11px] text-[#818b9b]">
          Configure selected node
        </p>
      </div>

      <div className="border-b border-[#303744] px-4 py-4">
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#778295]">
          Node Name
        </label>

        <input
          type="text"
          value={data.label ?? ''}
          onChange={(event) =>
            onUpdateNode(selectedNode.id, {
              label: event.target.value,
            })
          }
          className="w-full border border-[#343b48] bg-[#11151c] px-3 py-2 text-xs text-[#e5eaf2] outline-none focus:border-[#64748b]"
        />

        <p className="mt-2 text-[10px] text-[#778295]">
          Type: {selectedNode.type}
        </p>
      </div>

      {selectedNode.type === 'httpRequest' && (
        <div className="space-y-4 px-4 py-4">
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#778295]">
              HTTP Method
            </label>

            <select
              value={data.method ?? 'GET'}
              onChange={(event) =>
                onUpdateNode(selectedNode.id, {
                  method: event.target.value,
                })
              }
              className="w-full border border-[#343b48] bg-[#11151c] px-3 py-2 text-xs text-[#e5eaf2] outline-none focus:border-[#64748b]"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#778295]">
              Endpoint URL
            </label>

            <input
              type="url"
              value={data.url ?? ''}
              onChange={(event) =>
                onUpdateNode(selectedNode.id, {
                  url: event.target.value,
                })
              }
              placeholder="https://api.example.com"
              className="w-full border border-[#343b48] bg-[#11151c] px-3 py-2 text-xs text-[#e5eaf2] outline-none focus:border-[#64748b]"
            />

            <p className="mt-2 text-[10px] text-[#778295]">
              Enter the API endpoint URL.
            </p>
            {['POST', 'PUT', 'PATCH'].includes(data.method ?? 'GET') && (
                <div>
                    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#778295]">
                    Request Body (JSON)
                    </label>

                    <textarea
                    value={data.body ?? ''}
                    onChange={(event) =>
                        onUpdateNode(selectedNode.id, {
                        body: event.target.value,
                        })
                    }
                    placeholder={`{
                "title": "FlowArm Test",
                "body": "Testing workflow",
                "userId": 1
                }`}
                    rows={9}
                    spellCheck={false}
                    className="w-full resize-y border border-[#343b48] bg-[#11151c] px-3 py-2 font-mono text-[11px] leading-5 text-[#aeb9ca] outline-none focus:border-[#64748b]"
                    />
                    {bodyError ? (
                        <p className="mt-2 text-[10px] text-red-400">
                            {bodyError}
                        </p>
                        ) : (
                        <p className="mt-2 text-[10px] text-[#778295]">
                            {data.body?.trim()
                            ? 'Valid JSON payload.'
                            : 'Enter a JSON request payload.'}
                        </p>
                    )}
                </div>
                )}
          </div>
        </div>
      )}
    </aside>
  );
}
