"use client"

import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult
} from "@hello-pangea/dnd"

import {cn} from '@/lib/utils';
import { Grid, Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

 // con use client se puede hacer peticiones http desde el cliente

interface ChapterListProps {
    items: Chapter[]; // items es un array de objetos
    onReorder: (updateData: {id: string; position: number}[]) => void;
    onEdit: (id: string) => void;
}

export const ChapterList = ({ items, onReorder, onEdit  }:ChapterListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    //Esto solo se ejecuta en client side rendering, para que no haiga problemans de hydratation con nextjs
    useEffect(() => {
        setIsMounted(true);
    },[]);

    useEffect(() => {
        setChapters(items);
    },[items]);

    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return; // result.destination es el lugar donde se solto el item

        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1); //splice elimina un elemento de un array y lo devuelve
        items.splice(result.destination.index, 0, reorderedItem);

        setChapters(items); //hasta aqui funciona bien, el resto es para hacer la peticion http
        //////////////////////////////////////
        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex + 1);
       
        const bulkUpdateData = updatedChapters.map((chapter, index) => ({
            id: chapter.id,
            position: startIndex + index
        }));
        onReorder(bulkUpdateData);
    }
    
    if(!isMounted) return null; //solo en el cliente

    return (
       <DragDropContext onDragEnd={onDragEnd}>
        {/* direction="horizontal" */}
            <Droppable droppableId="chapters" > 
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="h-[150px] overflow-y-auto">
                        {chapters.map((chapter, index) => (
                            <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                {(provided, snapshot) => (
                                    <div className={cn("flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-full mb-4 text-sm", chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700",snapshot.isDragging && "bg-blue-200 shadow-md", snapshot.isDropAnimating && "bg-green-400")}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div className={cn("px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition ml-6", chapter.isPublished && "border-r-sky-200 hover:bg-sky-200")}
                                            {...provided.dragHandleProps}
                                        >
                                          <Grip className="h-5 w-5"/>
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {chapter.isFree && (
                                                <Badge >Free</Badge>
                                            )}
                                            <Badge className={cn("bg-slate-500",chapter.isPublished && "bg-sky-700")}>
                                                {chapter.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil className="h-4 w-4 cursor-pointer hover:opacity-75 transition" onClick={() => onEdit(chapter.id)}/>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                      
                        {provided.placeholder}
                    </div>
                )}

            </Droppable>
       </DragDropContext>
    )
} // este componente es una lista de capitulos de un curso

