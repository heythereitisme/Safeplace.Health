import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    // style={{ backgroundImage: `url("https://placeimg.com/1000/800/arch")` } img for hero if we need it
    <div className="min-h-screen bg-white min-w-screen">
      <div className='flex items-center relative top-16 ml-4 md:top-16 md:pl-24'>
        
        <div>
        <img src="/masahe-1.jpeg" className=' w-[6rem] h-[6rem] md:h-[12rem] md:w-[12rem] rounded-full shadow-xl' />
        </div> 
     <div className=' md:text-2xl '>
      <p className='text-black w-[10rem] md:w-[20rem] italic font-body ml-5 md:ml-5'> Easy access to massage services near you!</p>
      </div>
     </div>
    
     {/* Hero section */}
      <div className='md:hero sm:flex sm:flex-col sm:justify-center '>      
         <div className="hero-content text-center text-align-center text-neutral-content m-5 md:flex md:justify-center">
          <div className="max-w-sm flex flex-col items-center mt-12">
            <h2 className=" mb-10 text-7xl font-bold font-heading">Welcome to Masahe</h2>
            <h1 className='mb-5 text-3xl font-title'>Connecting you together</h1>
            <p className="mb-5 font-body">Masahe is a safety practice management system that allows cleints receiving mobile services by massage therapists safely by reviewing the rating of their massage therapists prior to arriving at their location.</p>
           <p className='mb-5 font-title font-bold '>CONTINUE AS</p>
           <div className='flex flex-col gap-4 items-center md:flex md:flex-row justify-center md:mt-4'> 
            <button className="btn btn-primary bg-white text-primary hover:text-white p-2 text-xs w-42 md:p-3 md:text-sm font-title"><Link to={"/client/login"}> Massage Client</Link></button>
            <button className='btn btn-primary bg-white text-primary hover:text-white p-2 text-xs w-42 md:p-3 md:text-sm items-center font-title'><Link to={"/mt/login"}>Massage Therapist </Link></button>
            </div>
            </div>
          </div>
        </div>

      <div className='flex items-center justify-end relative pb-12 pr-4  md:pr-24 '>
        <div className='md:text-2xl'>
         <p className='text-black w-[10rem] md:w-[20rem] italic font-body text-right mr-5'> Conncecting and communicating to clients made easy</p>
        </div>

        <div>
        <img src="/masahe-2.jpeg" className=' w-[6rem] h-[6rem] md:h-[12rem] md:w-[12rem] rounded-full shadow-xl' />
       
      </div>
      
        </div>
  </div>	
  

  )
}

export default Hero