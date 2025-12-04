'use server'

import { getServerSession } from "next-auth"
import { NEXT_AUTH } from "../../lib/auth"
import prisma from "../../db";

export async function getAllItems(page : string | null) {
    if(page){
        const session = await getServerSession(NEXT_AUTH);
        if(session.user){
            try {
                const allItems = await prisma.item.findMany({
                    where : {
                        sold : false,
                        deleted : false
                    }
                })
                const mappedItems = allItems.map((item) => {
                    return {
                        id : item.id,
                        title : item.title,
                        description : item.description,
                        price : item.price.toString(),
                        photos : item.photo,
                        time : item.created.toDateString(),
                    }
                })
                return mappedItems;
            } catch (error) {
                console.log(error)
                return []
            }
        }
    }else{
        return []
    }
    return [];
}