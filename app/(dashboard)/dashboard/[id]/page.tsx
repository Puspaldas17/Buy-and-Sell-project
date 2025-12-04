import ChatWithSeller from "@/app/components/chatwithseller";
import prisma from "@/db";
import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";

type ItemType = {
    id : string,
    title : string,
    description : string,
    price : string,
    photos : string[],
    time : string,
    seller_name : string,
    seller_id : string,
    i_am_seller : boolean
}
async function getItemDetails(id : string | undefined | null){
    if(!id){
        return null;
    }
    const session = await getServerSession(NEXT_AUTH);
    try {
        const details = await prisma.item.findFirst({
            where : {
                id : id,
                sold : false,
                deleted : false
            },
            select : {
                id : true,
                title : true,
                description : true,
                price : true,
                photo : true,
                created : true,
                Sell : {
                    select : {
                        seller : {
                            select : {
                                firstname : true,
                                lastname : true,
                            }
                        },
                        seller_Id : true
                    }
                }
            }
        })
        if(details){
            return {
                id : details.id,
                title : details.title,
                description : details.description,
                price : details.price,
                photos : details.photo,
                time : details.created.toDateString(),
                seller_name : details.Sell[0].seller.firstname +" " + details.Sell[0].seller.lastname,
                seller_id  : details.Sell[0].seller_Id,
                i_am_seller : session.user.id == details.Sell[0].seller_Id
            }
        }else{
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export default async function ItemDetails({params} : { params: Promise<{ id: string | undefined | null }> } ){
    const id = (await params).id;
    const details = await getItemDetails(id) as ItemType | null;

    if(!details || !id){
        return (
            <div className="text-xl">No data found...</div>
        )
    }
    return(
        <div className="h-fit flex flex-col  px-16 py-10 gap-6 w-full">
            <div className="w-full h-[450px] bg-white rounded-lg px-20 py-8 flex flex-row gap-4 overflow-auto overflow-y-hidden snap-x shadow-xl border" style={{scrollbarWidth : "thin"}}>
                {details.photos.map((photo,id) => {
                    return(
                        <Image src={photo} alt="" className="rounded-lg snap-always snap-center" width={800} height={200} key={id}/>
                    )
                })}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="w-full min-h-32 bg-white rounded-lg border flex flex-col px-4 py-2 shadow-lg justify-between gap-1">
                    <div className="text-3xl text-gray-700 font-medium">Rs. {details.price}</div>
                    <div className="text-gray-500 h-full">{details.title}</div>
                    <div className="self-end text-gray-500">{details.time}</div>
                </div>
                <ChatWithSeller seller_name = {details.seller_name} i_am_seller = {details.i_am_seller} item_id = {details.id}></ChatWithSeller>
            </div>

            <div className="w-full min-h-56 bg-white border shadow-lg rounded-lg px-4 py-2">
                <div className="text-lg font-medium line-clamp-6">Description</div>
                <div>
                    {details.description}
                </div>
            </div>
        </div>
    )
}

