import React, { useEffect, useRef, useState } from 'react'
import CustomNode, { NodeData } from "./node"
import { applyConnectedNodes, clearConnectedNodes } from '../utils/connected'
import * as tf from "@tensorflow/tfjs"
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-converter"
import { contextProps } from '@trpc/react-query/dist/internals/context';
const BGNode:React.FC<{data:NodeData, id: string, selected:boolean}> = ({data, id, selected}) => {
    const [model, setModel] = useState<bodySegmentation.BodySegmenter>();

    const localCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        (async()=>{
            const model = bodySegmentation.SupportedModels.BodyPix; // or 'BodyPix'
            const segmenterConfig = {
                runtime: 'tfjs', // or 'tfjs'
                modelType: 'general' // or 'landscape'
            };

            const segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig as bodySegmentation.MediaPipeSelfieSegmentationTfjsModelConfig);

            console.log("LOADED:", segmenter);
            setModel(segmenter);
        })();
    },[])
    
    useEffect(()=>{
        if (data.imgData != null){
            applyConnectedNodes(id, data, data.imgData);
        } else {
            data.setNodes(prev=>clearConnectedNodes(prev, id, data));
        }
    },[data.imgData])

    const handleApplyModel = async ()=>{
        if (data.imgData != null){
            const bitmap = await createImageBitmap(data.imgData);
            if (model && bitmap){
                let input = tf.browser.fromPixels(bitmap);
                console.log(input.shape);
                console.log(model)
                const out = await model.segmentPeople(input, {segmentBodyParts: false} as bodySegmentation.MediaPipeSelfieSegmentationTfjsSegmentationConfig);
                console.log("OUT OF BG MODEL:", out);
                localCanvasRef.current!.width = bitmap.width;
                localCanvasRef.current!.height = bitmap.height;
                const ctx = localCanvasRef.current!.getContext("2d");
                if (ctx){

                    for (let mask of out){
                        const imgData =await mask.mask.toCanvasImageSource();
                        
                        ctx.drawImage(imgData, 0 ,0);
                        ctx.canvas.toBlob(blob=>{
                            if (blob) applyConnectedNodes(id,data,blob)})
                    }
                }
        }}
    }
    return (
    <CustomNode data={data} id={id} selected={selected} inputHandle>
        <canvas ref={localCanvasRef} hidden></canvas>
       <button onClick={handleApplyModel}className='w-24 h-8 rounded-md border border-gray-500 text-white mt-auto'>Apply</button> 
       <div className='absolute top-4 right-4 w-6 h-6 rounded-md drag-handle bg-gray-800'></div>
    </CustomNode>
    )

}

export default BGNode