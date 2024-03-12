"use client";

import enviarCorreo from '@/lib/email';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: '',
        phoneNumber: ''
    });

    const [lengthFieldComment, setLengthFieldComment] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if(name === 'comment' && value.length > 50) {
            return;
        }
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        if(name === 'comment' && value.length <= 50)
        setLengthFieldComment(value.length);

        console.log(formData);
        console.log(lengthFieldComment);
        
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Aquí puedes enviar los datos del formulario a tu servidor o realizar otras acciones
        console.log(formData);
        try {
            await axios.post(`/api/email`, formData); //axios.post es para hacer una peticion http de tipo post
            //PATCH se utiliza para actualizar parcialmente un recurso.
            //En una solicitud PATCH, solo se envían los campos que se desean modificar, no es necesario enviar el recurso completo.
            toast.success("Email send successfully, Thanks for contacting us.");
    
          } catch (error) {
                toast.error("Something went wrong. Please try again.");
          }
        
        
        // Limpia los campos del formulario después de enviar
        setFormData({
            name: '',
            email: '',
            comment: '',
            phoneNumber: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto pt-5">

            <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Nombre:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input w-full border border-sky-300 " required />
            </div>
            <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Correo Electrónico:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input w-full  border border-sky-300" required />
            </div>
            <div className="mb-6">
                <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">Comentario:</label>
                <textarea id="comment" name="comment" value={formData.comment} onChange={handleChange} className="form-textarea w-full  border border-sky-300" rows={5} required></textarea>
                <p className='text-sm font-light'>{50 - lengthFieldComment} Characters left</p>
            </div>
            <div className="mb-6">
                <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold mb-2">Número de Celular:</label>
                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-input w-full  border border-sky-300" required />
            </div>
            <div className="text-center">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Enviar</button>
            </div>
        </form>
    );
};

export default ContactForm;
