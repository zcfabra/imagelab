import React, { ReactNode, memo } from 'react'
import { Handle, Position } from 'reactflow'
interface NodeProps{
    data:any,
    children:ReactNode,
    inputHandle?: boolean,
    id: string,
    selected: boolean,
}
const CustomNode:React.FC<NodeProps> = ({data, children, inputHandle, id, selected}) => {
    // console.log(data)
  return (
    <div onClick={()=>data.setSelectedNode(Number(id))} className={`w-52 h-32 p-4 bg-black rounded-xl ${selected ? "border-2" : "border"}  transition-all border-gray-500 flex flex-col`}>
        <span className='text-white'>{data.label}</span>
        <Handle type="source" position={Position.Bottom}></Handle>
        {inputHandle ==true && <Handle type="target" position={Position.Top}></Handle>}
        {children}
    </div>
  )
}

export default memo(CustomNode) ;