import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import Image from "next/image";

type HistoryType = {
    seller_name: string;
    buyer_name: string;
    time: string;
    item: {
        title: string;
        description: string;
        price: string,
        photo : string 
    };
}

async function getHistory(){
    const session = await getServerSession(NEXT_AUTH);
    if(!session.user){
        return null;
    }
    try {
        const history = await prisma.trade.findMany({
            where : {
                Item : {
                    sold : true,
                    deleted : false
                },
                OR : [
                    {
                        seller_id : session.user.id
                    },
                    {
                        buyer_id : session.user.id
                    }
                ]
            },
            select : {
                time : true,
                Seller : {
                    select : {
                        firstname : true,
                        lastname : true,
                    }
                },
                Buyer : {
                    select : {
                        firstname : true,
                        lastname : true
                    }
                },
                Item : {
                    select : {
                        title : true,
                        description : true,
                        price : true,
                        photo : true
                    }
                },
                
            }
        })
    
        const mappedHistory = history.map((trade) => {
            return {
                seller_name : trade.Seller.firstname + " " + trade.Seller.lastname,
                buyer_name : trade.Buyer.firstname + " " + trade.Buyer.lastname,
                time : trade.time.toDateString(),
                item : {
                    title : trade.Item.title,
                    description : trade.Item.description,
                    price : trade.Item.price.toString(),
                    photo : trade.Item.photo[0]
                }
     
            }
        })
        return mappedHistory as HistoryType[];
    } catch (error) {
        console.log(error)
        return null
    }
}

export default async function HistoryPage(){
    const history = await getHistory() as HistoryType[] | null;
    if(!history || history.length == 0){
        return (
            <div className="text-lg">No data found...</div>
        )
    }
    return(
        <>
        {history.map((item,id) => {
            return (
                <HistoryItems key={id} history ={item}></HistoryItems>
            )
        })}
        </>
    )
}

function HistoryItems({history} : {history : HistoryType}){
    return(
        <div className="w-full min-h-48 bg-white rounded-lg shadow-lg grid grid-cols-4 px-2 py-2 gap-2">
            <div className=" h-full col-span-1 overflow-hidden rounded-lg flex justify-center items-center bg-black ">
                <Image src={history.item.photo} alt="" className="hover:scale-105 transition-all duration-300" width={800} height={200}/>
            </div>
            <div className="col-span-2 flex flex-col px-1 justify-between">
                <div className="text-lg font-semibold text-gray-700">{history.item.title}</div>
                <div className="h-full text-gray-500">{history.item.description}</div>
                <div>Price : {history.item.price}</div>
                <div>Time : {history.time}</div>
            </div>
            <div className="col-span-1 grid grid-rows-2">
                <div className=" row-span-1 flex flex-col justify-center gap-2">
                    <div className="text-2xl font-medium">Seller : </div>
                    <div className="px-2 text-lg text-gray-700">{history.seller_name}</div>
                </div>
                <div className=" row-span-1 flex flex-col justify-center gap-2">
                    <div className="text-2xl font-medium">Buyer : </div>
                    <div className="px-2 text-lg text-gray-700">{history.buyer_name}</div>
                </div>
            </div>
        </div>
    )
}