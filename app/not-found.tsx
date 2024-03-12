// app/404.tsx

import React from 'react';
import DashboardLyout from './(dashboard)/layout';
import Image from 'next/image';

const NotFound = () => {
    return (
        //Este es el layout que se va a mostrar cuando no se encuentre la pagina
        <DashboardLyout>
        <div className="relative flex flex-col items-center justify-center h-full gap-12 bg-blue-100">
            <img
                className='absolute top-0 left-0'
                src="https://i.pinimg.com/originals/ef/8b/bd/ef8bbd4554dedcc2fd1fd15ab0ebd7a1.gif"
                alt="404"
                width={200}
                height={300}
            />
            <div className='flex grid-cols-2 justify-center items-center '>
                <h1 className="text-4xl font-semibold text-gray-800">404 - Página no encontrada
                    <p className="text-lg text-gray-600 mt-6">Lo sentimos, la página que estás buscando no existe.</p>
                </h1>
                <img
                    src="https://media.tenor.com/eDchk3srtycAAAAi/piffle-error.gif"
                    alt="404"
                    width={250}
                    height={300}
                    className="mt-8"
                />
          </div>
       
        </div>
      </DashboardLyout>
      
      
    );
};

export default NotFound;
