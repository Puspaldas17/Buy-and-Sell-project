import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import BuyInterestedCard from "@/app/components/InterestedBuyer";

type ItemToBuyType = {
    buy_id : string,
    item_id : string,
    title : string,
    description : string,
    price : string,
    photo : string,
    status : string,
    seller_name : string
}

async function getPendingItems(){
    const session = await getServerSession(NEXT_AUTH);
    if(!session){
        return null;
    }
    try {
        const pendingItems = await prisma.buy.findMany({
            where : {
                buyer_Id : session.user.id,
                status : "pending",
                Item : {
                    deleted : false,
                    sold : false
                }
            },
            select : {
                id : true,
                status : true,
                Item : {
                    select : {
                        id : true,
                        title : true,
                        description : true,
                        price : true,
                        photo : true,
                        Sell : {
                            select : {
                                seller : {
                                    select : {
                                        firstname : true,
                                        lastname : true
                                    }
                                }
                            }
                        }
                    }
                },
            }
        })
        const mappedItems = pendingItems.map((items) => {
            return {
                buy_id : items.id,
                item_id : items.Item.id,
                title : items.Item.title,
                description : items.Item.description,
                price : items.Item.price.toString(),
                photo : items.Item.photo[0],
                status : items.status,
                seller_name : items.Item.Sell[0].seller.firstname + " " + items.Item.Sell[0].seller.lastname
            }
        })
        return mappedItems as ItemToBuyType[];
    } catch (err) {
        console.log(err)
        return null
    }
}
export default async function Interested(){
    const pendingItems = await getPendingItems() as ItemToBuyType[] | null;
    if(pendingItems?.length == 0){
        return (
            <div className="h-fit px-4 py-4 flex flex-col gap-6 ">
            No data found...
        </div>
        )
    }
    return(
        <div className="h-fit px-4 py-4 flex flex-col gap-6 ">
            {pendingItems && pendingItems.map((item) => {
                return (
                    <BuyInterestedCard item = {item} key={item.buy_id}></BuyInterestedCard >
                )
            })}
        </div>
    )
}

