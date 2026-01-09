import { Panel } from '@xyflow/react';
import './TitleHeader.css';

const TitleHeader = () => {
    return (
        <Panel position="top-left" className="title-header-panel">
            {/* Logo Section */}
            <div className="header-logo-container">
                {/* Hexagon-like placeholder logo */}
                <svg className="header-logo" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </div>

            {/* Title Section */}
            <div className="header-title">
                <h1>Technical Enablement</h1>
            </div>

            {/* Navigation Buttons */}
            <div className="header-nav">
                <button className="nav-button" title="Back">
                    <svg className="nav-icon" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button className="nav-button" title="Home">
                    <svg className="nav-icon" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>
            </div>
        </Panel>
    );
};

export default TitleHeader;
