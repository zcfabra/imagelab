import React, { useEffect, useState } from 'react'
import CustomNode from "./node"
import { NodeProps } from './filenode'
import { useReactFlow } from 'reactflow';

interface HSVNodeProps{
    id: string, 
    data: { 
        label: string, 
        imgRef: React.RefObject<HTMLCanvasElement>,
        imgData: string | null,
    },
    selected: boolean,

}
// type hslValues = { hue: number, saturation: number, lightness: number }
const HSVNode:React.FC<HSVNodeProps> = ({data, id, selected}) => {
    const [hsl, setHsl]= useState({hue:0, saturation:100,lightness:50});
    const [localImage, setLocalImage] = useState<string | null>(null);
    const {setNodes} = useReactFlow();
    useEffect(()=>{
        console.log("imgDataChanged",data.imgData);
        setLocalImage(data.imgData);
    }, [data.imgData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.name, e.target.value)
        setHsl(prev=>{
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })

    }
    useEffect(()=>{
        const cvx = new CanvasRenderingContext2D();
        const tempImage= new Image();
        tempImage.src = localImage!;
        let imgOutData: string;
        tempImage.onload = (e)=>{
            cvx.drawImage(tempImage,0,0);
            cvx.drawImage(tempImage, 0, 0); // image to change
            cvx.globalCompositeOperation = "saturation";
            cvx.fillStyle = "hsl(0,100%,50%)";  // saturation at 100%
            cvx.fillRect(0, 0, tempImage.width, tempImage.height);  // apply the comp filter
            cvx.globalCompositeOperation = "source-over";  // restore default comp
            imgOutData = cvx.canvas.toDataURL();

        }

        setNodes(prev=>{
            const idx = prev.findIndex(x=>x.id == id);
            prev[idx]!.data = {
                ...prev[idx]?.data,
                outputData: imgOutData
            }
            return [...prev]
        })
    }, [hsl])
  return (
    <CustomNode selected={selected} id={id} inputHandle data={data}>
        <div className='w-full h-full flex-1'>
            <input onChange={handleChange} value={hsl.hue} type="range" name="hue" min={0} max={100} step={1} id="" />
            <input onChange={handleChange} value={hsl.saturation} type="range" name="saturation" min={0} max={100} step={1} id="" />
            <input onChange={handleChange} value={hsl.lightness} type="range" name="lightness" min={0} max={100} step={1} id="" />
            <div className='w-6 h-6 bg-gray-800 rounded-md drag-handle absolute top-4 right-4'></div>
        </div>
    </CustomNode>
  )
}

export default HSVNode