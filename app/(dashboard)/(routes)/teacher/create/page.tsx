"use client";
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


const formSchema = z.object({
    title: z.string().min(1,{message: 'Title is required'}).max(40, {message: 'Title is too long'})
});

const CreatePage = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ''
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post('/api/courses', values);
            router.push(`/teacher/courses/${response.data.id}`); 
            //En Axios, cuando realizas una solicitud HTTP y obtienes una respuesta, la propiedad .data se utiliza para acceder al cuerpo de la respuesta recibida desde el servidor
            toast.success("Course created successfully");
            
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    }

    return ( 
        <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
            <div>
                <h1 className='text-2xl'>Name your course</h1>
                <p className='text-sm text-slate-600'>Choose a name for your course. You can change it later.</p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8 mt-8'
                    >
                        <FormField control={form.control} name='title' render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Course title
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isSubmitting} placeholder="e.g. 'Advanced web development' " />
                                </FormControl>
                                <FormDescription>
                                    Give your course a name that reflects what its about.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className='flex items-center gap-x-2'>
                            <Link href="/" >
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Create course
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
     );
}
 
export default CreatePage;