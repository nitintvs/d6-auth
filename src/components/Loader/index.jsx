import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function Loader({
    open,
    setOpen
}) {

  return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            // onClick={setO}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
  );
}
