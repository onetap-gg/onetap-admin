import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export interface Coupon {
  id: number;
  coupon_id: number;
  coupon_name: string;
  game_id: number;
  description: string;
  points_to_redeem: number;
}

export interface CouponContextState {
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
}

const defaultState: CouponContextState = {
  coupons: [],
  setCoupons: () => {},
};

const defaultCoupon = {
  id: 0,
  coupon_id: 0,
  coupon_name: "",
  game_id: 0,
  description: "",
  points_to_redeem: 0,
};

const CouponsContext = createContext<CouponContextState>(defaultState);

interface CouponsProviderProps {
  children: ReactNode;
}

export const CouponsProvider: React.FC<CouponsProviderProps> = ({
  children,
}) => {
  const [coupons, setCoupons] = useState<Coupon[]>([defaultCoupon]);

  const contextValue = useMemo(
    () => ({
      coupons,
      setCoupons,
    }),
    [coupons]
  );

  return (
    <CouponsContext.Provider value={contextValue}>
      {children}
    </CouponsContext.Provider>
  );
};

export const useCoupons = () => useContext(CouponsContext);
