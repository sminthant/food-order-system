import type { StoreSettings } from "@/types";

export const defaultSettings: StoreSettings = {
  deliveryFee: 35,
  freeDeliveryThreshold: 400,
  phone: "02-123-4567",
  email: "hello@foodgo.example",
  address: "18 Charoen Krung Road, Bangkok 10500",
};

export const shopLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "Orders" },
  { href: "/about", label: "About" },
] as const;

export const features = [
  {
    title: "Fast Delivery",
    description: "Hot meals leave the kitchen quickly and arrive in about 30 minutes.",
    icon: "bike" as const,
  },
  {
    title: "Fresh Food",
    description: "Dishes are cooked to order, with ingredients we would serve at our own table.",
    icon: "leaf" as const,
  },
  {
    title: "Easy Ordering",
    description: "Browse the menu, choose a quantity, and checkout without the clutter.",
    icon: "smartphone" as const,
  },
  {
    title: "Secure Payment",
    description: "Pay on delivery or enter a card at checkout. This preview does not charge anything.",
    icon: "shield" as const,
  },
];

export const galleryImages = [
  "/images/burger-classic.jpg",
  "/images/burger-smash.jpg",
  "/images/burger-chicken.jpg",
  "/images/pizza-margherita.jpg",
  "/images/pizza-pepperoni.jpg",
  "/images/pizza-bbq.jpg",
  "/images/chicken-fried.jpg",
  "/images/chicken-wings.jpg",
  "/images/chicken-rice.jpg",
  "/images/chicken-parmesan.jpg",
  "/images/ramen.jpg",
  "/images/pad-thai.jpg",
  "/images/sushi.jpg",
  "/images/thai-tea.jpg",
  "/images/lime-soda.jpg",
  "/images/iced-coffee.jpg",
  "/images/fries.jpg",
  "/images/onion-rings.jpg",
  "/images/lava-cake.jpg",
  "/images/cheesecake.jpg",
  "/images/ice-cream.jpg",
  "/images/hero.jpg",
];
