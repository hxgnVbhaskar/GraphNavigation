import React, { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import './PropertyPanel.css';

function PropertyPanel({ selectedNode, onClose }) {
    const [nodeDetails, setNodeDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Reset details when node changes
        setNodeDetails(null);

        // Load external data if detailsFile is specified
        if (selectedNode?.data?.detailsFile) {
            setLoading(true);
            fetch(`/src/data/${selectedNode.data.detailsFile}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${selectedNode.data.detailsFile}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setNodeDetails(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load node details:', err);
                    setLoading(false);
                });
        }
    }, [selectedNode]);

    if (!selectedNode) return null;

    return (
        <Resizable
            defaultSize={{
                width: 300,
                height: '100%',
            }}
            minWidth={400}
            maxWidth={600}
            enable={{
                top: false, right: false, bottom: false, left: true,
                topRight: false, bottomRight: false, bottomLeft: false, topLeft: false
            }}
            className="property-panel"
        >
            <div className="property-panel-header">
                <h2>{selectedNode.data?.label || 'No Label'}</h2>
                <button
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close panel"
                >
                    &times;
                </button>
            </div>

            <div className="property-content">
                {loading ? (
                    <div className="loading-state">Loading details...</div>
                ) : nodeDetails ? (
                    <>
                        {nodeDetails.description && (
                            <div className="property-section">
                                <h3 className="section-title">Description</h3>
                                <p className="description-text">{nodeDetails.description}</p>
                            </div>
                        )}

                        <div className="property-grid">
                            {nodeDetails.type && (
                                <div className="property-row">
                                    <span className="property-label">Type</span>
                                    <span className="property-value">{nodeDetails.type}</span>
                                </div>
                            )}
                            {nodeDetails.status && (
                                <div className="property-row">
                                    <span className="property-label">Status</span>
                                    <span className="property-value badge-status">{nodeDetails.status}</span>
                                </div>
                            )}
                            {nodeDetails.owner && (
                                <div className="property-row">
                                    <span className="property-label">Owner</span>
                                    <span className="property-value">{nodeDetails.owner}</span>
                                </div>
                            )}
                            {nodeDetails.lastUpdated && (
                                <div className="property-row">
                                    <span className="property-label">Last Updated</span>
                                    <span className="property-value">{nodeDetails.lastUpdated}</span>
                                </div>
                            )}
                        </div>

                        {nodeDetails.keyFeatures && nodeDetails.keyFeatures.length > 0 && (
                            <div className="property-section">
                                <h3 className="section-title">Key Features</h3>
                                <ul className="feature-list">
                                    {nodeDetails.keyFeatures.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {nodeDetails.serviceOfferings && nodeDetails.serviceOfferings.length > 0 && (
                            <div className="property-section">
                                <h3 className="section-title">Service Offerings</h3>
                                <ul className="feature-list">
                                    {nodeDetails.serviceOfferings.map((offering, idx) => (
                                        <li key={idx}>{offering}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {nodeDetails.resources && nodeDetails.resources.length > 0 && (
                            <div className="property-section">
                                <h3 className="section-title">Resources</h3>
                                <div className="resource-list">
                                    {nodeDetails.resources.map((resource, idx) => (
                                        <a key={idx} href={resource.url} className="resource-link">
                                            {resource.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="property-row">
                            <span className="property-label">Node ID</span>
                            <span className="property-value">{selectedNode.id}</span>
                        </div>
                        <div className="property-row">
                            <span className="property-label">Type</span>
                            <span className="property-value">
                                {selectedNode.type || 'default'}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </Resizable>
    );
}

export default PropertyPanel;
