import React, { useEffect, useState } from 'react'
import CustomNode, { NodeData } from "./node"
import { applyConnectedNodes, clearConnectedNodes } from '../utils/connected'
import * as tf from "@tensorflow/tfjs"
const MODEL_URL = "https://tfhub.dev/tensorflow/tfjs-model/bodypix_050/1/default/1"
const BGNode:React.FC<{data:NodeData, id: string, selected:boolean}> = ({data, id, selected}) => {
    const [model ,setModel] = useState<tf.GraphModel | tf.LayersModel>();

    useEffect(()=>{
        (async()=>{
            const model = await tf.loadGraphModel(MODEL_URL, {fromTFHub:true});
            console.log("LOADED:", model);
            setModel(model);
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
                let input = tf.browser.fromPixels(bitmap).toFloat().expandDims(0);
                console.log(input.shape);
                const out = model.predict(input);
                console.log(out);
            }
        }
    }
    return (
    <CustomNode data={data} id={id} selected={selected} inputHandle>
       <button onClick={handleApplyModel}className='w-24 h-8 rounded-md border border-gray-500 text-white mt-auto'>Apply</button> 
       <div className='absolute top-4 right-4 w-6 h-6 rounded-md drag-handle bg-gray-800'></div>
    </CustomNode>
    )

}

export default BGNode