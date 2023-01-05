import React, { useEffect, useRef } from 'react'
import CustomNode from "./node"
import { Node, useReactFlow } from 'reactflow'
const CropNode:React.FC<{selected:boolean,id:string, data:{
    imgData: Blob | string | null,
    imgRef: React.RefObject<HTMLCanvasElement>,
    childNode: string,
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>

}}> = ({selected, id, data}) => {
    const {setNodes} = useReactFlow();
    const localCanvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        console.log("CROPNODE",data.imgData);
        localCanvasRef.current!.width = data.imgRef.current!.width
        localCanvasRef.current!.height = data.imgRef.current!.height
        const draw = async (blob:Blob)=>{
            const bitmap = await createImageBitmap(blob);
            const ctx = localCanvasRef.current?.getContext("2d");
            if (ctx){
                ctx.drawImage(bitmap, 0,0);
                ctx.canvas.toBlob(blob=>{
                    data.setNodes(prev => {
                        const idx = prev.findIndex(x => x.id == id);
                        console.log("EXISTS", prev[idx])
                        prev[idx]!.data = {
                            ...prev[idx]!.data,
                            outputData: blob
                        };
                        if (data.childNode) {
                            const targetIdx = prev.findIndex((x) => x.id == data.childNode);
                            // console.log("TARGETIDX", targetIdx, prev[targetIdx])
                            prev[targetIdx]!.data = {
                                ...prev[targetIdx]!.data,
                                imgData: blob
                            }
                        }
                        return [...prev]
                    })

                })
            }
        }

        if (window != undefined && data.imgData != null){
            draw(data.imgData as Blob);
        }

        
    }, [data.imgData]);

    const handleDrawBox= (e:React.DragEvent)=>{
        e.stopPropagation()
        console.log(e)
    }
    return (
      <CustomNode inputHandle selected={selected} id={id} data={data} overrideStyles={"!w-96 !h-96"}>
        <canvas onDrag={handleDrawBox} ref={localCanvasRef}></canvas>

        <div className='w-6 h-6 bg-gray-800 rounded-md drag-handle absolute top-4 right-4'></div>
      </CustomNode>
  )
}

export default CropNode