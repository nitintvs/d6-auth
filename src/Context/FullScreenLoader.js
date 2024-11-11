// FullScreenLoader.js
import React from 'react';
import { useLoader } from './LoaderContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const FullScreenLoader = () => {
  const { loading, loaderText } = useLoader();

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:"column",
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
      }}
    >
      <Typography color={"white"}>{loaderText}</Typography>
      <CircularProgress color="primary" />
    </Box>
  );
};

export default FullScreenLoader;
