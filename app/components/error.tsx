import Exclamation from "./exclamation"

export default function Error({message,success} : {message : string,success : boolean | null}){
    if(success || success == null){
        return null
    }
    return(
        <div className="w-full bg-red-200 flex gap-2 justify-center items-center rounded-md py-4">
            <Exclamation></Exclamation>
            {message}
        </div>
    )
}


