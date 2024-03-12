import { AudioLines } from "lucide-react";
import Link from "next/link";

const GamePage =  () => {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-6">
        {/* Tarjeta 1 */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-xl font-semibold mb-2">Tower Defense Game</h3>
          <p className="text-gray-600 mb-4">No dejes que los mounstros llegen al otro lado.</p>
          <Link href="/games/Allgames" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Tower Defense Game
          </Link>
        </div>
        
        {/* Tarjeta 2 */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-xl font-semibold mb-2">Título de la tarjeta 2</h3>
          <p className="text-gray-600 mb-4">Descripción corta de la tarjeta 2.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Botón 2
          </button>
        </div>
        
        {/* Tarjeta 3 */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-xl font-semibold mb-2">Título de la tarjeta 3</h3>
          <p className="text-gray-600 mb-4">Descripción corta de la tarjeta 3.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Botón 3
          </button>
        </div>
        
        {/* Tarjeta 4 */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-xl font-semibold mb-2">Título de la tarjeta 4</h3>
          <p className="text-gray-600 mb-4">Descripción corta de la tarjeta 4.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Botón 4
          </button>
        </div>
        </div>


    );
}

export default GamePage;



 <Link href="/games/Allgames">
<div className="flex justify-center">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Play</button>
</div>
</Link> 