export default function ItemSkeleton(){
    return(
        <div className="w-full h-80 bg-gray-300 shadow-lg rounded-lg grid grid-rows-3 cursor-pointer animate-pulse">
                <div className="row-span-2 rounded-lg mx-2 my-2 bg-gray-400 flex justify-center items-center"></div>
                <div className="flex flex-col px-2 pb-2">
                    <div className="text-lg font-bold bg-gray-500 h-10 w-28 rounded-md"></div>
                    <div className="h-full  flex flex-col justify-center gap-2">
                        <div className="w-full h-4 bg-gray-400 rounded-md"></div>
                        <div className="w-1/3 h-4 bg-gray-400 rounded-md"></div>
                    </div>
                    <div className=" bg-gray-400 h-6 rounded-md w-24"></div>
                </div>
                
        </div>
    )
}