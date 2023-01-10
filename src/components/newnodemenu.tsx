import React from 'react'
export const nodeMap = {
    "HSL": "hslNode",
    "Crop": "cropNode",
    "Filter": "filterNode",
    "Enhance": "mlNode",
    "BG Removal": "bgNode",
    "Classification": "classificationNode",
}
const NewNodeMenu = ({setNewNodeMenu, handleSelectNewNode}:any) => {
    const nodeTypes = [
        {name: "HSL"},
        {name: "Crop"},
        {name: "Filter"},
        {name: "Enhance"},
        {name: "BG Removal"},
        {name: "Classification"}
    ]
  return (
    <div  className='absolute z-30 w-full h-full flex flex-col items-center justify-center bg-[rgba(0,0,0,0.5)] '>
        <div className='relative w-8/12 h-5/6 bg-black rounded-xl border border-gray-500 flex flex-row overflow-hidden'>
            <button onClick={()=>setNewNodeMenu(false)}className='absolute top-2 right-4 text-white text-3xl'>X</button>
            <div className='w-2/12 h-full bg-gray-900'></div>
            <div className='w-10/12 p-8 h-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto'>
                {nodeTypes.map((i,ix)=>(
                    <div key={ix} onClick={()=>{handleSelectNewNode(i.name); setNewNodeMenu(false)}} className='rounded-md h-48 shrink-0 bg-gblack hover:bg-gray-900 transition-all cursor-pointer border border-gray-500 p-4'>
                        <span className='text-white text-xl'>{i.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default NewNodeMenu