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
import { Combobox } from '@/components/ui/combobox';



interface CategoryFormProps {
    initialData: any;
    courseId: string;
    options: {label:string; value:string;}[]; // option es un array de objetos
}

const formSchema = z.object({
    categoryId: z.string().min(1,{message: 'category is required'})
});

export const CategoryForm = ({initialData, courseId, options}:CategoryFormProps) => {

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

    //esto es para poder imprimir la categoria seleccionada por el usuario
    const selectedCategory = options.find((option) => option.value === initialData.categoryId);

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course category
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit category
                        </>
                    )}
                   
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2 truncate", !initialData.categoryId && "text-slate-500 italic")}>
                    {selectedCategory?.label || "No category selected"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='categoryId' render={({field}) => (
                            <FormItem>
                                <FormControl>
                                   <Combobox
                                        {...field}
                                        options={options}
                                   />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <div className='flex items-center gap-x-2'>
                            <Button disabled={!isValid || isSubmitting} type='submit'>Save</Button>
                        </div>
                           
                    </form>
                </Form>
            )}
        </div>
    )
}