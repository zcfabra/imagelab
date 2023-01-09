import { Node } from "reactflow";
import { NodeData } from "../components/node";

export function clearConnectedNodes(prev: Node[], id:string, data:NodeData){
    const idx = prev.findIndex(x => x.id == id)
    prev[idx]!.data = {
        ...prev[idx]!.data,
        outputData: null
    }
    if (data.childNode !=null) {
        const childIdx = prev.findIndex(x => x.id == data.childNode);
        if (prev[childIdx] !=null && prev[childIdx] !=undefined){
            prev[childIdx]!.data = {
                ...prev[childIdx]!.data,
                imgData: null
            }
        }
    }
    return [...prev];
};

export function applyConnectedNodes(id:string, data:NodeData, blob: Blob){
    data.setNodes(prev => {
        const idx = prev.findIndex(x => x.id == id);
        prev[idx]!.data = {
            ...prev[idx]!.data,
            outputData: blob
        };
        if (data.childNode !=null) {
            const targetIdx = prev.findIndex((x) => x.id == data.childNode);
            if (prev[targetIdx]!=null && prev[targetIdx]!=undefined) {
                prev[targetIdx]!.data = {
                    ...prev[targetIdx]!.data,
                    imgData: blob
                }
            }
        }
        return [...prev];
    })
}