export default function Loading(){
    return (
        <div className="flex flex-col gap-4 mt-4">
            <SellBuyItemSkeleton></SellBuyItemSkeleton>
            <SellBuyItemSkeleton></SellBuyItemSkeleton>
            <SellBuyItemSkeleton></SellBuyItemSkeleton>
        </div>
    )
}

function SellBuyItemSkeleton(){
    return (
        <div className="bg-gray-300 h-48 grid grid-cols-12 px-2 py-2 gap-2 animate-pulse rounded-lg">
            <div className="bg-gray-400 col-span-3 rounded-lg"></div>
            <div className="col-span-7 flex flex-col gap-2">
                <div className="h-8 bg-gray-400 w-32 rounded-lg"></div>
                <div className="h-6 bg-gray-400 w-full rounded-lg"></div>
                <div className="h-6 bg-gray-400 w-full rounded-lg"></div>
                <div className="h-6 bg-gray-400 w-full rounded-lg"></div>
                <div className="h-6 bg-gray-400 w-36 rounded-lg"></div>
            </div>
        </div>
    )
}