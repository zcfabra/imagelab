import React, { memo } from 'react'
import { Handle, Position } from 'reactflow';
import CustomNode from "./node"
export interface NodeProps {
    id: string,
    data: any,
    selected:boolean
}
const FileNode: React.FC<NodeProps> = ({ data ,id, selected}) => {
    // console.log(data);

    return (
        <CustomNode selected={selected} id={id} data={data}>
            <input type="file" onChange={data.handleFileUpload}/>
        </CustomNode>
    )
}

export default memo(FileNode);