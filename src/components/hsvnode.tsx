import React from 'react'
import CustomNode from "./node"
import { NodeProps } from './filenode'

interface HSVNodeProps{
    id: string, 
    data: { 
        label: string, 
        imgRef: React.RefObject<HTMLCanvasElement>,
    },
    selected: boolean,

}

const HSVNode:React.FC<HSVNodeProps> = ({data, id, selected}) => {
    const handleChange = (e: React.ChangeEvent)=>{

        const ctx = data.imgRef!.current?.getContext("2d")!;

        ctx.globalCompositeOperation = "saturation";
        ctx.fillStyle = "hsl(0,100%,50%)";  // saturation at 100%
        ctx.fillRect(0, 0, data.imgRef!.current!.width, data.imgRef.current!.height);  // apply the comp filter
        ctx.globalCompositeOperation = "source-over";

    }
  return (
    <CustomNode selected={selected} id={id} inputHandle data={data}>
        <div className='w-full h-full flex-1'>
            <input onChange={handleChange} type="range" name="" id="" />
            <input onChange={handleChange} type="range" name="" id="" />
            <input onChange={handleChange} type="range" name="" id="" />
            <div className='w-6 h-6 bg-gray-800 rounded-md drag-handle absolute top-4 right-4'></div>
        </div>
    </CustomNode>
  )
}

export default HSVNode