import React, { ReactNode, memo } from 'react'
import { Handle, Node, Position } from 'reactflow'
import { overrides } from '../../prettier.config.cjs'

export type NodeData={
  imgData: Blob | null,
  outputData: Blob | null,
  label: string,
  imgRef: React.RefObject<HTMLCanvasElement>,
  childNode?: string,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
}

export interface NodeProps{
    data:any,
    children:ReactNode,
    inputHandle?: boolean,
    id: string,
    selected: boolean,
    overrideStyles?: string
}
const CustomNode:React.FC<NodeProps> = ({data, children, inputHandle, id, selected, overrideStyles}) => {
    // console.log(data)
  return (
    <div onClick={()=>data.setSelectedNode(Number(id))} className={`w-52 h-32 p-4 bg-black rounded-xl ${selected ? "border-2" : "border"}  transition-all border-gray-500 flex flex-col ${overrideStyles && overrideStyles}`}>
        <span className='text-white'>{data.label}</span>
      <Handle className="!w-6 !h-4 !rounded-b-md !rounded-t-none !border-none !absolute !bottom-[-1rem] !bg-gray-800"  type="source" position={Position.Bottom}></Handle>
        {inputHandle ==true && <Handle className='!w-6 !rounded-none !border-none !h-4 !bg-gray-800 !rounded-t-md !top-[-1rem]' type="target" position={Position.Top}></Handle>}
        {children}
    </div>
  )
}

export default memo(CustomNode) ;