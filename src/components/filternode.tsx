import React from 'react'
import CustomNode from "./node"

const FilterNode:React.FC<any> = ({data,id,selected}) => {
  return (
    <CustomNode data={data}id={id} selected={selected} >
        <button className='w-32 h-12 rounded-md bg-gray-800'></button>
    </CustomNode>
  
    )
}

export default FilterNode