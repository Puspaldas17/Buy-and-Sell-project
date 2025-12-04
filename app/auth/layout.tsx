export default function AuthLayout({children} : {children : React.ReactNode}){
    return(
        <div className="h-full w-full bg-[#eae2ff] flex justify-center items-center">
            {children}
        </div>
    )
}