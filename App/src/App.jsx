import { useState, useCallback } from 'react'
import './App.css'
import ReactFlowUI from './components/ReactFlowUI'
import PropertyPanel from './components/PropertyPanel'

function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="app-container" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlowUI
          onNodeSelect={handleNodeSelect}
          onPaneClick={handlePaneClick}
        />
      </div>
      {selectedNode && (
        <PropertyPanel selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  )
}

export default App
