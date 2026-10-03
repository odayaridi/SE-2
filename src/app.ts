export interface Order {
  id: number;
  item: string;
  price: number;
}

export class ItemValidator {
  private readonly possibleItems = ["Sponge", "Chocolate", "Fruit", "Red Velvet"];

  getPossibleItems(): string[] {
    return [...this.possibleItems];
  }

  validate(order: Order): void {
    if (!this.possibleItems.includes(order.item)) throw new Error(`Unsupported item: ${order.item}`);
  }
}

export class PriceValidator {
  validate(order: Order): void {
    if (!Number.isFinite(order.price) || order.price <= 0) throw new Error("Price must be greater than zero.");
  }
}

export class MaxPriceValidator {
  validate(order: Order): void {
    if (order.price > 100) throw new Error("Price must not exceed 100.");
  }
}

export class Validator {
  private readonly validators = [new ItemValidator(), new PriceValidator(), new MaxPriceValidator()];

  validate(order: Order): void {
    this.validators.forEach((validator) => validator.validate(order));
  }
}

export class FinanceCalculator {
  getRevenue(orders: Order[]): number {
    return orders.reduce((total, order) => total + order.price, 0);
  }

  getAverageBuyPower(orders: Order[]): number {
    return orders.length ? this.getRevenue(orders) / orders.length : 0;
  }
}

export class OrderManagement {
  protected readonly orders: Order[] = [];
  private nextId = 1;

  constructor(
    protected readonly validator: Validator,
    protected readonly calculator: FinanceCalculator,
  ) {}

  addOrder(item: string, price: number): Order {
    const order = { id: this.nextId, item, price };
    this.validator.validate(order);
    this.orders.push(order);
    this.nextId += 1;
    return order;
  }

  getOrder(id: number): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  getTotalRevenue(): number {
    return this.calculator.getRevenue(this.orders);
  }

  getBuyPower(): number {
    return this.calculator.getAverageBuyPower(this.orders);
  }
}

export class PremiumOrderManagement extends OrderManagement {}
