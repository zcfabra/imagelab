import { type NextPage } from "next";
import { ReactFlow, Background, Controls, Node, applyNodeChanges, NodeChange, Edge, addEdge, Connection } from "reactflow";
import 'reactflow/dist/style.css';
import CustomNode from "../components/node";
import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import FileNode from "../components/filenode";
import NewNodeMenu, { nodeMap } from "../components/newnodemenu";
import HSLNode from "../components/hslnode";
import CropNode from "../components/cropnode";
import FilterNode from "../components/filternode";
import MLNode from "../components/mlnode";



const nodeTypes = {
  fileNode: FileNode,
  hslNode: HSLNode,
  cropNode: CropNode,
  filterNode: FilterNode,
  mlNode: MLNode
}

const Home: NextPage = () => {
  const proOptions = { hideAttribution: true };
  const [connectedNodes, setConnectedNodes] = useState<{ix: number, nullData: boolean}[]>([]);
  const imgRef = useRef<HTMLCanvasElement>(null);
  const [lastCreatedNode, setLastCreatedNode]= useState<number>(1);
  const [imageUtil, setImageUtil]= useState<HTMLImageElement>()
  const [photoData,setPhotoData] = useState<any>(null);
  const [newNodeMenu, setNewNodeMenu] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<number|null>(null);
  const selectedRef = useRef<number|null>(null);
  useEffect(()=>{
    selectedRef.current = selectedNode;
    console.log(selectedNode)
  }, [selectedNode]);
 

  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(()=>{

    setImageUtil(new Image())
    setNodes(prev=>[...prev, {
        id: "1",
        position: { x: 0, y: 0 },
        data: { label: "Input", setSelectedNode: setSelectedNode, setNodes: setNodes },
        type: "fileNode",
        deletable: false,
        draggable: false,      
    }])
  },[])
  
  useEffect(() => {
    const doTheThing = async (blob: Blob) => {
      console.log("BLOB:", blob)
      if (blob != null) {
        const bitmap = await createImageBitmap(blob);
        imgRef.current!.width = 1000;
        imgRef.current!.height = 900;
        const ctx = imgRef.current?.getContext("2d");
        if (ctx) {
          console.log("Actually drawing, bitmap", blob)
          ctx.clearRect(0, 0, 1000, 900)
          if (!connectedNodes[connectedNodes.length - 1]!.nullData){
            console.log("STATE OF NODES AT DRAW CALL", connectedNodes)
            ctx.drawImage(bitmap, 0, 0);


          }
          
        } else {
          console.log("failed to get context")
        }

      }

    }

    if (connectedNodes.length != 0){
      if (connectedNodes[connectedNodes.length-1]!.nullData == true){
        console.log("CLEAR");
        imgRef.current?.getContext("2d")?.clearRect(0, 0, imgRef.current.width, imgRef.current.height);
      } else if (connectedNodes[connectedNodes.length-1] && !connectedNodes[connectedNodes.length-1]!.nullData) {
        console.log(connectedNodes[connectedNodes.length-1], nodes[connectedNodes[connectedNodes.length-1]!.ix])
        let blob = nodes[connectedNodes[connectedNodes.length - 1]!.ix]!.data.outputData;
        doTheThing(blob);
      }



    
    } 
  }, [connectedNodes]);
  useEffect(()=>{
    console.log("NODES",nodes)
    const out = [];

    for (const [ix, node] of nodes.entries()){
      let nullData: boolean;
      if (nodes[0]!.data.outputData== null){
        nullData = true;
      } else {
        nullData = node.data.outputData == null;
      }
      console.log("YOP",node.data, nullData);
      if (node.data.parentNode || node.id=="1"){
        out.push({ix:ix, nullData:nullData})
      }
    }
    setConnectedNodes(out)
  },[nodes])


  const [edges, setEdges] = useState<Edge[]>([]);
  const onNodesChange = useCallback((changes: NodeChange[])=>{
    // console.log("Changes",changes);
    setNodes((prev)=>{
      return applyNodeChanges(changes, prev);
    })
  }, [setNodes])


  const handleSelectNewNode = (nodeType:string)=>{
    let newID = lastCreatedNode + 1;
    console.log("TYPE:",nodes[nodes.length-1]?.type)
    let lastNode = nodes[nodes.length-1];
    console.log("GG",lastNode);
    setNodes(prev => prev.concat({ id: String(newID), dragHandle: ".drag-handle", selectable: true, position: { x: prev[prev.length - 1]!.position.x, y: prev[prev.length - 1]!.position.y +( prev[prev.length - 1]!.type! == "cropNode" ?  450 : 200) }, data: {label: nodeType, setNodes:setNodes, imgData: null,setSelectedNode: setSelectedNode, imgRef: imgRef}, type: nodeMap[nodeType as keyof object]}))
    setLastCreatedNode(newID); 
  }
  const onConnect = useCallback(
    (connection: Connection) =>{
      setEdges((eds) => addEdge(connection, eds));
      setNodes(prev=>{
        const targetIdx = prev.findIndex(x=>x.id == connection.target);
        const sourceIdx = prev.findIndex(x=>x.id == connection.source);
        console.log("FIRED", sourceIdx, targetIdx)
        return prev.map((i,ix)=>{
          if (ix == targetIdx) {
           i.data = {
            ...i.data,
            imgData: prev[sourceIdx]!.data.outputData,
            parentNode: connection.source
           };
            
          } else if (ix == sourceIdx){
            i.data = {
              ...i.data,
              childNode: connection.target
            }
          }
          return i
        })
      })
    },
    [setEdges]
  );


  return (

    <>
    <main className="w-screen h-screen fixed bg-black">
      {newNodeMenu && <NewNodeMenu setNewNodeMenu={setNewNodeMenu} handleSelectNewNode={handleSelectNewNode}/>}
      <div className="relative w-9/12 h-full bg-black border border-gray-500">
        { nodes[0]?.data.outputData && <button className="z-20 hover:bg-gray-900 transition-all w-32 h-12 rounded-md text-white border border-gray-500 bg-black absolute right-2 top-2" onClick={()=>setNewNodeMenu(true)}>New +</button>}
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
        <div className="bg-black  border border-gray-500 z-20 w-96 h-72 overflow-y-auto absolute bottom-2 right-2">
          <canvas className="w-full " ref={imgRef}></canvas>
        </div>
      </div>
    </main>
    </>
  )  
};

export default Home;
