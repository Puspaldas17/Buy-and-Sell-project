import { signinSchema } from '@/schema';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from "bcrypt"
import prisma from '../db';

export const NEXT_AUTH = {
    providers : [
        CredentialsProvider({
            name: 'Email',
            credentials: {
              username: { label: 'Email', type: 'text', placeholder: '' },
              password: { label: 'Password', type: 'password', placeholder: '' },
            },
            async authorize(credentials : Record<"password" | "username", string> | undefined) {
                const format = signinSchema.safeParse({email : credentials?.username,password : credentials?.password});
                console.log(credentials)
                if(format.success){
                    const email = credentials?.username as string;
                    const password = credentials?.password as string;
                    try {
                        const data = await prisma.user.findFirst({
                            where : {
                                email : email
                            }
                        })
                        if(data && data.isEmailVerified && data.password){
                            const passMatched = await bcrypt.compare(password,data.password)
                            if(passMatched){
                                return{
                                    id : data.id,
                                    name : data.firstname + " " + data.lastname,
                                    email : data.email,
                                }
                            }else{
                                return null
                            }
                        }else{
                            return null;
                        }
                    } catch (error) {
                        console.log(error)
                        return null
                    }
                } 
                return null;
            },
        }),
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID || "",
            clientSecret : process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    pages : {
        signIn : '/auth/signin',
        signOut : '/auth/signin'
    },
    secret : process.env.NEXTAUTH_SECRET,
    callbacks : {
        session : ({session,token} : any) => {
            session.user.id = token.sub;
            return session;
        },
        signIn : async ({user,account} : any) => {
            console.log(user);
            if(account.provider == "google"){
                const existingUser = await prisma.user.findFirst({
                    where : {
                        email : user.email
                    }
                })
                const name = user.name.split(" ");
                let firstname = user.name;
                let lastname = null;
                if(name.length == 2){
                    firstname = name[0];
                    lastname = name[1];
                }
                if(!existingUser){
                    try {
                        const newUser = await prisma.user.create({
                            data : {
                                email : user.email,
                                firstname : firstname,
                                lastname : lastname,
                                isEmailVerified : true
                            }
                        })
                        user.id = newUser.id;
                        return true;
                    } catch (error) {
                        console.log(error)
                        return false;
                    }
                }else{
                    user.id = existingUser.id;
                }
            }
            return true;
        }
    }
}
