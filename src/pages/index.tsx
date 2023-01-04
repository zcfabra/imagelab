import { type NextPage } from "next";
import { ReactFlow, Background, Controls, Node, applyNodeChanges, NodeChange, Edge, addEdge, Connection } from "reactflow";
import 'reactflow/dist/style.css';
import CustomNode from "../components/node";
import React, { useCallback, useEffect, useRef, useState } from "react";
import FileNode from "../components/filenode";
import NewNodeMenu from "../components/newnodemenu";
import HSVNode from "../components/hsvnode";



const nodeTypes = {
  fileNode: FileNode,
  hsvNode: HSVNode,
}

const Home: NextPage = () => {
  const proOptions = { hideAttribution: true };
  const imgRef = useRef<HTMLCanvasElement>(null);


  const [photoData,setPhotoData] = useState<any>(null);
  const [newNodeMenu, setNewNodeMenu] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<number|null>(null);
  const selectedRef = useRef<number|null>(null);
  useEffect(()=>{
    selectedRef.current = selectedNode;
    console.log(selectedNode)
  }, [selectedNode])

  useEffect(()=>{

    // window.addEventListener("keydown", (e)=>{
    //   if (e.key == "Backspace" || e.key == "Delete"){
    //     if (selectedRef.current !=null && selectedRef.current != 1){
    //       console.log("SELECTED:",selectedRef.current)
    //       setNodes(prev=>prev.filter((i,ix)=>ix!=selectedRef.current));
    //     } else {
    //       console.log("SHOULDNT DELETE")
    //     }
    //   }
    // })
  },[])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    if (e.target.files && e.target.files?.length > 0) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
          console.log(reader.result);
          const img = new Image();
          img.src = reader.result! as string;
          img.onload = () => {
            console.log(img.width, img.height);
            imgRef.current!.width = img.width;
            imgRef.current!.height = img.height;
            imgRef.current?.getContext("2d")?.drawImage(img, 0, 0);
          }
        }
      }



    }
  }

  const [nodes, setNodes] = useState<Node[]>([{
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Input", handleFileUpload: handleFileUpload, setSelectedNode },
    type: "fileNode",
    deletable: false,
    draggable: false,

  }]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const onNodesChange = useCallback((changes: NodeChange[])=>{
    // console.log("Changes",changes);
    setNodes((prev)=>{
      return applyNodeChanges(changes, prev);
    })
  }, [setNodes])


  const handleSelectNewNode = (nodeType:string)=>{
    setNodes(prev=>prev.concat({id: String(Number(prev[prev.length-1]!.id)+1), dragHandle: ".drag-handle", selectable:true, position:{x: 0, y: 50}, data: {label: nodeType, setSelectedNode: setSelectedNode, imgRef: imgRef}, type: "hsvNode"}))
  }
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );


  return (

    <>
    <main className="w-screen h-screen fixed bg-black">
      {newNodeMenu && <NewNodeMenu setNewNodeMenu={setNewNodeMenu} handleSelectNewNode={handleSelectNewNode}/>}
      <div className="relative w-9/12 h-full bg-black border border-gray-500">
        <button className="z-20 hover:bg-gray-900 transition-all w-32 h-12 rounded-md text-white border border-gray-500 bg-black absolute right-2 top-2" onClick={()=>setNewNodeMenu(true)}>New +</button>
        <ReactFlow
            proOptions={proOptions}
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            onConnect={onConnect}

>
          <Background />
          <Controls className="absolute bottom-0 left-0" />
        </ReactFlow>
        <div className=" resize-y bg-black  border border-gray-500 z-20 w-96 h-72 overflow-y-auto absolute bottom-2 right-2">
          <canvas className="w-full " ref={imgRef}></canvas>
        </div>
      </div>
    </main>
    </>
  )  
};

export default Home;
