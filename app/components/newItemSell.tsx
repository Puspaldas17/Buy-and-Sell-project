'use client'
import { useState } from "react";
import BackgroundSupporter from "./BackgroundSupporter";
import { useEdgeStore } from "../../lib/edgestore";
import {MultiFileDropzone,type FileState,} from '../components/Multi-Dropzone-File';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newItemFromat, newItemSchema } from "@/schema";
import newItemSellAction from "../action/addItemSell";
import Success from "./success";
import Error from "./error";

type BackendResponse = {
    success : boolean | null,
    message : string
}

export default function NewItemSell(){
    const[show, setShow] = useState(false);
    function closePopup(){
        if(show){
            setShow(false);
        }
    }
    return(
        <div>
            <BackgroundSupporter hide = {!show}></BackgroundSupporter>
            <button className="bg-[#ac70ff] px-6 h-12 rounded-lg hover:bg-[#9c55ff] text-white text-lg active:scale-95 transition-all duration-150" onClick={() => {setShow(true)}}>Sell new item</button>
            {show && <AddNewItem closePopup = {closePopup}></AddNewItem>}
        </div>
    )
}

function AddNewItem({closePopup} : {closePopup : () => void}){
    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const [response,setResponse] = useState<BackendResponse>({
        success : null,
        message : "hello"
    })
    const { edgestore } = useEdgeStore();
    const[loading,setLoading] = useState(false);
    const[urls,setUrls] = useState<string[]>([]);
    function updateFileProgress(key: string, progress: FileState['progress']) {
        setFileStates((fileStates) => {
          const newFileStates = structuredClone(fileStates);
          const fileState = newFileStates.find(
            (fileState) => fileState.key === key,
          );
          if (fileState) {
            fileState.progress = progress;
          }
          return newFileStates;
        });
    }

    async function onFormSubmit(data : newItemFromat){
        setLoading(true);
        for(const url of urls){
            try {
                await edgestore.myPublicImages.confirmUpload({
                    url
                })
            } catch (error) {
                console.log(error)
                alert("Error while uploading")
            }
        }
        const res = await newItemSellAction({title : data.title,description : data.description , price : data.price , urls : urls}) as BackendResponse;
        setLoading(false);
        setResponse(res);
    }
    const {register , formState : {errors},handleSubmit} = useForm<newItemFromat>({resolver : zodResolver(newItemSchema)})
    return(
        <div className="w-5/12 gap-4 h-fit bg-white shadow-lg fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col justify-center items-center px-4 pt-4 pb-2 overflow-auto">
            <div className="text-3xl font-serif font-medium">Enter Details of The Item</div>
            <form className="w-full flex flex-col gap-6" onSubmit={(handleSubmit(onFormSubmit))}>
                <div className="relative">
                    <input placeholder="Title"
                    {...register('title')}
                    disabled = {loading}
                    className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                    {errors.title && (
                        <div className="text-red-600">
                            {errors.title.message}
                        </div>
                    )}
                    <label
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Enter Title
                    </label>
                </div>
                <textarea {...register('description')}  className="px-4 py-2 rounded-lg outline-gray-800 ring-0  border hover:bg-slate-50 h-32" placeholder="Write Description..."></textarea>
                {errors.description && (
                    <div className="text-red-600">
                        {errors.description.message}
                    </div>
                )}
                <div className="flex flex-col gap-2 text-gray-800 ">
                    <div className="font-medium">Enter Price of Item</div>
                    <div className="relative">
                        <input placeholder="Price"
                        type="number"
                        disabled = {loading}
                        {...register('price')}
                        className="peer focus:bg-white shadow-sm w-full hover:bg-slate-50 rounded-md  px-3 py-3   transition-all placeholder-shown:border  focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0  placeholder:opacity-0 focus:placeholder:opacity-100" />
                        {errors.price && (
                            <div className="text-red-600">
                                {errors.price.message}
                            </div>
                        )}
                        <label
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Enter Price
                        </label>
                    </div>
                </div>
                <MultiFileDropzone
                    value={fileStates}
                    onChange={(files) => {
                        setFileStates(files);
                    }}
                    onFilesAdded={async (addedFiles) => {
                        setFileStates([...fileStates, ...addedFiles]);
                        await Promise.all(
                           addedFiles.map(async (addedFileState) => {
                            try {
                              const res = await edgestore.myPublicImages.upload({
                                options : {
                                    temporary : true,
                                },
                                file: addedFileState.file,
                                onProgressChange: async (progress) => {
                                  updateFileProgress(addedFileState.key, progress);
                                  if (progress === 100) {
                                    // wait 1 second to set it to complete
                                    // so that the user can see the progress bar at 100%
                                    await new Promise((resolve) => setTimeout(resolve, 1000));
                                    updateFileProgress(addedFileState.key, 'COMPLETE');
                                  }
                                },
                                
                              });
                              setUrls((prev) => [...prev, res.url]);
                            } catch (err) {
                                console.log(err)
                              updateFileProgress(addedFileState.key, 'ERROR');
                            }
                          }
                        ),
                        );
                        
                      }}
                    //used to define the max files we can upload.
                    dropzoneOptions={{maxFiles : 3}}
                />
                <Success success = {response.success} message={response.message}></Success>
                <Error success = {response.success} message={response.message}></Error>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-400 hover:bg-gray-500 rounded-lg active:scale-95 transition-all duration-150 flex justify-center items-center" onClick={(e) => {closePopup();e.stopPropagation()}}>Cancel</div>
                    <button className="bg-[#ac70ff] py-3 rounded-lg hover:bg-[#9c55ff] text-white text-lg active:scale-95 transition-all duration-150">{loading?"Loading...":"Upload Item"}</button>
                </div>
            </form>
        </div>
    )
}