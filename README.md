# FoodGo

FoodGo is a food ordering website where customers can browse meals, open a dish, manage a cart, and place a delivery order. An admin area covers the menu, categories, and order status. This phase is a frontend prototype: data lives in the browser, and nothing is saved to a database.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React
- Lucide React

## Current Status

Frontend development phase.

The interface uses mock data and local browser state. Authentication, payments, and a server API are not connected.

## Features

Customer pages:

- Home, with categories, popular dishes, a promotion, and delivery highlights
- Menu, with search, category filters, and sorting
- Food details, with quantity and related dishes
- Cart, with quantity changes, removal, delivery fee, and total
- Checkout, with customer details, a promo code, and a payment-method preview
- Orders, with status badges and order details
- About and a login screen prepared for a later authentication phase

Admin pages:

- Dashboard with order, revenue, customer, and menu counts
- Food management with add, edit, and delete
- Category management with add, edit, and delete
- Order management with search, status filters, and status updates
- Customer list and store settings

Placing an order, editing the menu, and changing a status all stay on this device until the page data is reset from Admin settings.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The admin board is at [http://localhost:3000/admin](http://localhost:3000/admin).

Use the checkout code `FIRST20` to preview 20% off the food subtotal.
