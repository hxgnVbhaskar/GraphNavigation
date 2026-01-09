import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = memo(({ data, isConnectable }) => {
    return (
        <div style={{
            padding: '5px',
            border: '1px solid #777',
            borderRadius: '25px',
            background: '#222',
            color: '#fff',
            position: 'relative',
            width: '200px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '14px',
            lineHeight: '1.2'
        }}>
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                style={{ background: '#555' }}
            />
            <div>
                {data.label}
            </div>
            {data.expandable && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        data.onExpand();
                    }}
                    style={{
                        position: 'absolute',
                        right: '-10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        background: '#555',
                        borderRadius: '80%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px',
                        zIndex: 10
                    }}
                >
                    {data.expanded ? '-' : '+'}
                </div>
            )}
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                style={{ background: '#555' }}
            />
        </div>
    );
});

export default CustomNode;
