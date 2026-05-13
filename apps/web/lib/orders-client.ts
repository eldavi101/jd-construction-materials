import { authorizedApiRequest } from "@/lib/auth-client";

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  subtotalAmount: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    totalAmount: string;
    product: {
      id: string;
      name: string;
      sku: string;
      slug: string;
    };
  }[];
};

export function fetchMyOrders() {
  return authorizedApiRequest<CustomerOrder[]>("/orders", {
    method: "GET",
  });
}

export function updateAdminOrderStatus(
  orderId: string,
  status: "PROCESSING" | "SHIPPED" | "DELIVERED",
) {
  return authorizedApiRequest<CustomerOrder>(`/orders/${orderId}/admin-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
