"use client"

import * as z from 'zod'; // zod es una libreria para validar datos
import axios from 'axios'; //axios es una libreria para hacer peticiones http
import { zodResolver } from '@hookform/resolvers/zod'; //hookform es una libreria para manejar formularios
import { useForm } from 'react-hook-form'; //hookform es una libreria para manejar formularios
import { useRouter } from 'next/navigation'; //next/navigation es una libreria para manejar rutas

import MuxPlayer from '@mux/mux-player-react'; //mux-react-player es una libreria para reproducir videos

import { Button } from '@/components/ui/button';

import  toast  from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle, Video } from 'lucide-react';
import { useState } from 'react';

import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';



interface ChapterVideoFormProps {
    initialData: any;
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
});

export const ChapterVideoForm = ({initialData, courseId, chapterId}:ChapterVideoFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing(!isEditing);
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
        //PATCH se utiliza para actualizar parcialmente un recurso.
        //En una solicitud PATCH, solo se envían los campos que se desean modificar, no es necesario enviar el recurso completo.
        toast.success("Chapter updated");
        toggleEdit();
        router.refresh();
      } catch (error) {
            toast.error("Something went wrong. Please try again.");
      }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a video
                        </>       
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit video
                        </>
                    )}
                   
                </Button>
            </div>
            {!isEditing && (
              !initialData.videoUrl ? (
                <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                    <Video className='h-10 w-10 text-slate-500' />
                </div>
              ) : (
                <div className='relative aspect-video mt-2'>
                    {/* Aqui se muestra la imagen que se carga */}
                    Video uploaded!!!
                    <MuxPlayer
                        playbackId={initialData?.muxData?.playbackId || ""} //playbackId es el id del video que se carga      
                    />
                    {/* Esto tambien sirve pero Mux es mejor */}
                    {/* <video controls width="640" height="360">
                        <source src={initialData.videoUrl} type="video/mp4"></source>
                    </video> */}
                </div>
              )
            )}
            {isEditing && (
               <div>
                    <FileUpload
                        endpoint='chapterVideo'
                        onChange={(url) => {
                            if(url) {
                                onSubmit({videoUrl: url}); //onSubmit recibe el parametro ,luego se actualiza el curso con la nueva imagen en la base de datos mysql
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        Upload this chapter's video. We support MP4, MOV, AVI, and other common video formats.
                    </div>
               </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className='text-xs text-muted-foreground mt-2 '>
                    Videos can take a few minutes to process.
                </div>
            )}
        </div>
    )
}