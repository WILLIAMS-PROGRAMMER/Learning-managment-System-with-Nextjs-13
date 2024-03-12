"use client"

import * as z from 'zod'; // zod es una libreria para validar datos
import axios from 'axios'; //axios es una libreria para hacer peticiones http
import { zodResolver } from '@hookform/resolvers/zod'; //hookform es una libreria para manejar formularios
import { useForm } from 'react-hook-form'; //hookform es una libreria para manejar formularios
import { useRouter } from 'next/navigation'; //next/navigation es una libreria para manejar rutas

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import Link from 'next/link';
import  toast  from 'react-hot-toast';
import {  Loader2, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ChapterList } from './ChapterList';



interface ChaptersFormProps {
    initialData: any;
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1,{message: 'title is required'})
});

export const ChaptersForm = ({initialData, courseId}:ChaptersFormProps) => {

    const [isCreaiting, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => setIsCreating(!isCreaiting);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.post(`/api/courses/${courseId}/chapters`, values);
        //PATCH se utiliza para actualizar parcialmente un recurso.
        //En una solicitud PATCH, solo se envían los campos que se desean modificar, no es necesario enviar el recurso completo.
        toast.success("Course chapter created successfully");
        toggleCreating();
        router.refresh();
      } catch (error) {
            toast.error("Something went wrong. Please try again.");
      }
    }

    const onReorder = async (updateData: {id: string; position: number}[]) => {
        try {
           setIsUpdating(true);
           //put se utiliza para actualizar un recurso completo.
            await axios.put(`/api/courses/${courseId}/chapters/reorder`,updateData);
            toast.success("Chapters reordered successfully");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }

    return (
        <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
            {isUpdating && (
                <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
                    <Loader2 className='animate-spin h-12 w-12 text-sky-700'/>
                </div>
                
            )}
            <div className='font-medium flex items-center justify-between'>
                Course chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreaiting && (
                        <>Cancel</>
                    )}
                    {!isCreaiting && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a chapter
                        </>
                    )}
                   
                </Button>
            </div>
            
            {isCreaiting && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='title' render={({field}) => (
                            <FormItem>
                                <FormControl>
                                   <Input {...field} disabled={isSubmitting} placeholder="e.g. 'Introduction to the course' " />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <div className='flex items-center gap-x-2'>
                            <Button disabled={!isValid || isSubmitting} type='submit'>Create</Button>
                        </div>
                           
                    </form>
                </Form>
            )}
            {!isCreaiting && (
                <div className={cn("text-sm mt-2",!initialData.chapters.length && "text-slate-500 italic")}>{!initialData.chapters.length && "No chapters"}
                    <ChapterList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                    
                </div>
            )}
             {!isCreaiting && (
                <p className='text-xs text-muted-foreground mt-4'>
                    Drag and drop to reorder chapters
                </p>
            )}
        </div>
    )
}