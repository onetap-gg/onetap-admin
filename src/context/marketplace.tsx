import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export interface Item {
  id: number;
  itemName: string;
  itemType: string;
  itemValue: string[];
  extraDetails: {
    description: string;
    points_to_redeem: number;
    number_of_coupons: number;
  };
  gameId: number;
  archived: boolean;
}

export interface CouponContextState {
  coupons: Item[];
  setCoupons: (coupons: Item[]) => void;
}

const defaultState: CouponContextState = {
  coupons: [],
  setCoupons: () => {},
};

const defaultCoupon = {
  id: 0,
  itemName: "",
  itemType: "",
  itemValue: [""],
  extraDetails: {
    description: "",
    points_to_redeem: 0,
    number_of_coupons: 1,
  },
  gameId: 0,
  archived: false
};

const CouponsContext = createContext<CouponContextState>(defaultState);

interface CouponsProviderProps {
  children: ReactNode;
}

export const CouponsProvider: React.FC<CouponsProviderProps> = ({
  children,
}) => {
  const [coupons, setCoupons] = useState<Item[]>([defaultCoupon]);

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
