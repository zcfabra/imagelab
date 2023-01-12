import React, { useEffect, useState } from 'react'
import { NodeData } from './node'
import CustomNode from "./node"
import { applyConnectedNodes, clearConnectedNodes } from '../utils/connected';
import * as tf from "@tensorflow/tfjs"
import { classes } from '../classes';
const ClassificationNode: React.FC<{id: string, selected:boolean, data: NodeData}> = ({data,selected,id}) => {
  

    useEffect(()=>{
        if (data.imgData != null){
            applyConnectedNodes(id, data, data.imgData);
        } else {
            data.setNodes(prev=>clearConnectedNodes(prev, id, data));
        }
    },[data.imgData]);
    const [model,setModel] = useState<tf.GraphModel | tf.LayersModel>();
    useEffect(()=>{
        (async ()=>{
            const model = await tf.loadGraphModel("https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_050_160/classification/3/default/1", { fromTFHub: true })
            console.log(model) 
            setModel(model);
 
        
        })();
    },[]);

    const handleApplyModel = async ()=>{
        if (model){
            if (data.imgData != null){
                const bitmap = await createImageBitmap(data.imgData);
                if (bitmap){
                    const tens = tf.browser.fromPixels(bitmap).toFloat().div(255).expandDims(0).resizeBilinear([160,160]);
                    console.log(await tens.max().data(), await tens.min().data());
                    const out = model.predict(tens) as tf.Tensor3D;                    
                    console.log("PREDICTED:",out.shape);
                    const {indices} =  out.squeeze([0]).topk(5);
                    for (let idx of await indices.data()){
                        console.log(classes[idx]);
                    }
                }
            }
        }
    }
    return (
        <CustomNode selected={selected} id={id} data={data} inputHandle>
            <div className='w-6 h-6 rounded-md bg-gray-800 drag-handle absolute top-4 right-4'></div>
            <button onClick={handleApplyModel}className='w-24 h-8 rounded-md border border-gray-500 text-white'>Apply</button>
        </CustomNode>
    )
}

export default ClassificationNode