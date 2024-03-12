
import NavBar from "./_components/NavBar";
import Sidebar from "./_components/Sidebar";

const DashboardLyout = ({children}: {children: React.ReactNode}) => {
    return ( <div className="h-full">
         
        {/* NabBar */}
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-[50] ">
            <NavBar />
        </div>
        {/* SideBar */}
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
            <Sidebar />
        </div>
        {/* ALL THE CONTENT */}
        <main className="md:pl-56 pt-[80px] h-full">
            {children}
            
        </main>
      
        
    </div> );
}
 
export default DashboardLyout;