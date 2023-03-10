import React, { useEffect, useRef, useState } from 'react'
import CustomNode, { NodeData } from "./node"
import { NodeProps } from './filenode'
import { Node, useReactFlow } from 'reactflow';
import { applyConnectedNodes, clearConnectedNodes } from '../utils/connected';

interface HSLNodeProps{
    id: string, 
    data: NodeData,
    selected: boolean,
}
// type hslValues = { hue: number, saturation: number, lightness: number }
const HSLNode:React.FC<HSLNodeProps> = ({data, id, selected}) => {
    const [hsl, setHsl]= useState(100);
    const offlineCanvasRef = useRef<HTMLCanvasElement>(null);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.name, e.target.value)
        setHsl(Number(e.target.value));

    }
    useEffect(()=>{
        // if (window != undefined){
        let cvx  = offlineCanvasRef.current?.getContext("2d");
        if (cvx!= null && cvx!= undefined){
            const doTheThing = async(blob:Blob)=>{
                const bitmap = await createImageBitmap(blob);
                offlineCanvasRef.current!.width = bitmap.width;
                offlineCanvasRef.current!.height = bitmap.height;
                cvx?.clearRect(0,0, offlineCanvasRef.current!.width, offlineCanvasRef.current!.height);
                cvx!.filter = `saturate(${hsl}%)`;
                cvx?.drawImage(bitmap,0,0);
                // cvx!.fillRect(0, 0, offlineCanvasRef.current!.width, offlineCanvasRef.current!.height);  // apply the comp filter
                // cvx!.globalCompositeOperation = "source-over";  // restore default comp
                cvx?.canvas.toBlob(blob=>{
                    if (blob){
                        applyConnectedNodes(id,data,blob);
                    }
                })
            }
            if (window !=undefined){
                if (data.imgData != null){
                    doTheThing(data.imgData as Blob);
                } else {
                    data.setNodes(prev=>{
                        return clearConnectedNodes(prev,id,data);
                    })
                }

            }
            // tempImage.onload = (e) => {
            //     offlineCanvasRef.current!.width = data.imgRef.current!.width
            //     offlineCanvasRef.current!.height = data.imgRef.current!.height
            //     cvx!.drawImage(tempImage, 0, 0); // image to change
            //     cvx!.globalCompositeOperation = "saturation";
            //     cvx!.fillStyle = "hsl(0,100%,50%)";  // saturation at 100%
            //     cvx!.fillRect(0, 0, tempImage.width, tempImage.height);  // apply the comp filter
            //     cvx!.globalCompositeOperation = "source-over";  // restore default comp
            //     imgOutData = cvx!.canvas.toDataURL();
            //     cvx!.canvas.toBlob((blob)=>{
            //         setNodes(prev => {
            //             const idx = prev.findIndex(x => x.id == id);
            //             prev[idx]!.data = {
            //                 ...prev[idx]?.data,
            //                 outputData:blob 
            //             }
            //             return [...prev]
            //         })
            //     })
                
            // }

            
        }

      
    // }
    }, [hsl, data.imgData])
  return (
    <CustomNode selected={selected} id={id} inputHandle data={data}>
        <canvas hidden ref={offlineCanvasRef}></canvas>
        <div className='w-full h-full flex-1'>
            {/* <input onChange={handleChange} value={hsl.hue} type="range" name="hue" min={0} max={100} step={1} id="" /> */}
            <input onChange={handleChange} value={hsl} type="range" name="saturation" min={0} max={100} step={1} id="" />
            {/* <input onChange={handleChange} value={hsl.lightness} type="range" name="lightness" min={0} max={100} step={1} id="" /> */}
            <div className='w-6 h-6 bg-gray-800 rounded-md drag-handle absolute top-4 right-4'></div>
        </div>
    </CustomNode>
  )
}

export default HSLNode