"use client"

//You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.
//Learn more: https://nextjs.org/docs/getting-started/react-essentials


import * as z from 'zod'; // zod es una libreria para validar datos
import axios from 'axios'; //axios es una libreria para hacer peticiones http
import { zodResolver } from '@hookform/resolvers/zod'; //hookform es una libreria para manejar formularios
import { useForm } from 'react-hook-form'; //hookform es una libreria para manejar formularios
import { useRouter } from 'next/navigation'; //next/navigation es una libreria para manejar rutas


import { Button } from '@/components/ui/button';

import  toast  from 'react-hot-toast';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"


interface AttachmentFormProps {
    initialData: any;
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1,{message: 'Attachment is required'})
});

export const AttachmentForm = ({initialData, courseId}:AttachmentFormProps) => {
    //yes es solo por un error de next hydrate, no afecta en nada, tiene que ver con client y sever side rendering
    const [yes, setYes] = useState<any>(null); //useState es un hook que permite agregar estado a un componente funcional
    const [isEditing, setIsEditing] = useState<boolean | null>(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    useEffect(() => {
       setYes(true);
    });

    const toggleEdit = () => setIsEditing(!isEditing);
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.post(`/api/courses/${courseId}/attachments`, values); //axios.post es para hacer una peticion http de tipo post
        //PATCH se utiliza para actualizar parcialmente un recurso.
        //En una solicitud PATCH, solo se envían los campos que se desean modificar, no es necesario enviar el recurso completo.
        toast.success("Course updated");
        toggleEdit();
        router.refresh();
      } catch (error) {
            toast.error("Something went wrong. Please try again.");
      }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            setDeletingId(null);
        }finally { //finallly se ejecuta siempre, sin importar si hay un error o no
            setDeletingId(null);
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a file
                        </>       
                    )}
                    
                   
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className='text-sm mt-2 text-slate-500 italic'>No attachments yet</p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className='space-y-2'>
                            {initialData.attachments.map((attachment:any) => (
                                <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'>
                                    <File className='h-4 w-4 mr-2 flex-shrink-0'/>
                                    <p className='text-xs line-clamp-1'>{attachment.name}</p>
                                    {deletingId === attachment.id && (
                                        <div className='ml-auto'>
                                            <Loader2 className='h-4 w-4 animate-spin'/>
                                        </div>
                                    )}
                                     {deletingId !== attachment.id && (
                                        
                                        <button className='ml-auto hover:opacity-75 transition'>
                                            { yes &&
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <X className='h-4 w-4 animate-bounce'/>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your account
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => onDelete(attachment.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>  }
                                        </button>
                                    )}     
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
               <div>
                <FileUpload
                    endpoint='courseAttachment'
                    onChange={(url) => {
                        if(url) {
                            onSubmit({url: url}); //onSubmit recibe el parametro ,luego se actualiza el curso con la nueva imagen en la base de datos mysql
                        }
                    }}
                />
                <div className='text-xs text-muted-foreground mt-4'>
                    Add a file to your course. You can add PDFs, images, videos, and more.
                    <br />
                    You can add anything that will help your students learn.
                </div>
                
               </div>
            )}
        </div>
    )
}