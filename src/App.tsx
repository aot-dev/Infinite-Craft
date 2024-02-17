import React, { useRef, useState } from 'react';
import { XYCoord, useDrop } from 'react-dnd'
import './App.css';
import { initData } from './consts';
import Element, { BoxProps } from './Element';
import Instance from './Instance';
export interface DragItem {
	type: string
	id: number
	top: number
	left: number
  result:string
  emoji:string

}
function App() {
  const [boxes, setBoxes] = useState<BoxProps[]>(initData);
  const [instances, setInstances] = useState<BoxProps[]>([]);
  const [searchValue,setSearchValue] = useState('');
  const idRef = useRef(1);
	const [, drop] = useDrop(
		() => ({
			accept: 'item',
			drop(item: DragItem, monitor) {
				const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const xyData = monitor.getSourceClientOffset() as XYCoord
				const left = Math.round(item.left + delta.x)
				const top = Math.round(item.top + delta.y)

        if(item.type == 'item') {
          const elem = {id:idRef.current++,left:xyData.x, top:xyData.y, result:item.result, emoji:item.emoji};
          handleDropNode(elem, 'item');
        } else {
          const elem = {id:item.id,left:left, top:top, result:item.result, emoji:item.emoji}
          handleDropNode(elem, 'instance');
        }
        
				return undefined
			},
		}),
		[instances],
	);
  const handleDropNode = (elem:BoxProps,type:string)=>{
    const nearNode = instances.find((item:any)=> {
      const diffY = item.top -elem.top ;
      const difX = item.left -elem.left;
      
     return diffY < 40 && diffY > -40 && difX < 70 && difX > -70;
    });
  
  if(nearNode?.result) {
      const newList = instances.filter((item:any) => nearNode.id !== item.id && elem.id !== item.id);
      const newItem = getItem(idRef.current++, nearNode.result, elem.result,elem.left,elem.top);
      setInstances([...newList,newItem]);
  } else {
    if(type == 'item'){
      setInstances([...instances,elem]);
    } else {
      const newInstances = instances.filter((ins)=> ins.id !== elem.id);
      setInstances([...newInstances, elem]);
    }
  }
  }
  const getItem = (id:number, elem1:string, elem2:string, clientX:number,clientY:number )=>{
    const url = `https://neal.fun/api/infinite-craft/pair?first=${elem1}&second=${elem2}`;
    console.log(url);
    const data:{result:string, emoji:string,isNew:boolean}= {result:"Treasure",emoji:"💎",isNew:true};
    let  newBox:BoxProps
    // fetch(url)
    // .then(response => response.json())
    // .then(json => console.log(json))
    // .catch(error => console.error(error));
    if(data.isNew){
        console.log('found new item');
        newBox= {id:id,result:'new Thing', emoji:'🔥', left:0, top:0}
        setBoxes([...boxes,newBox]);
    } 
    return {id:idRef.current++,result:'New Thing', emoji:'🔥', left:clientX, top:clientY};
  }

  const handleSearch = (e:string)=>{
    
    setSearchValue(e);
}
  return (
     <div  ref={drop} className='container'>
          {
            instances.map((item)=> <Instance key={item.id} result={item.result} emoji={item.emoji} id={item.id} top={item.top} left={item.left} type='instance'></Instance>)
          }
        <div className='sidebar'>
          <div className='items'>
          {
            boxes.map((item)=> <Element key={item.id} result={item.result} emoji={item.emoji} id={item.id} top={item.top} left={item.left} type='item'></Element>)
          }
          </div>
          <div className='sidebar-controls'>
                <input onChange={(e)=>handleSearch(e.target.value)} placeholder='Search items...' className='sidebar-input'/>
            </div>
          
        </div>
        <div className="reset">Reset</div>
      </div>
  );
}

export default App;
