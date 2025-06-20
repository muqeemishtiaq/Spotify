'use client'
import Box from '@/components/Box'
import React from 'react'
import { BounceLoader } from 'react-spinners'

const loading = () => {
  return (
    <Box className='h-full justify-center items-center flex flex-col'>
          <BounceLoader size={40} color="#22c55e"/>
  </Box>
  )
}

export default loading
