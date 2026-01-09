import { useState, useCallback, useMemo, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls, Background, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './ReactFlowUI.css';
import CustomNode from './CustomNode';
import TitleHeader from './TitleHeader';
import { getLayoutedElements } from '../utils/layout';
import initialData from '../data';

// Separate logic for distinct visibility calculation
const getNodesWithVisibility = (nodes, edges) => {
    const visibleNodeIds = new Set();
    const targets = new Set(edges.map(e => e.target));

    // Identify roots: nodes that are not targets of any edge
    const roots = nodes.filter(n => !targets.has(n.id));
    const queue = [...roots];

    // Roots are always visible
    roots.forEach(n => visibleNodeIds.add(n.id));

    while (queue.length > 0) {
        const curr = queue.shift();

        // If expanded, its children are visible
        // Note: We used to check if curr is visible, but since it's in the queue, it IS visible.
        if (curr.data.expanded) {
            const childrenEdges = edges.filter(e => e.source === curr.id);
            childrenEdges.forEach(e => {
                const child = nodes.find(n => n.id === e.target);
                if (child && !visibleNodeIds.has(child.id)) {
                    visibleNodeIds.add(child.id);
                    queue.push(child);
                }
            });
        }
    }

    return nodes.map(n => ({
        ...n,
        hidden: !visibleNodeIds.has(n.id)
    }));
};

const LayoutFlow = ({ onNodeSelect, onPaneClick: onPaneClickProp }) => {
    const { fitView } = useReactFlow();
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    // Initialize layout
    useEffect(() => {
        const initialEdges = initialData.edges;

        // Identify roots to set initial expansion
        const targets = new Set(initialEdges.map(e => e.target));

        const initialNodes = initialData.nodes.map(n => {
            // Check if node has children to set 'expandable'
            const hasChildren = initialEdges.some(e => e.source === n.id);
            // Expand only roots by default
            const isRoot = !targets.has(n.id);

            return {
                ...n,
                type: 'custom',
                data: {
                    ...n.data,
                    expanded: isRoot, // Only expand roots initially
                    expandable: hasChildren
                },
                hidden: false // Will be recalculated immediately
            };
        });

        // Calculate initial visibility
        const nodesWithVisibility = getNodesWithVisibility(initialNodes, initialEdges);

        const layouted = getLayoutedElements(nodesWithVisibility, initialEdges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);

        // Initial fit view
        window.requestAnimationFrame(() => {
            fitView({ padding: 0.2 });
        });

    }, []);

    const onNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    const onToggle = useCallback((nodeId) => {
        const idx = nodes.findIndex(n => n.id === nodeId);
        if (idx === -1) return;

        // Toggle expanded state
        const newNodes = [...nodes];
        newNodes[idx] = {
            ...newNodes[idx],
            data: {
                ...newNodes[idx].data,
                expanded: !newNodes[idx].data.expanded
            }
        };

        // Recalculate visibility
        const finalNodes = getNodesWithVisibility(newNodes, edges);

        const layouted = getLayoutedElements(finalNodes, edges);

        setNodes(layouted.nodes);
        setEdges(layouted.edges);

        // Queue fitView
        requestAnimationFrame(() => {
            fitView({ padding: 0.2, duration: 600 });
        });

    }, [nodes, edges, fitView]);

    const onNodeClick = useCallback((event, node) => {
        if (onNodeSelect) onNodeSelect(node);
    }, [onNodeSelect]);

    const onPaneClick = useCallback(() => {
        if (onPaneClickProp) onPaneClickProp();
    }, [onPaneClickProp]);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    // Inject handler into nodes data
    const nodesWithHandlers = useMemo(() => {
        return nodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                onExpand: () => onToggle(n.id)
            }
        }));
    }, [nodes, onToggle]);

    return (
        <ReactFlow
            nodes={nodesWithHandlers}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            colorMode='dark'
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
        >
            <Background />
            <Controls />
            <TitleHeader />
        </ReactFlow>
    );
};

export default function ReactFlowUI({ onNodeSelect, onPaneClick }) {
    return (
        <div className="react-flow-container">
            <ReactFlowProvider>
                <LayoutFlow onNodeSelect={onNodeSelect} onPaneClick={onPaneClick} />
            </ReactFlowProvider>
        </div>
    );
}