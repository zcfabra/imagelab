import React, { useEffect, useRef, useState } from 'react'
import CustomNode, { NodeData } from "./node"
import { Node, rectToBox, useReactFlow } from 'reactflow'
import { applyConnectedNodes, clearConnectedNodes } from '../utils/connected'
const CropNode:React.FC<{selected:boolean,id:string, data:NodeData}> = ({selected, id, data}) => {
    const {setNodes} = useReactFlow();
    const [cropZone, setCropZone] = useState<{x:number, y:number, width: number,height:number, scalingFactor:number} | null>(null)
    const [localImage, setLocalImage] = useState<ImageBitmap>();
    const [startingDragPoint, setStartingDragPoint] = useState<{x:number,y:number} | null>(null);
    const localCanvasRef = useRef<HTMLCanvasElement>(null);
    const localHiddenCanvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
 
        const draw = async (blob:Blob)=>{
            const bitmap = await createImageBitmap(blob);
            const ctx = localCanvasRef.current?.getContext("2d");
            const bound = localCanvasRef.current!.getBoundingClientRect();
            if (ctx){
                const scalingFactor = Math.min(bound.width / bitmap.width, bound.height / bitmap.height);
                const newWidth = bitmap.width * scalingFactor; const newHeight = bitmap.height * scalingFactor;
                localCanvasRef.current!.width = bound.width;
                localCanvasRef.current!.height = bound.height; 
                const x = (localCanvasRef.current!.width / 2) - (newWidth / 2);
                const y = (localCanvasRef.current!.height / 2) - (newHeight / 2);
                ctx.drawImage(bitmap,x,y,newWidth, newHeight);
                setLocalImage(bitmap);
                ctx.canvas.toBlob(blob=>{
                    if (blob){
                        applyConnectedNodes(id, data, blob);
                    }

                })
            }
        }
        if (data.imgData == null){
            localCanvasRef.current?.getContext("2d")?.clearRect(0,0,localCanvasRef.current.width, localCanvasRef.current.height);   
            data.setNodes(prev=>{
                return clearConnectedNodes(prev, id, data);
            })
        }
        if (window != undefined && data.imgData != null){
            draw(data.imgData as Blob);
            setCropZone(null)
        }


        
    }, [data.imgData]);

    useEffect(()=>{
        if (cropZone != null && localImage !=null){

            const ctx= localHiddenCanvasRef.current?.getContext("2d");
            const bound = localCanvasRef.current!.getBoundingClientRect();
            if (ctx){
                const realScale= Math.max(localImage.width / bound.width, localImage.height / bound.height);
                const scalingFactorX = realScale
                const scalingFactorY = realScale;

                localHiddenCanvasRef.current!.width = cropZone.width * scalingFactorX;
                localHiddenCanvasRef.current!.height = cropZone.height * scalingFactorY;
                
                const originalScale = Math.min(bound.width / localImage.width , bound.height / localImage.height);
                const x = ((bound.width/2)-(localImage.width * originalScale / 2)   ) * 1;
                const y = ((bound.height/2) - (localImage.height * originalScale / 2)   ) * 1;

                ctx.drawImage(localImage, (cropZone.x - x ) * scalingFactorX, (cropZone.y - y) * scalingFactorY, cropZone.width * scalingFactorX, cropZone.height * scalingFactorY, 0,0, cropZone.width * scalingFactorX, cropZone.height * scalingFactorY)

                ctx.canvas.toBlob((blob)=>{
                    if (blob){
                        applyConnectedNodes(id,data,blob);
                    }
                })
            }
            
        }


    },[cropZone, localImage])

    const handleDrawBox= (e:React.MouseEvent<HTMLCanvasElement>)=>{
        if (startingDragPoint != null){
            const ctx= localCanvasRef.current?.getContext('2d');
            const bound = localCanvasRef.current!.getBoundingClientRect();
            const scalingFactor = Math.min(bound.width / localImage!.width, bound.height / localImage!.height);
            const newWidth = scalingFactor * localImage!.width;
            const newHeight = scalingFactor * localImage!.height;
            const x = (localCanvasRef.current!.width / 2) - (newWidth / 2);
            const y = (localCanvasRef.current!.height / 2) - (newHeight / 2);
            if (ctx){
                ctx.clearRect(0,0, localCanvasRef.current!.width, localCanvasRef.current!.height);
                ctx.drawImage(localImage!, x,y,newWidth,newHeight)

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
        const rect = e.currentTarget.getBoundingClientRect();
        const scalingFactor = localCanvasRef.current!.width/ rect.width;
        if (startingDragPoint != null){
            setCropZone({ x:startingDragPoint.x * scalingFactor, y: startingDragPoint.y  *scalingFactor , width: (e.clientX - rect.left - startingDragPoint!.x) * scalingFactor , height:(e.clientY - rect.top - startingDragPoint!.y) * scalingFactor , scalingFactor:scalingFactor})
            setStartingDragPoint(null);
        }
    };
    const handleClearCrop=()=>{
        if (cropZone == null){
            return;
        }
        setCropZone(null);
        const ctx = localCanvasRef.current?.getContext("2d");
        if (ctx){
            const bound = localCanvasRef.current!.getBoundingClientRect();
            const scalingFactor = Math.min(bound.width / localImage!.width, bound.height / localImage!.height);
            const newWidth = scalingFactor * localImage!.width;
            const newHeight = scalingFactor * localImage!.height;
            const x = (localCanvasRef.current!.width / 2) - (newWidth / 2);
            const y = (localCanvasRef.current!.height / 2) - (newHeight / 2);
            ctx.clearRect(0, 0, localCanvasRef.current!.width, localCanvasRef.current!.height);
            ctx.drawImage(localImage, x,y,newWidth,newHeight);
        }
        
        
        setNodes(prev=>{
            const idx = prev.findIndex(x=>x.id == id);
            prev[idx]!.data = {
                ...prev[idx]!.data,
                outputData: data.imgData
            };
            if (prev[idx]!.data.childNode !=null){
                const targetIdx = prev.findIndex(x=>x.id == prev[idx]!.data.childNode);
                if (prev[targetIdx] !=null && prev[targetIdx]!=undefined){
                    prev[targetIdx]!.data ={
                        ...prev[targetIdx]!.data,
                        imgData: data.imgData
                    }
                }
            }
            return [...prev]
        })
    };
    return (
      <CustomNode inputHandle selected={selected} id={id} data={data} overrideStyles={"!w-[28rem] !h-[30rem] pt-8"}>
        <div className='w-full flex flex-col items-center'>
            <canvas className='cursor-crosshair h-96 w-96 border-2 border-gray-500' onMouseLeave={handleDragEnd} onMouseUp={handleDragEnd} onMouseDown={handleDragStart} onMouseMove={handleDrawBox} ref={localCanvasRef}></canvas>
        </div>
        <canvas hidden ref={localHiddenCanvasRef}></canvas>
        <div className='absolute top-4 right-4 flex flex-row items-center h-6'>
            <button onClick={()=>handleClearCrop()}className='w-16 h-8 text-white border hover:bg-gray-900 transition-all rounded-md border-gray-500'>Clear</button>
            <div className='w-6 h-6 ml-4 bg-gray-800 rounded-md drag-handle'></div>
        </div>
      </CustomNode>
  )
}

export default CropNode