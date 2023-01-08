import React, { useEffect, useState } from 'react'
import CustomNode, { NodeData } from "./node"
import * as tf from "@tensorflow/tfjs"
import { applyConnectedNodes, clearConnectedNodes } from '../utils/connected';
// const modelURL = 'https://tfhub.dev/rishit-dagli/tfjs-model/mirnet-tfjs/default/no-comp/1'
const modelURL = "http://localhost:3000/esr/model.json"

const MLNode:React.FC<{data: NodeData, id:string, selected: boolean}> = ({ data, id, selected}) => {
    const [model, setModel] = useState<tf.GraphModel | tf.LayersModel>();
    useEffect(()=>{
        (async ()=>{
            const model = await tf.loadGraphModel(modelURL, { fromTFHub: false, requestInit: {
                method: "GET",
                headers:{
                    
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                }
            }});
            console.log("MODEL", model);
            setModel(model);
        })()
    },[]);

    useEffect(()=>{
        if (data.imgData == null){
            data.setNodes(prev=>clearConnectedNodes(prev, id, data));

        } else {
            applyConnectedNodes(id, data, data.imgData);
        }
    },[data.imgData])
    
    const handleApplyModel = async ()=>{
        if (data.imgData !=null){
            const bitmap = await createImageBitmap(data.imgData);
            let input = tf.browser.fromPixels(bitmap).div(tf.scalar(255)).toFloat();
            console.log(data.imgData.size, input.shape)
            input = tf.expandDims(input, 0);
            if (model){
                const out = model.predict(input);
                console.log("OUT", out)

            }
        }
    }
    return (
    <CustomNode data={data} id={id} inputHandle selected={selected}>
       <button className="text-white"onClick={()=>handleApplyModel()}>YAYA</button> 

        <div className='absolute top-4 right-4 w-6 h-6 ml-4 bg-gray-800 rounded-md drag-handle'></div>
    </CustomNode>
  )
}

export default MLNode