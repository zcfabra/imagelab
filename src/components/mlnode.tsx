import React, { useEffect, useRef, useState } from 'react'
import CustomNode, { NodeData } from "./node"
import * as tf from "@tensorflow/tfjs"
import { applyConnectedNodes, clearConnectedNodes } from '../utils/connected';
// const modelURL = 'https://tfhub.dev/rishit-dagli/tfjs-model/mirnet-tfjs/default/no-comp/1'
const modelURL = "http://localhost:3000/esr/model.json"

const MLNode:React.FC<{data: NodeData, id:string, selected: boolean}> = ({ data, id, selected}) => {
    const [model, setModel] = useState<tf.GraphModel | tf.LayersModel>();
    const localHiddenCanvasRef = useRef<HTMLCanvasElement>(null);
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
            console.log("ESR CLEARED")
            data.setNodes(prev=>clearConnectedNodes(prev, id, data));

        } else {
            applyConnectedNodes(id, data, data.imgData);
        }
    },[data.imgData])
    
    const handleApplyModel = async ()=>{
        if (data.imgData !=null){
            console.log("CALLED MODEL ESR")
            const bitmap = await createImageBitmap(data.imgData);
            // let input = tf.browser.fromPixels(bitmap).div(tf.scalar(255)).toFloat();
            let input = tf.browser.fromPixels(bitmap).toFloat();

            // console.log(data.imgData.size, input.shape)
            input = tf.expandDims(input, 0);
            if (model){
                const out: tf.Tensor<tf.Rank> = model.predict(input) as tf.Tensor<tf.Rank>;
                console.log("OUT", out);

                localHiddenCanvasRef.current!.width= out.shape[1]!;
                localHiddenCanvasRef.current!.height = out.shape[2]!;
                const reshaped: tf.Tensor<tf.Rank.R3> = out.squeeze([0]);
                // console.log(await reshaped.min().data(),await reshaped.max().data());

                const norm = reshaped.sub(reshaped.min()).div(reshaped.max().sub(reshaped.min()));
                await tf.browser.toPixels(norm as tf.Tensor<tf.Rank.R3>, localHiddenCanvasRef.current!);
                norm.dispose();
                input.dispose();

                bitmap.close();
                localHiddenCanvasRef.current!.toBlob(blob=>{
                    if (blob){
                        console.log("BLOB ADDED ")
                        applyConnectedNodes(id, data, blob);
                    }
                })



            }
        }
    }
    return (
    <CustomNode data={data} id={id} inputHandle selected={selected}>
       { data.imgData != null && <button className="mt-auto text-white w-24 h-8 rounded-md border hover:bg-gray-900 transition-all border-gray-500 "onClick={()=>handleApplyModel()}>Apply</button> }
       <canvas hidden ref={localHiddenCanvasRef}></canvas>
        <div className='absolute top-4 right-4 w-6 h-6 ml-4 bg-gray-800 rounded-md drag-handle'></div>
    </CustomNode>
  )
}

export default MLNode