import React, { useEffect, useRef } from 'react'
import CustomNode from "./node"
import { Node, useReactFlow } from 'reactflow'
const CropNode:React.FC<{selected:boolean,id:string, data:{
    imgData: Blob | string | null,
    childNode: string,
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>

}}> = ({selected, id, data}) => {
    const {setNodes} = useReactFlow();
    useEffect(()=>{
        console.log("CROPNODE",data.imgData);

        data.setNodes(prev => {
            const idx = prev.findIndex(x => x.id == id);
            prev[idx]!.data = {
                ...prev[idx]!.data,
                outputData: data.imgData
            };
            if (data.childNode) {
                const targetIdx = prev.findIndex((x) => x.id == data.childNode);
                // console.log("TARGETIDX", targetIdx, prev[targetIdx])
                prev[targetIdx]!.data = {
                    ...prev[targetIdx]!.data,
                    imgData: data.imgData 
                }
            }
            return [...prev]
        })
    }, [data.imgData]);
    const localRef = useRef<HTMLCanvasElement>(null);
    return (
      <CustomNode inputHandle selected={selected} id={id} data={data}>
        <canvas ref={localRef}></canvas>

        <div className='w-6 h-6 bg-gray-800 rounded-md drag-handle absolute top-4 right-4'></div>
      </CustomNode>
  )
}

export default CropNode