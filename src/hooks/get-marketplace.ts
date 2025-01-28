import axios from "axios";

export const getCoupons = () => {
  const coupons = axios.get(`/api/marketplace/getAllCoupons`).then((response) => {
    console.log("coupons", response);
    return response.data;
  });

  return coupons;
};
