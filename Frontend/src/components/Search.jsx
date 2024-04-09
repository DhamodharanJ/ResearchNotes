import React, { useEffect, useState } from "react";
import { Icon } from '@chakra-ui/react';
import { IoMdSearch } from "react-icons/io";
import '../App.css'
import { useSelector , useDispatch} from 'react-redux';
import { addQuery } from "../Redux/Slices/resultSlice";
import Youtube from "./results/Youtube";
import useHandleFetchResults from '../utlis/helper'
import '../App.css'
import Meaning from "./results/Meaning";
import Image from "./results/Image";


function Search({setAuthModal}) {

  
  const [search,setSearch] = useState(false)
  const [startType,setStartType] = useState(false)
  
  const dispatch = useDispatch()
  const {isLogged} = useSelector(state=>state.userData)
  const {results,query} = useSelector(state=>state.resultData)
  
  const {fetchVideos,fetchMeaning,fetchImage} = useHandleFetchResults(query)
  // console.log(results)


const handleChange=(e)=> {
  if(isLogged){
    setStartType(true)
    dispatch(addQuery(e.target.value))
  }else{
    setAuthModal(true)
  }
} 

const handleSubmit = () => {
  if(query !== ''){                           
    setSearch(true)
    fetchVideos()
    fetchMeaning()
    fetchImage()
  }
}

  return (  
    <div className={`flex ${search ? "" :'flex-col'} items-center justify-center h-full`}>
      <div className={`${startType || results.videos ? 'absolute top-3 m-auto' : "top-48" } transition-all duration-300`}>
      <input id="search-bar" className="gcse-searchbox border-2 border-primary h-12 md:w-96 xs:w-80 rounded-full pl-5 pr-16 font-bold " type="text" placeholder="Search the entire web..."
      value={query} 
      onChange={handleChange}
      onKeyUp={(e)=>e.key=='Enter' && handleSubmit()}
      />
      <Icon as={IoMdSearch} onClick={handleSubmit} className='text-4xl -ml-14 cursor-pointer' style={{ color: '#00bbff'}} />
      </div>
      
      {
         !search ? <>
      <h1 className="font-bold text-4xl m-10 font-inika">Unleash Your Curiosity with ResearchNotes</h1>
      <p className="text-center w-1/3 font-inika">Your go-to destination for comprehensive online research. Find, organize, and share resources effortlessly.</p>
      </> : 
      Object.keys(results).length == 0 ? <div className="loader"></div> :
      <>
      <div className="border border-black w-4/6 h-full">
        <div className="border border-black w-full h-1/5 overflow-y-scroll">
          <Meaning />
        </div>
        <div className="border border-black w-full h-40 overflow-x-scroll">
          <Image />
        </div>
        <div className="gcse-searchresults border border-black w-full flex-grow overflow-y-scroll">

        
        </div>
      </div>
      <div className="lg:w-2/6 xs:w-5/12 h-full border border-black overflow-y-scroll shadow-xl">
          <Youtube />
      </div>
      </>
      }
       
    </div>
  );
}

export default Search;  
