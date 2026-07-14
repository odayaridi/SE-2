import {
    FinanceCalculator,
    ItemValidator,
    MaxPriceValidator,
    OrderManagement,
    PriceValidator,
    Validator
} from "./app";

const orders = [
  { id: 1, item: "Sponge", price: 15 },
  { id: 2, item: "Chocolate", price: 20 },
  { id: 3, item: "Fruit", price: 18 },
  { id: 4, item: "Red Velvet", price: 25 },
  { id: 5, item: "Coffee", price: 0 },
];

const rules = [
  new PriceValidator(),
  new MaxPriceValidator(),
  new ItemValidator()
];

const orderManager = new OrderManagement(new Validator(), new FinanceCalculator());

for (const order of orders) {
  orderManager.addOrder(order.item, order.price);
}

// Adding a new order directly
const newItem = "Marble";
const newPrice = 22;

orderManager.addOrder(newItem, newPrice);

console.log("Orders after adding a new order", orderManager.getOrders());

// Calculate Total Revenue directly
console.log("Total Revenue: ", orderManager.getTotalRevenue());

// Calculate Average Buy Power directly
console.log("Average Buy Power:", orderManager.getBuyPower());

// Fetching an order directly
const fetchId = 2;
const fetchedOrder = orderManager.getOrder(fetchId);
console.log("Order with ID 2:", fetchedOrder);

// Attempt to fetch a non-existent order
const nonExistentId = 10;
const nonExistentOrder = orderManager.getOrder(nonExistentId);
console.log("Order with ID 10 (non-existent):", nonExistentOrder);