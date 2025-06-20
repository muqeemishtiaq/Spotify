'use client'
import Box from '@/components/Box'
import React from 'react'

const error = () => {
  return (
  <Box className='h-full justify-center items-center flex flex-col'>
          <div className='text-neutral-400 text-sm md:text-lg'>
            Something went wrong!
          </div>
  </Box>
  )
}

export default error
