import Box from '@mui/material/Box/Box';
import LinearProgress from '@mui/material/LinearProgress';
import React from 'react'

const CustomLinearLoader = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  )
}

export default CustomLinearLoader;
