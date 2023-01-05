import React from 'react';
import { Node } from 'reactflow';
import CustomNode from "./node";
export interface NodeProps {
    id: string,
    data: {
        handleFileUpload: ()=>void,
        outputData: string,
        childNode: string,
        setNodes:React.Dispatch<React.SetStateAction<Node[]>>
    },
    selected:boolean
}
const FileNode: React.FC<NodeProps> = ({ data ,id, selected}) => {
    // const {setNodes, getNodes} = useReactFlow();
    // console.log(data);
    const handle = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.files![0]!.name);
        if (e.target.files && e.target.files.length !=0){
            let file = e.target.files[0];
            if (file){
                // const reader = new FileReader();
                // reader.readAsDataURL(file);
                // reader.onloadend = (e) => {
                //     console.log(reader.result);
                //     data.setNodes(prev => {
                //         console.log(prev)
                //         prev[0]!.data!.outputData = reader.result
                //         prev[0]!.data!.imgData = reader.result
                //         if (data.childNode) {
                //             const targetIdx = prev.findIndex((x) => x.id == data.childNode);
                //             console.log("TARGETIDX", targetIdx, prev[targetIdx])
                //             prev[1]!.data = {
                //                 ...prev[1]!.data,
                //                 imgData: reader.result
                //             }
                //         }

                //         return [...prev];
                //     });
                    
                // }

                let arraybuf = await file.arrayBuffer();
                let blob = new Blob([new Uint8Array(arraybuf)]);
                data.setNodes(prev=>{

                    prev[0]!.data!.outputData = blob
                    prev[0]!.data!.imgData =blob 
                    if (data.childNode) {
                        const targetIdx = prev.findIndex((x) => x.id == data.childNode);
                        console.log("TARGETIDX", targetIdx, prev[targetIdx])
                        prev[targetIdx]!.data = {
                            ...prev[1]!.data,
                            imgData: blob
                        }
                    }

                    return [...prev];
                })
            }
        }
        
    }
    return (
        <CustomNode selected={selected} id={id} data={data}>
            <input type="file" onChange={handle}/>
            <button className='text-white' >Get Nodes</button>
        </CustomNode>
    )
}

export default FileNode;