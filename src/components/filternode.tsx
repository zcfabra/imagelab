import React, { useEffect } from 'react'
import CustomNode, { NodeData } from "./node"

const filters: FilterType[] = [{
    name: "B+W",
    deploy:{
        attribute: "saturation",
        value: 10,
    } 
},
{
    name: "Sepia",
    deploy:{
        attribute: "tone",
        value:10
    }
}
];

type FilterType={
    name: string,
    deploy: {attribute:string,value:number}
}

const FilterNode:React.FC<{data:NodeData, id:string, selected:boolean}> = ({data,id,selected}) => {
    useEffect(()=>{},[data.imgData])
  return (
    <CustomNode data={data}id={id} selected={selected} inputHandle >
        <div className='w-6 h-6 rounded-md drag-handle bg-gray-800 absolute top-4 right-4'></div>
        <select className='bg-black border border-gray-500 text-gray-300 rounded-md mt-4' name="" id="">
            {filters.map((i,ix)=>{
                return (
                    <option key={ix} value={i.name}>{i.name}</option>
                )
            })}
        </select>
    </CustomNode>
  
    )
}

export default FilterNode