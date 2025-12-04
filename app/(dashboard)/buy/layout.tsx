import Tabs from "@/app/components/tabs";

export default function Layout({children} : {children : React.ReactNode}){
    return(
        <div className="w-full pt-4  flex flex-col h-fit">
            <div className="flex flex-row gap-4 mx-4 border-b">
                <Tabs title="Interested" href="/buy/interested"></Tabs>
                <Tabs title="Failed" href="/buy/failed"></Tabs>
            </div>
            {children}
        </div>
    )
}