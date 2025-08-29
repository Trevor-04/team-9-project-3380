import React from 'react'
import {useState, useEffect} from 'react';
import GiftshopWrapper from '../components/GiftshopWrapper';
import axios from 'axios';

function Giftshop({imageUrl, name}) {

  const [gifts, setGifts] = useState([]);

  async function getProducts() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/inventory/category/0`);
        if(response && response.data) {
          setGifts(response.data);
        } else {
          setGifts([]);
        }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  useEffect(() => {
    getProducts();
  }, [])

  return (

    <div className='flex flex-col items-center justify-start min-h-screen bg-white'>
      {/* Header Section */}
      <div className='w-full flex justify-center items-center text-white font-bold bg-[#165e229e] py-12'>
        <h1 className="relative text-2xl md:text-4xl lg:text-5xl">Our Products</h1>
      </div>
      <GiftshopWrapper gifts={gifts}/>
    </div>
  )
}

export default Giftshop
