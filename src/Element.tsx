import React from 'react';
import { useDrag } from 'react-dnd';

export interface BoxProps {
	id: number
	left: number
	top: number
	emoji:string
    result:string
    type?:string
}
const Element:React.FC<BoxProps> = ({result,emoji,id,top,left,type}) => {
    
    const [{ isDragging }, drag] = useDrag(
		() => ({
			type: 'item',
			item: { id, left, top,result,emoji,type },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[id, left, top],
	)

	if (isDragging && false) {
		return <div ref={drag} />
	}
	return (
		<span
			className="item"
			ref={drag}
			data-testid="box"
		>
			{emoji} {result}
		</span>
	)
}
export default Element;