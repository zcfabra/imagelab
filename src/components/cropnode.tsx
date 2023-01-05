import React, { useEffect, useRef, useState } from 'react'
import CustomNode from "./node"
import { Node, rectToBox, useReactFlow } from 'reactflow'
import { number } from 'zod'
import { resolveTxt } from 'dns/promises'
import { getNextInternalQuery } from 'next/dist/server/request-meta'
const CropNode:React.FC<{selected:boolean,id:string, data:{
    imgData: Blob | string | null,
    imgRef: React.RefObject<HTMLCanvasElement>,
    childNode: string,
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>

}}> = ({selected, id, data}) => {
    const {setNodes} = useReactFlow();
    const [cropZone, setCropZone] = useState<{x:number, y:number, width: number,height:number, scalingFactor:number} | null>(null)
    const [localImage, setLocalImage] = useState<ImageBitmap>();
    const [startingDragPoint, setStartingDragPoint] = useState<{x:number,y:number} | null>(null);
    const localCanvasRef = useRef<HTMLCanvasElement>(null);
    const localHiddenCanvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        // console.log("CROPNODE",data.imgData);
        localCanvasRef.current!.width = data.imgRef.current!.width
        localCanvasRef.current!.height = data.imgRef.current!.height
        const draw = async (blob:Blob)=>{
            const bitmap = await createImageBitmap(blob);
            const ctx = localCanvasRef.current?.getContext("2d");
            if (ctx){
                ctx.drawImage(bitmap, 0,0);
                setLocalImage(bitmap);
                if (cropZone !=null){

                }
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

    useEffect(()=>{
        if (cropZone != null && localImage !=null){

            localHiddenCanvasRef.current!.width = localCanvasRef.current!.width;
            localHiddenCanvasRef.current!.height = localCanvasRef.current!.height;
            
            const ctx= localHiddenCanvasRef.current?.getContext("2d");
            if (ctx){
                ctx.drawImage(localImage!, cropZone!.x, cropZone!.y, cropZone.width, cropZone.height, 0, 0, localCanvasRef.current!.width, localCanvasRef.current!.height);
                ctx.canvas.toBlob((blob)=>{
                    data.setNodes(prev=>{
                        const idx = prev.findIndex(x=>x.id == id);
                        if (idx){
                            prev[idx]!.data = {
                                ...prev[idx]!.data,
                                outputData: blob
                            }
                        }
                        return [...prev]
                    })
                })
            }
            
        }


    },[cropZone])

    const handleDrawBox= (e:React.MouseEvent<HTMLCanvasElement>)=>{
        if (startingDragPoint != null){
            const ctx= localCanvasRef.current?.getContext('2d');
            if (ctx){
                ctx.clearRect(0,0, localCanvasRef.current!.width, localCanvasRef.current!.height)
                ctx.drawImage(localImage!, 0, 0)

                const rect = e.currentTarget.getBoundingClientRect();
                console.log(e.clientX - rect.left - startingDragPoint.x, e.clientY - rect.top - startingDragPoint.y)
                ctx.beginPath(); 
                ctx.strokeStyle = "red";
                const scalingFactor = localCanvasRef.current!.width / rect.width;
                ctx.rect(startingDragPoint.x * scalingFactor, startingDragPoint.y *scalingFactor, (e.clientX - rect.left - startingDragPoint.x) * scalingFactor, (e.clientY - rect.top  - startingDragPoint.y) * scalingFactor);
                ctx.stroke()
                ctx.closePath()
            }

        }
    }
    const handleDragStart = (e: React.MouseEvent<HTMLCanvasElement>)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        // const scalingFactor = localCanvasRef.current!.width / rect.width
        const scalingFactor = 1
        console.log("YO", rect.left, rect.top, rect.width, rect.height)
        console.log(e.clientX - rect.left, e.clientY - rect.top)
        setStartingDragPoint({x: (e.clientX - rect.left) * scalingFactor  , y:(e.clientY -rect.top) *scalingFactor})
    }
    const handleDragEnd = (e:React.MouseEvent<HTMLCanvasElement>)=>{
        const rect = e.currentTarget.getBoundingClientRect()
        const scalingFactor = localCanvasRef.current!.width/ rect.width;
        if (startingDragPoint != null){
            setCropZone({ x:startingDragPoint.x * scalingFactor, y: startingDragPoint.y * scalingFactor, width: (e.clientX - rect.left - startingDragPoint!.x) * scalingFactor, height:(e.clientY - rect.top - startingDragPoint!.y) * scalingFactor, scalingFactor:scalingFactor})
            setStartingDragPoint(null);
        }
    }
    return (
      <CustomNode inputHandle selected={selected} id={id} data={data} overrideStyles={"!w-96 !h-96 !overflow-scroll"}>
        <canvas className='cursor-crosshair' onMouseLeave={handleDragEnd} onMouseUp={handleDragEnd} onMouseDown={handleDragStart} onMouseMove={handleDrawBox} ref={localCanvasRef}></canvas>
        <canvas hidden ref={localHiddenCanvasRef}></canvas>
        <div className='w-6 h-6 bg-gray-800 rounded-md drag-handle absolute top-4 right-4'></div>
      </CustomNode>
  )
}

export default CropNode