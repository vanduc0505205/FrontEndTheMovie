import { useMemo } from "react";
import { ISeat } from "@/interface/seat";
import { IDiscount } from "@/interface/discount";

interface PricingProps {
  seats: ISeat[];
  discount?: IDiscount | null;
}

export const useCheckoutPricing = ({ seats, discount }: PricingProps) => {
  const TICKET_PRICE = {
    NORMAL: 100000,
    VIP: 150000,
  };
  const SERVICE_FEE = 10000; // phí dịch vụ / vé

  const { subtotal, discountAmount, total } = useMemo(() => {
    let subtotal = seats.reduce((acc, seat) => {
      const price = seat.type === "VIP" ? TICKET_PRICE.VIP : TICKET_PRICE.NORMAL;
      return acc + price;
    }, 0);

    let serviceFee = seats.length * SERVICE_FEE;
    let discountAmount = 0;

    if (discount) {
      discountAmount = discount.value;
    }

    let total = subtotal + serviceFee - discountAmount;
    if (total < 0) total = 0;

    return { subtotal, discountAmount, total };
  }, [seats, discount]);

  return { subtotal, discountAmount, total, SERVICE_FEE, TICKET_PRICE };
};
