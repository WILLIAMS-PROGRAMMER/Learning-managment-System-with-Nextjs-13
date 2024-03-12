

const DashboardLyout = ({children}: {children: React.ReactNode}) => {
    return ( <div className="h-full">
         
       <div className="bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 h-full flex items-center justify-center">
            {children}
       </div>
        
    </div> );
}
 
export default DashboardLyout;