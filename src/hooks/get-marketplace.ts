import axios from "axios";
import { Item } from "@/context/marketplace";

export const getCoupons = async (): Promise<Item[]> => {
  const response = await axios.get(`/api/marketplace/getAllCoupons`);
  const coupons = response.data.map((coupon: any) => ({
    ...coupon,
    extraDetails:
      typeof coupon.extraDetails === "string"
        ? JSON.parse(coupon.extraDetails)
        : coupon.extraDetails,
  }));

  return coupons;
};
