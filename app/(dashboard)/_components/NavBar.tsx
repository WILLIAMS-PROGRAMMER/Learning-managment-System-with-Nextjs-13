import NavBarRoutes from "@/components/NavBarRoutes";
import MobileSidebar from "./MobileSidebar";

const NavBar = () => {
    return ( <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <MobileSidebar />  {/* dentro de este componente se comprueba si es mobil se muestra, sino no se muestra */}
        
         {/* Este es un compenente global ,por eso va en compoentes de global ya que este estara siempre,
         ojo: sidebar varia dependiendo de si es teacher mode o no  */}
        <NavBarRoutes /> 
        
    </div> );
}
 
export default NavBar;