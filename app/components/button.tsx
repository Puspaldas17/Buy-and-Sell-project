export default function Button({loading,text} : {loading : boolean,text : string}){
    return(
        <button className = {`rounded-md text-white w-full py-3 ${loading?"bg-[#c9a3ff]":"bg-[#ac70ff] hover:bg-[#8647dd]"} active:scale-95 transition-all`}
            disabled = {loading}>
            {loading?"Loading...":text}
        </button>
    )
}