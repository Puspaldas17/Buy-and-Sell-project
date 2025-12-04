import Tick from "./tick"

export default function Success({message,success} : {message : string,success : boolean | null}){
    if(!success || success == null){
        return null
    }
    return(
        <div className="w-full bg-green-200 flex gap-2 justify-center items-center rounded-md py-4">
            <Tick></Tick>
            {message}
        </div>
    )
}
