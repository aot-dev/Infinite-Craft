import React, { useRef, useState } from 'react';
import { XYCoord, useDrop } from 'react-dnd'
import './App.css';
import { getResult, initData } from './consts';
import Element, { BoxProps } from './Element';
import Instance from './Instance';
import clear from './assets/clear.svg';
import mute from  './assets/mute.svg';
import sound from './assets/sound.svg';
import d88 from './assets/d88.png';

import {BrowserView, MobileView} from 'react-device-detect';
export interface DragItem {
	type?: string
	id: number
	top: number
	left: number
  result:string
  emoji:string
  isSelected?:boolean

}
function App() {
  const [boxes, setBoxes] = useState<DragItem[]>(initData);
  const [instances, setInstances] = useState<BoxProps[]>([]);
  const [searchValue,setSearchValue] = useState('');
  const [selectedInstances, setSelectedInstances]= useState<DragItem[]>([]);
  const [isSound, setSound]= useState(true);
  const idRef = useRef(1);
	const [, drop] = useDrop(
		() => ({
			accept: 'item',
			drop(item: DragItem, monitor) {
				const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const xyData = monitor.getSourceClientOffset() as XYCoord
				const left = Math.round(item.left + delta.x)
				const top = Math.round(item.top + delta.y)

        if(item.type === 'item') {
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
    if(type === 'item'){
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
    const result = getResult(elem1,elem2);
    const isNew = boxes.findIndex((elem)=> elem.result === result[0]) > -1;
   
    let  newBox:BoxProps
    // fetch(url)
    // .then(response => response.json())
    // .then(json => console.log(json))
    // .catch(error => console.error(error));
    if(isNew){
        console.log('found new item');
        newBox= {id:boxes.length+1,result:result[0], emoji:result[1], left:0, top:0}
        setBoxes([...boxes,newBox]);
    } 
    return {id:idRef.current++,result:result[0], emoji:result[1], left:clientX, top:clientY};
  }

  const handleSearch = (e:string)=>{
    setSearchValue(e);
  }
  const resetData = ()=>{
    if (window.confirm("Are you sure? This will delete all your progress!")) {
      clearInstances();
      setBoxes(initData);
    };
   
  }
  const clearInstances = ()=>{
    setInstances([]);
  }
  //for mobile view
  const handleClick = (elem:DragItem)=>{
    if(selectedInstances.length) {
      const newItem = getItem(elem.id, elem.result, selectedInstances[0].result, 0,0 );
      if(newItem) {
        setSelectedInstances([]);
      }
      boxes.map((box)=>box.isSelected=false);
    } else {
      elem.isSelected=true;
      console.log(elem);
      console.log(boxes);
      setSelectedInstances([elem]);
    }
  }

  const handleboxes = (elem:DragItem)=>{
    const newElem = {id:idRef.current++,left:500, top:500, result:elem.result, emoji:elem.emoji};
    setInstances([...instances,newElem]);
  }
  return (
     <div  ref={drop} className='container'>
    <img  src={d88} alt='digit88' className="site-title"></img>
    <BrowserView>
          {
            instances.map((item)=> <Instance key={item.id} result={item.result} emoji={item.emoji} id={item.id} top={item.top} left={item.left} type='instance'></Instance>)
          }
        <div className='sidebar'>
          <div className='items'>
          {
            boxes.filter((elem)=> elem.result.includes(searchValue)).map((item)=> <Element key={item.id} result={item.result} emoji={item.emoji} id={item.id} top={item.top} left={item.left} handleClick={()=>handleboxes(item)} type='item'></Element>)
          }
          </div>
          <div className='sidebar-controls'>
            <div className='sidebar-search'>
            <input onChange={(e)=>handleSearch(e.target.value)} placeholder='Search items...' className='sidebar-input'/>
            </div>
                
            </div>
          
        </div>
        <div className='side-controls'>
        <img alt='Clear' src={clear} className="clear" onClick={()=>clearInstances()}/>
        {isSound && <img src={sound} alt='Sound' className="sound" onClick={()=> setSound(false)} />
          }{
          !isSound && <img src={mute} alt='Sound' className="sound" onClick={()=> setSound(true)}/>
          }
        </div>
        </BrowserView>
        <MobileView>
        <div className='container'>
          <div className='items' style={{top:'45px'}}>
          {
            boxes.filter((elem)=> elem.result.includes(searchValue)).map((item)=> <Element key={item.id} result={item.result} emoji={item.emoji} id={item.id} top={item.top} left={item.left} isSelected={item.isSelected} handleClick={()=>handleClick(item)} type='item'></Element>)
          }
          </div>
          <div className='sound-box'>
          {isSound && <img src={sound} alt='Sound' className="mobile-sound" onClick={()=> setSound(false)} />
          }{
          !isSound && <img src={mute} alt='Sound' className="mobile-sound" onClick={()=> setSound(true)}/>
          }
          </div>
          
        </div>
        </MobileView>
        <div className="reset" onClick={resetData}>Reset</div>
       
      </div>
  );
}

export default App;
