export type CategoryIcon =
  | "beef"
  | "pizza"
  | "drumstick"
  | "soup"
  | "cup-soda"
  | "cake"
  | "utensils";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: CategoryIcon;
  image: string;
};

export type Food = {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  image: string;
  available: boolean;
  popular: boolean;
  prepMinutes: number;
  highlights: string[];
};

export type CartItem = {
  foodId: string;
  quantity: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedAt: string;
  orderCount: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash" | "card";

export type OrderItem = {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal?: number;
  image: string;
};

export type Order = {
  id: string;
  code: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  customer?: {
    id: string | null;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  totalPrice?: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  promoCode: string | null;
  orderDate?: string;
  createdAt: string;
};

export type StoreSettings = {
  deliveryFee: number;
  freeDeliveryThreshold: number;
  phone: string;
  email: string;
  address: string;
};
