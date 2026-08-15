export const store = {
  company: {
    name: "Northstar Clothing Co.",
    tagline: "Dress for your direction.",
    returnWindowDays: 30,
    supportEmail: "support@northstarclothing.example"
  },
  orders: {
    "NS-1001": {
      status: "Shipped",
      carrier: "FedEx",
      trackingNumber: "12345",
      estimatedDelivery: "tomorrow",
      message: "Your order has shipped via FedEx and is expected to arrive tomorrow."
    },
    "NS-1002": {
      status: "Processing",
      carrier: null,
      trackingNumber: null,
      estimatedDelivery: "in 2 days",
      message: "Your order is currently being processed in our warehouse and is expected to ship in 2 days."
    },
    "NS-1003": {
      status: "In Transit",
      carrier: null,
      trackingNumber: null,
      estimatedDelivery: null,
      message: "Your order was found and the package is currently in transit."
    },
    "NS-1004": {
      status: "In Transit",
      carrier: null,
      trackingNumber: null,
      estimatedDelivery: null,
      message: "Your order was found and the package is currently in transit."
    },
    "NS-1005": {
      status: "In Transit",
      carrier: null,
      trackingNumber: null,
      estimatedDelivery: null,
      message: "Your order was found and the package is currently in transit."
    }
  },
  products: [
    {
      id: "NS-P001",
      name: "The Essential Linen Set",
      category: "Women",
      price: 89,
      currency: "USD",
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: { XS: 3, S: 8, M: 12, L: 6, XL: 2 },
      restockDate: null
    },
    {
      id: "NS-P002",
      name: "The Signature Overshirt",
      category: "Men",
      price: 105,
      currency: "USD",
      sizes: ["S", "M", "L", "XL", "XXL"],
      stock: { S: 4, M: 9, L: 7, XL: 3, XXL: 1 },
      restockDate: null
    },
    {
      id: "NS-P003",
      name: "The Silk Evening Dress",
      category: "Women",
      price: 149,
      currency: "USD",
      sizes: ["XS", "S", "M", "L"],
      stock: { XS: 2, S: 5, M: 4, L: 0 },
      restockDate: "2026-09-01"
    },
    {
      id: "NS-P004",
      name: "The Classic Cotton Tee",
      category: "Essentials",
      price: 39,
      currency: "USD",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      stock: { XS: 10, S: 18, M: 24, L: 16, XL: 8, XXL: 3 },
      restockDate: null
    }
  ],
  returns: {
    eligibleWithinDays: 30,
    policy: "Items are eligible for return within 30 days of delivery when they are unworn, unused, and in their original condition.",
    withinWindow: "Yes — your order may be eligible for a return and full refund, provided it meets our return conditions.",
    outsideWindow: "Orders outside the 30-day return window are generally not eligible for a standard refund. Store credit may be available depending on the item's condition — please check with a support agent."
  }
};
