export const revalidate = 0;
import getLikedSongs from '@/actions/getLikedSongs';
import Header from '@/components/Header';
import Image from 'next/image';
import React from 'react'
import LikedContent from './components/LikedContent';

const Liked = async () => {
    const songs = await getLikedSongs();
  return (
    <div className='bg-neutral-900 rounded-lg p-6 w-full h-full overflow-hidden overflow-y-auto'>
      <Header>
        <div className='mt-20'>
            <div className='flex flex-col md:flex-row items-center gap-x-5'>
               <div className='relative h-32 w-32 lg:h-44 lg:w-44'>
                        <Image 
                        fill
                        src={'/images/liked.jpg'}
                        alt='Liked Songs'
                         />
               </div>
               <div className='flex flex-col gap-y-4 mt-4 md:mt-0'>
                    <p className='hidden md:block font-semibold'>PlayList</p>
                    <h1 className='text-white text-2xl md:text-3xl lg:text-4xl font-bold'>
                        Liked Songs
                    </h1>
               </div>

            </div>
        </div>
        </Header>
        <LikedContent songs={songs}/>
    </div>
  )
}

export default Liked
