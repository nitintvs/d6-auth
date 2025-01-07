// import React, { useEffect, useState } from 'react';
// import { Button, Typography, Box } from '@mui/material';
// import instance from 'configs/axiosConfig';
// import { useNavigate } from 'react-router-dom';

// // Load the Sticitt SDK script dynamically
// const loadSticittSDK = (onPaid, onClosed) => {
//   const script = document.createElement('script');
//   script.id = 'sticitt-pay-sdk';
//   script.src = 'https://sdk-test.sticitt.co.za/js/lib/sdk.min.js';
//   script.async = true;
  
//   // Once the script is loaded, bind the callbacks
//   script.onload = () => {
//     window.onPaid = onPaid;
//     window.onClosed = onClosed;
//   };
//   console.log("sticitt-pay-sdk",script)
//   document.body.appendChild(script);
// };

// const SticittPayment = ({ paymentId , orderId}) => {
//   const navigate = useNavigate();

//   const [isPaid, setIsPaid] = useState(false);
//   const [order_Id, setOrder_Id] = useState(orderId);
//   const [sucessData, setSucessData] = useState(null);
//   const [isCancelled, setIsCancelled] = useState(false);
//   const [retry, setretry] = useState(true);

//   // Handle Payment Success
//   const onPaid = async (btn, paymentId) => {
//     console.log('onPaid callback triggered', btn, paymentId);
//     setIsPaid(true);
//     let res = await instance.get("/sticitt_pay/sticitt-payment-status/", {
//       params: {
//         transaction_id: order_Id,
//       },
//     });
//     let { data, response } = res;
    
//   console.log('sticitt-pay-sdk 12', res);
//     if (data) {
//       navigate(`/order-status?orderid=${data.transaction_id}`, {
//         state: { order: data },
//       });
//     };
//   };

//   // Handle Payment Closed (Cancelled)
//   const onClosed =async (btn, paymentId) => {
//     console.log('onClosed callback triggered', btn, paymentId);
//     setIsCancelled(true);
//     let res = await instance.get("/sticitt_pay/sticitt-payment-status/", {
//       params: {
//         transaction_id: order_Id,
//       },
//     });
//     let { data, response } = res;
    
//   console.log('sticitt-pay-sdk 12', res);
//     if (data) {
//       navigate(`/order-status?orderid=${data.transaction_id}`, {
//         state: { order: data },
//       });
//     };
//   };

//   // Function to handle retry
//   const handleRetry = () => {
//     setIsPaid(false);
//     setIsCancelled(false);
//     window.location.reload()
//   };

//   // Load the Sticitt SDK when the component mounts
//   useEffect(() => {
//     loadSticittSDK(onPaid, onClosed); // Pass the callbacks to bind to SDK
//   }, []);

//   return (
//     <Box sx={{ textAlign: 'center',  }}>
//       {isPaid ? (
//         <Box>
//           <Typography variant="body1" gutterBottom>
//             Payment was successful! Thank you.
//           </Typography>
//           {/* <Button variant="contained" color="primary" onClick={handleRetry}>
//             Retry Payment
//           </Button> */}
//         </Box>
//       ) : isCancelled ? (
//         <Box>
//           <Typography variant="body1" gutterBottom>
//             Payment was cancelled. Please try again.
//           </Typography>
//           <Button variant="contained" color="primary" onClick={handleRetry}>
//             Retry Payment
//           </Button>
//         </Box>
//       ) : (
//         <Box>
//           <Button
//             size='large'
//             className="sticitt-pay-button"
//             variant="contained"
//             color="secondary"
//             data-payment-id={paymentId}
//             data-on-paid="onPaid"
//             data-on-closed="onClosed"
//           >
//             Pay with Sticitt
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default SticittPayment;


import React, { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import instance from 'configs/axiosConfig';
import { useNavigate } from 'react-router-dom';

const SticittPayment = ({ paymentId, orderId }) => {
  const navigate = useNavigate();
  const storeorderid=  sessionStorage.getItem("order_id")
  const [isPaid, setIsPaid] = useState(false);
  const [order_Id, setOrder_Id] = useState(orderId);
  const [isCancelled, setIsCancelled] = useState(false);

  // Handle Payment Success
  const onPaid = async (btn, paymentId) => {
    setIsPaid(true);
    let res = await instance.get("/sticitt_pay/sticitt-payment-status/", {
      params: {
        transaction_id: order_Id ? order_Id : storeorderid,
      },
    });
    let { data } = res;
    if (data &&data.transaction_id) {
      console.log('onPaid callback triggered', data);
      sessionStorage.removeItem("order_id")
      navigate(`/order-status?orderid=${data.transaction_id}`, {
        state: { order: data },
      });
    }
  };

  // Handle Payment Closed (Cancelled)
  const onClosed = async (btn, paymentId) => {
    console.log('onClosed callback triggered', btn, paymentId);
    setIsCancelled(true);
    let res = await instance.get("/sticitt_pay/sticitt-payment-status/", {
      params: {
        transaction_id: order_Id ? order_Id : storeorderid,
      },
    });
    let { data } = res;
    if (data &&data.transaction_id) {
      navigate(`/order-status?orderid=${data.transaction_id}`, {
        state: { order: data },
      });
    }
  };

  // Load the Sticitt SDK when the component mounts
  useEffect(() => {
    sessionStorage.setItem("order_id",orderId)
    if (window.sticittSDKLoaded) {
      const script = document.createElement('script');
      script.id = 'sticitt-pay-sdk';
      script.setAttribute('data-client-id', 'webbieshop-app'); // Replace <client-id> with your actual client ID
      script.setAttribute('data-client-secret', 'GAWtzPuPKK@JHAC7!Lyb4aFeyRF87qq!9VfFj!mD@nEDMP8VM!ekqtjFd@-Qnf2V'); // Replace <client-secret> with your actual client secret
      script.src = 'https://sdk-test.sticitt.co.za/js/lib/sdk.min.js';

      script.async = true;
      console.log("STICITTSDKINITINLIZED",)
      window.onPaid = onPaid;
      window.onclose = onClosed;
    } else {
      const script = document.createElement('script');
      script.id = 'sticitt-pay-sdk';
      script.setAttribute('data-client-id', 'webbieshop-app'); // Replace <client-id> with your actual client ID
      script.setAttribute('data-client-secret', 'GAWtzPuPKK@JHAC7!Lyb4aFeyRF87qq!9VfFj!mD@nEDMP8VM!ekqtjFd@-Qnf2V'); // Replace <client-secret> with your actual client secret
      script.src = 'https://sdk-test.sticitt.co.za/js/lib/sdk.min.js';

      script.async = true;
      script.onload = () => { 
        window.onPaid = onPaid;
        window.onclose = onClosed;
        window.sticittSDKLoaded = true;
      };
      document.body.appendChild(script);
    }
  }, [onPaid, onClosed]);

  const handleRetry = () => {
    setIsPaid(false);
    setIsCancelled(false);
    window.location.reload();
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      {isPaid ? (
        <Box>
          <Typography variant="body1" gutterBottom>
            Payment was successful! Thank you.
          </Typography>
        </Box>
      ) : isCancelled ? (
        <Box>
          <Typography variant="body1" gutterBottom>
            Payment was cancelled. Please try again.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Retry Payment
          </Button>
        </Box>
      ) : (
        <Box>
          <Button
            size='large'
            className="sticitt-pay-button"
            variant="contained"
            color="secondary"
            data-payment-id={paymentId}
            data-on-paid="onPaid"
            data-on-closed="onClosed"
          >
            Pay with Sticitt
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SticittPayment;
