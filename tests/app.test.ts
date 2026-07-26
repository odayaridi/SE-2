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
  let validator: Validator;
  let calc: FinanceCalculator;
  let orderManager: OrderManagement;

  beforeAll(() => {
    validator = new Validator();
    calc = new FinanceCalculator();
  });

  beforeEach(() => {
    orderManager = new OrderManagement(validator, calc);
  });

  it("should get an order by id", () => {
    orderManager.addOrder("Sponge", 15);

    expect(orderManager.getOrder(1)).toEqual({
      id: 1,
      item: "Sponge",
      price: 15,
    });
  });

  it("should calculate total revenue", () => {
    orderManager.addOrder("Sponge", 15);
    orderManager.addOrder("Chocolate", 25);

    expect(orderManager.getTotalRevenue()).toBe(40);
  });

  it("should calculate average buy power", () => {
    orderManager.addOrder("Sponge", 20);
    orderManager.addOrder("Chocolate", 40);

    expect(orderManager.getBuyPower()).toBe(30);
  });
});

describe("PremiumOrderManagement", () => {
  let validator: Validator;
  let calc: FinanceCalculator;
  let manager: PremiumOrderManagement;

  beforeAll(() => {
    validator = new Validator();
    calc = new FinanceCalculator();
  });

  beforeEach(() => {
    manager = new PremiumOrderManagement(validator, calc);
  });

  it("should fetch an order", () => {
    manager.addOrder("Sponge", 15);

    expect(manager.getOrder(1)).toEqual({
      id: 1,
      item: "Sponge",
      price: 15,
    });
  });
});

describe("ItemValidator", () => {
  let validator: ItemValidator;

  beforeEach(() => {
    validator = new ItemValidator();
  });

  it("should return possible items", () => {
    expect(validator.getPossibleItems()).toContain("Sponge");
  });
});

describe("PriceValidator", () => {
  let validator: PriceValidator;

  beforeEach(() => {
    validator = new PriceValidator();
  });

  it("should throw if price is zero", () => {
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
  let validator: MaxPriceValidator;

  beforeEach(() => {
    validator = new MaxPriceValidator();
  });

  it("should throw if price is greater than 100", () => {
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
  let calc: FinanceCalculator;

  beforeEach(() => {
    calc = new FinanceCalculator();
  });

  it("should calculate revenue", () => {
    expect(
      calc.getRevenue([
        { id: 1, item: "Sponge", price: 10 },
        { id: 2, item: "Chocolate", price: 20 },
      ])
    ).toBe(30);
  });

  it("should calculate average buy power", () => {
    expect(
      calc.getAverageBuyPower([
        { id: 1, item: "Sponge", price: 10 },
        { id: 2, item: "Chocolate", price: 20 },
      ])
    ).toBe(15);
  });
});