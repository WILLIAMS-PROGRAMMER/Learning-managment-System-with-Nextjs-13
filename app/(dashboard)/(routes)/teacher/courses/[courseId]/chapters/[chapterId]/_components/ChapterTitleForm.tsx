"use client"

import * as z from 'zod'; // zod es una libreria para validar datos
import axios from 'axios'; //axios es una libreria para hacer peticiones http
import { useForm } from 'react-hook-form'; //hookform es una libreria para manejar formularios
import { useRouter } from 'next/navigation'; //next/navigation es una libreria para manejar rutas


import { Button } from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import Link from 'next/link';
import  toast  from 'react-hot-toast';
import { Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';


interface ChapterTitleFormProps {
    initialData: any;
    courseId: string;
    chapterId: string;
}


export const ChapterTitleForm = ({initialData, courseId, chapterId}:ChapterTitleFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(initialData.title);
    const [error,setError] = useState('');

    const toggleEdit = () => setIsEditing(!isEditing);
    const router = useRouter();

    const [isSubmiting, setIsSubmiting] = useState(false);

    const maxLength = 15;
    const [numberOfCharacters, setNumberOfCharacters] = useState(0);

    const handleInputChange = (e:any) => {
        setError('');
        const inputValue = e.target.value;
        //El usuario maximo puede escribir 15 caracteres
        if (inputValue.length <= maxLength) {
            // Actualizar el valor en el formulario
            setInputValue(inputValue);
            setNumberOfCharacters(inputValue.length);
        } 
        console.log(inputValue.length);
    };


    const onSubmit = async (inputValue: string, e:any) => {
        e.preventDefault();

        if (inputValue.length == 1) {
            setError('1 character is not permitted, please enter a valid title');
            return;
        }

      try {
        setIsSubmiting(true);
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {title:inputValue});
        //PATCH se utiliza para actualizar parcialmente un recurso.
        //En una solicitud PATCH, solo se envían los campos que se desean modificar, no es necesario enviar el recurso completo.
        toast.success("Chapter updated");
        toggleEdit();
        router.refresh();
      } catch (error) {
            toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmiting(false);
      }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit title
                        </>
                    )}
                   
                </Button>
            </div>
            {!isEditing && (
                <p className='text-sm mt-2'>
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                    <form onSubmit={(e) => {onSubmit(inputValue,e)}} className='space-y-4 mt-4'>
                      
                        <Input value={inputValue} onChange={(e) => { handleInputChange(e)}}  placeholder='e.g. Introduction to python'/>
                               
                        <p className={cn("text-green-600 text-xs", numberOfCharacters == 15 &&( "text-red-600"))}>{numberOfCharacters}/{maxLength} characters</p>
                        <p className='text-xs'>{numberOfCharacters == 15 ? ("You have reached the max number of characters permitted, please read the docs for more details"): ("")}</p>

                        <div className='flex items-center gap-x-2'>
                            <Button type='submit' disabled={numberOfCharacters === 0 || isSubmiting}>Save</Button>
                            {isSubmiting && (
                                <p className='text-xs text-slate-500 flex fex-row gap-1 justify-center text-center items-center'>
                                    <Loader2 className=' animate-spin'/>
                                    Saving...
                                </p>
                            
                            )}
                        </div>
                        <p>{error}</p>
                    </form>
                    
            )}
        </div>
    )
}