'use client'
import { getAllItems } from "@/app/action/getItem";
import Items from "@/app/components/items"
import ItemSkeleton from "@/app/components/skeleton/BulkItemSkeleton";
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react";

type ItemType = {
    id : string,
    title : string,
    description : string,
    price : string,
    photos : string[],
    time : string,
}

function Dashboard(){
    const searchParams = useSearchParams();
    const page = searchParams.get('page');
    const[items,setItems] = useState<ItemType[] | null>(null);
    useEffect(() => {
        getAllItems(page).
        then((allItems) => {
            setItems(allItems)
        }).catch((err) => {
            console.log(err)
        })
        
    },[page])
    if(!page || items?.length == 0){
        return(
            <div className="text-lg">
                No data found
            </div>
        )
    }
    if(!items && page != null){
        return(
            <div className=" grid grid-cols-3 gap-4 gap-y-8">
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
            </div>
        )
    }
    return(
        <div className=" grid grid-cols-3 gap-4 gap-y-8">
            {items && items.map((item : ItemType) => {
                return <Items key={item.id} title={item.title} time={item.time} price={item.price} description={item.description} photos={item.photos} id = {item.id}></Items>
            })}
        </div>
    )
}


const DashboardWithSuspense = () => ( 
<Suspense fallback={<div>Loading...</div>}> <Dashboard /> </Suspense> 
);

export default DashboardWithSuspense;