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
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import {Checkbox} from '@/components/ui/checkbox';


interface ChapterAccessFormProps {
    initialData: any;
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({initialData, courseId, chapterId}:ChapterAccessFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing(!isEditing);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const {isSubmitting, isValid} = form.formState;

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
                Chapter access
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit access
                        </>
                    )}
                   
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2 truncate", !initialData.isFree && "text-slate-500 italic")}>
                    {initialData.isFree && "This chapter will be free for all users."}
                    {!initialData.isFree && "This chapter is paid for all users."}
                    
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='isFree' render={({field}) => (
                            <FormItem className='flex flex-row gap-2 text-center items-center'>
                                <FormControl>
                                    <Checkbox
                                        checked = {field.value}
                                        onCheckedChange = {field.onChange} //esto lo que hace es que cuando se cambie el valor del checkbox, se actualice el valor del campo
                                    >
                                        
                                    </Checkbox>
                                </FormControl>
                                <p className='text-green-500 font-bold'>
                                    {field.value ? "Free" : "Paid" }
                                </p>
                               
                                <FormMessage/> 
                                {/* //este es un mensaje que se muestra si hay un error en el campo */}
                            </FormItem>
                            
                        )}/>
                         <div> 
                             Check this box if you want to make this chapter free for all users.
                        </div>

                        <div className='flex items-center gap-x-2'>
                            <Button disabled={!isValid || isSubmitting} type='submit'>Save</Button>
                        </div>
                           
                    </form>
                </Form>
            )}
        </div>
    )
}