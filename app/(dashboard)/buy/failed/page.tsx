import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import BuyFailedCard from "@/app/components/failedBuyer";
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
                status : 'failed',
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
        const mappedItems = pendingItems.map((buy) => {
            return {
                buy_id : buy.id,
                item_id : buy.Item.id,
                title : buy.Item.title,
                description : buy.Item.description,
                price : buy.Item.price.toString(),
                photo : buy.Item.photo[0],
                status : buy.status.toString(),
                seller_name : buy.Item.Sell[0].seller.firstname + " " + buy.Item.Sell[0].seller.lastname
            }
        })
        return mappedItems as ItemToBuyType[];    
    } catch (err) {
        console.log(err)
        return null;
    }
}


export default async function Cancelled(){
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
            {pendingItems &&  pendingItems.map((item) => {
                return (
                    <BuyFailedCard item = {item} key={item.buy_id}></BuyFailedCard>
                )
            })}
        </div>
    )
}