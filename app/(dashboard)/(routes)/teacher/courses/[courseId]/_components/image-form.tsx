"use client"

import * as z from 'zod'; // zod es una libreria para validar datos
import axios from 'axios'; //axios es una libreria para hacer peticiones http
import { zodResolver } from '@hookform/resolvers/zod'; //hookform es una libreria para manejar formularios
import { useForm } from 'react-hook-form'; //hookform es una libreria para manejar formularios
import { useRouter } from 'next/navigation'; //next/navigation es una libreria para manejar rutas


import { Button } from '@/components/ui/button';

import  toast  from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';

import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';



interface ImageFormProps {
    initialData: any;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1,{message: 'Image is required'})
});

export const ImageForm = ({initialData, courseId}:ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing(!isEditing);
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.patch(`/api/courses/${courseId}`, values);
        //PATCH se utiliza para actualizar parcialmente un recurso.
        //En una solicitud PATCH, solo se envían los campos que se desean modificar, no es necesario enviar el recurso completo.
        toast.success("Course title updated");
        toggleEdit();
        router.refresh();
      } catch (error) {
            toast.error("Something went wrong. Please try again.");
      }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add an image
                        </>       
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit image
                        </>
                    )}
                   
                </Button>
            </div>
            {!isEditing && (
              !initialData.imageUrl ? (
                <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                    <ImageIcon className='h-10 w-10 text-slate-500' />
                </div>
              ) : (
                <div className='relative aspect-video mt-2'>
                    {/* Aqui se muestra la imagen que se carga */}
                    <Image
                        src={initialData.imageUrl}
                        alt="Course image"
                        layout="fill"
                        objectFit="cover"
                        className='object-cover rounded-md'
                    />
                </div>
              )
            )}
            {isEditing && (
               <div>
                <FileUpload
                    endpoint='courseImage'
                    onChange={(url) => {
                        if(url) {
                            onSubmit({imageUrl: url}); //onSubmit recibe el parametro ,luego se actualiza el curso con la nueva imagen en la base de datos mysql
                        }
                    }}
                />
                <div className='text-xs text-muted-foreground mt-4'>
                    16:9 aspect ratio recommended for best results
                </div>
                
               </div>
            )}
        </div>
    )
}