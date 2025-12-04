export default function Layout({children} : {children : React.ReactNode}){
    return (
        <div className="h-fit flex flex-col gap-8">
            <div className=" mb-6 text-3xl font-semibold">All time history,</div>
            {children}
        </div>
    )
}