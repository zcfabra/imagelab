import React, { useState } from 'react';
import { Node } from 'reactflow';
import CustomNode, { NodeData } from "./node";
import { applyConnectedNodes, clearConnectedNodes } from '../utils/connected';
export interface NodeProps {
    id: string,
    data: NodeData,
    selected:boolean
}
const FileNode: React.FC<NodeProps> = ({ data ,id, selected}) => {
    // const {setNodes, getNodes} = useReactFlow();
    // console.log(data);
    const [fileUploaded, setFileUploaded] = useState<boolean>(false);
    const handle = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        console.log("FILENODE")
        // console.log(e.target.files[0].name);
        if (e.target.files && e.target.files.length !=0){
            let file = e.target.files[0];
            if (file){
                let arraybuf = await file.arrayBuffer();
                let blob = new Blob([new Uint8Array(arraybuf)]);
                applyConnectedNodes(id, data,blob);
                setFileUploaded(true);
            }
        } else {}
        
    }

    const handleRemoveFile = ()=>{
        data.setNodes(prev=>{
            return clearConnectedNodes(prev, id, data);
        })
        setFileUploaded(false);
    }
    return (
        <CustomNode selected={selected} id={id} data={data}>
           {!fileUploaded ? <input type="file" onChange={handle}/> : <button onClick={()=>handleRemoveFile()} className='text-white'>Delete</button>}
        </CustomNode>
    )
}

export default FileNode;