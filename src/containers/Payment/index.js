import { authRouteConstants } from "constants/routeConstants";
import { useEffect } from "react";
import { updateUserDetail } from "utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import SticittPayment from "components/Payment/SticittPayment";
import { PayButton } from "views/Checkout";

const Payment = () => {
  const { payment_id, orderId } = useParams();
  return (
    <div>
      <SticittPayment  paymentId={payment_id} orderId={orderId}/>
      <PayButton  paymentId={payment_id} orderId={orderId}/>
    </div>
  );
};

export default Payment;
