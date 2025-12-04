

export default function Loading(){
    return (
        <div className="h-fit flex flex-col  px-16 py-10 gap-6 w-full animate-pulse">
            <div className="w-full h-[450px] bg-gray-300 rounded-lg px-20 py-8 flex flex-row gap-4 overflow-auto overflow-y-hidden snap-x shadow-xl border" ></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="w-full min-h-32 bg-gray-300 rounded-lg border flex flex-col px-4 py-2 shadow-lg justify-between">
                    <div className="h-6 w-32 bg-gray-500 rounded-md"></div>
                    <div className="text-gray-500 h-4 bg-gray-400"></div>
                    <div className="text-gray-500 h-4 bg-gray-400"></div>
                    <div className="text-gray-500 h-4 w-1/3 bg-gray-400"></div>
                    <div className="self-end bg-gray-400 h-4 w-20"></div>
                </div>
                <div className="w-full min-h-32 bg-gray-300 rounded-lg shadow-lg border flex flex-row">
                    <div className="w-full h-full flex flex-col px-2 py-2 gap-3">
                        <div className="bg-gray-500 self-center py-6 w-44 rounded-md"></div>
                        <div className="h-8 w-32 rounded-md bg-gray-400 "> </div>
                        <button className="bg-gray-400 py-6 rounded-md" ></button>
                    </div>
                </div>
            </div>
        </div>
    )
}


