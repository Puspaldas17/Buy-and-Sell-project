import NewItemSell from "@/app/components/newItemSell"

export default function Layout({children} : {children : React.ReactNode}){
    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <div className="text-5xl mb-6 text-gray-700 font-medium">Items to sell</div>
                <NewItemSell></NewItemSell>
            </div>
            {children}
        </div> 
    )
}