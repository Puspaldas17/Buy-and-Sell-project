import AppBar from "../components/appbar";
import Navbar from "../components/navbar";

export default function Layout({children} : {children : React.ReactNode}){
    return (
        <div className="min-h-screen flex flex-col" >
            <AppBar></AppBar>
            <div className="grid grid-cols-6">
                <div className="col-span-1 h-screen sticky top-20">
                    <Navbar></Navbar>
                </div>
                <div className="col-span-4 min-h-screen bg-gray-100 px-4 py-8">{children}</div>
            </div>
        </div>
    )
}

//div    --> h-40 flex flex-col
//  div  --> h-20
//  div  --> h-full -- it will only occupy 20 jo bcha hoga....ye tabhi hoga jb top div flex flex-col hoga.
//div

