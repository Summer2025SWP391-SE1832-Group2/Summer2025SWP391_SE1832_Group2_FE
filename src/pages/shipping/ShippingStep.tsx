import type { Shipping } from "@/types/shipping";
import { CheckCircle, Circle } from "lucide-react";

interface ShippingStepProps {
  shippingList: Shipping[];
}

export default function ShippingStep({ shippingList }: ShippingStepProps) {
  // const status = shippingList[0]?.status;

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
      <div className="flex-1 flex items-center">
        <div className="flex flex-col items-center text-center">
          {(shippingList[0]?.status === 'Đã giao hàng') ? (
            <CheckCircle className="text-green-500 w-6 h-6" />
          ) : (
            <Circle className="text-blue-500 w-6 h-6" />
          )}
          <span className="text-sm mt-1 text-blue-600 font-semibold">
            Chờ giao hàng
          </span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-300 mx-2 relative top-3">
          <div
            className={`absolute h-0.5 ${
                shippingList[0]?.status === 'Đã giao hàng' ? 'bg-green-500' : 'bg-gray-300'
            } left-0 top-0 w-full`}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center">
        <div className="flex flex-col items-center text-center">
          {(shippingList[1]?.status === 'Đã giao hàng') ? (
            <CheckCircle className="text-green-500 w-6 h-6" />
          ) : (
            <Circle className="text-gray-400 w-6 h-6" />
          )}
          <span className={`text-sm mt-1 ${
            shippingList[1]?.status === 'Đã giao hàng' ? 'text-green-600 font-semibold' : 'text-gray-500'
          }`}>
            Đã giao hàng
          </span>
        </div>
      </div>
    </div>
  );
}
