import {
  FinanceCalculator,
  OrderManagement,
  PremiumOrderManagement,
  Validator,
  ItemValidator,
  PriceValidator,
  MaxPriceValidator,
} from "../src/app";

describe("OrderManagement", () => {
  it("should get an order by id", () => {
    const validator = new Validator();
    const calc = new FinanceCalculator();
    const orderManager = new OrderManagement(validator, calc);

    orderManager.addOrder("Sponge", 15);

    expect(orderManager.getOrder(1)).toEqual({
      id: 1,
      item: "Sponge",
      price: 15,
    });
  });

  it("should calculate total revenue", () => {
    const validator = new Validator();
    const calc = new FinanceCalculator();
    const orderManager = new OrderManagement(validator, calc);

    orderManager.addOrder("Sponge", 15);
    orderManager.addOrder("Chocolate", 25);

    expect(orderManager.getTotalRevenue()).toBe(40);
  });

  it("should calculate average buy power", () => {
    const validator = new Validator();
    const calc = new FinanceCalculator();
    const orderManager = new OrderManagement(validator, calc);

    orderManager.addOrder("Sponge", 20);
    orderManager.addOrder("Chocolate", 40);

    expect(orderManager.getBuyPower()).toBe(30);
  });
});

describe("PremiumOrderManagement", () => {
  it("should fetch an order", () => {
    const validator = new Validator();
    const calc = new FinanceCalculator();
    const manager = new PremiumOrderManagement(validator, calc);

    manager.addOrder("Sponge", 15);

    expect(manager.getOrder(1)).toEqual({
      id: 1,
      item: "Sponge",
      price: 15,
    });
  });
});

describe("ItemValidator", () => {
  it("should return possible items", () => {
    const validator = new ItemValidator();

    expect(validator.getPossibleItems()).toContain("Sponge");
  });
});

describe("PriceValidator", () => {
  it("should throw if price is zero", () => {
    const validator = new PriceValidator();

    expect(() =>
      validator.validate({
        id: 1,
        item: "Sponge",
        price: 0,
      })
    ).toThrow();
  });
});

describe("MaxPriceValidator", () => {
  it("should throw if price is greater than 100", () => {
    const validator = new MaxPriceValidator();

    expect(() =>
      validator.validate({
        id: 1,
        item: "Sponge",
        price: 101,
      })
    ).toThrow();
  });
});

describe("FinanceCalculator", () => {
  it("should calculate revenue", () => {
    const calc = new FinanceCalculator();

    expect(
      calc.getRevenue([
        { id: 1, item: "Sponge", price: 10 },
        { id: 2, item: "Chocolate", price: 20 },
      ])
    ).toBe(30);
  });

  it("should calculate average buy power", () => {
    const calc = new FinanceCalculator();

    expect(
      calc.getAverageBuyPower([
        { id: 1, item: "Sponge", price: 10 },
        { id: 2, item: "Chocolate", price: 20 },
      ])
    ).toBe(15);
  });
});