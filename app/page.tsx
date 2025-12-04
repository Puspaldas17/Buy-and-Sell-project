'use client'
import Image from "next/image";
import AppBar from "./components/appbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
    const router = useRouter()
  return (
    <>
      <AppBar></AppBar>
      <div className="min-h-screen w-full flex flex-col  ">
        <div className="flex flex-col gap-4 h-96 border-b mx-40 py-20">
            <div className="self-center">
                <Image src="/fonts/buysell.png" height={200} width={400}  alt="" className="opacity-100"/>
            </div>
            <div className="text-gray-600 text-2xl font-normal self-center">Discover, Buy, and Sell with Ease - Your College Marketplace</div>
        </div>
        <div className="h-screen grid grid-cols-2 items-center border-b mx-40 py-20">
            <div className="flex flex-col gap-4 px-4">
                <div className="text-4xl text-gray-700 font-semibold">Your Campus Marketplace Awaits</div>
                <div className="text-xl text-gray-700 tracking-wide leading-8">Discover the best deals on campus, from essential textbooks to cutting-edge tech gadgets. Whether you are looking for affordable study materials, stylish dorm accessories, or the latest electronics, our platform connects you with fellow students to buy and sell everything you need for college life.</div>
                <div className="bg-purple-600 w-fit px-8 cursor-pointer rounded-md hover:bg-purple-700 py-2 text-white" onClick={(e) => {router.push('/dashboard?page=0') ; e.stopPropagation()}}>Explore</div>
            </div>
            <div className=" w-full h-full flex justify-center items-center">
                <Image src="/landing4.png" height={300} width={600}  alt="" className="opacity-80 rounded-xl shadow-lg" />
            </div>
        </div>
        <div className="h-screen grid grid-cols-2 items-center border-b mx-40 py-20">
            <div className=" w-full h-full flex justify-center items-center">
                <Image src="/landing6.png" height={300} width={600}  alt="" />
            </div>
            <div className="flex flex-col gap-4 px-4">
                <div className="text-4xl text-gray-700 font-semibold">Keep track of all your past transactions in one place. View details of previous purchases and sales effortlessly.</div>
                <div className="text-xl text-gray-700 tracking-wide leading-8">Effortlessly keep track of all your past transactions in one convenient location. With the Transaction History feature, you can view detailed records of your previous purchases and sales, including dates, item descriptions, prices, and buyer/seller information. This makes it easy to manage and organize your buying and selling activities on our platform.</div>
                <div className="bg-purple-600 w-fit px-8 cursor-pointer rounded-md hover:bg-purple-700 py-2 text-white" onClick={(e) => {router.push('/dashboard?page=0') ; e.stopPropagation()}}>Explore</div>
            </div>
        </div>
        <div className="h-screen grid grid-cols-2 items-center border-b mx-40 py-20">
            <div className="flex flex-col gap-4 px-4">
                <div className="text-4xl text-gray-700 font-semibold">Privacy Protection:</div>
                <div className="text-xl text-gray-700 tracking-wide leading-8">Rest assured that your personal data is kept secure. The platform hides the seller personal information from buyers, providing an added layer of security and ensuring privacy throughout the transaction process.</div>
                <div className="bg-purple-600 w-fit px-8 cursor-pointer rounded-md hover:bg-purple-700 py-2 text-white" onClick={(e) => {router.push('/dashboard?page=0') ; e.stopPropagation()}}>Explore</div>
            </div>
            <div className=" w-full h-full flex justify-center items-center">
                <Image src="/landing8.webp" height={300} width={600}  alt="" />
            </div>
        </div>
        <div className="h-96 w-full bg-gray-300 flex flex-col py-10 px-20">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                  <div className="text-4xl text-gray-700 font-semibold">Buy & Sell</div>
                  <div className="w-96 flex flex-col gap-2">
                        <div className="text-xl text-gray-800">Contributors : </div>
                        <Link href={'https://github.com/ayush-gupta-04'} className="px-6 hover:text-blue-600">Ayush Gupta</Link>
                        <Link href={'https://github.com/krishan-deo'} className="px-6 hover:text-blue-600">Krishan deo prasad</Link>
                        <Link href={'https://www.linkedin.com/in/achintya-kumar/'} className="px-6 hover:text-blue-600">Achintya Kumar</Link>
                  </div>
                </div>
                
              </div>
              <div></div>
          </div>
      </div>
    </>
  );
}


//apply line clamp
