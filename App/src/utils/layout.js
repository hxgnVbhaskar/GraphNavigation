import dagre from "dagre";

const nodeWidth = 200;
const nodeHeight = 80;

export const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
        rankdir: "LR",       // Left → Right
        nodesep: 80,         // space between nodes
        ranksep: 150         // space between levels
    });

    // Filter out hidden nodes for layout calculation
    const visibleNodes = nodes.filter(node => !node.hidden);
    const visibleEdges = edges.filter(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        return sourceNode && !sourceNode.hidden && targetNode && !targetNode.hidden;
    });

    visibleNodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
            width: nodeWidth,
            height: nodeHeight
        });
    });

    visibleEdges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    // Map visible nodes to their new positions
    const layoutedVisibleNodes = visibleNodes.map((node) => {
        const pos = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: pos.x - nodeWidth / 2,
                y: pos.y - nodeHeight / 2
            },
            targetPosition: 'left',
            sourcePosition: 'right',
        };
    });

    // Merge with hidden nodes (keeping their original position or a default one)
    // It's important to return ALL nodes so React Flow doesn't lose state for hidden ones
    const hiddenNodes = nodes.filter(node => node.hidden);

    // Calculate hidden edges
    const layoutedNodeIds = new Set(layoutedVisibleNodes.map(n => n.id));
    const allEdges = edges.map(edge => {
        const isHidden = !layoutedNodeIds.has(edge.source) || !layoutedNodeIds.has(edge.target);
        return { ...edge, hidden: isHidden };
    });

    return {
        nodes: [...layoutedVisibleNodes, ...hiddenNodes],
        edges: allEdges
    };
};
