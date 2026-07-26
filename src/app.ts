// import logger from './util/logger'

// export interface Order{
//     price:number,
//     id:number,
//     item:string
// }

// export class OrderManagement{
//     // get orders, store orders, and add orders
//     private orders: Order[] = [];
//     constructor(private validator : IValidator, private calculator : ICalculator){
//         logger.debug("Order Management instance created")
//     }
//     getOrders(){
//         return this.orders;
//     }
//     addOrder(item:string,price:number){
//         const order: Order = {id: this.orders.length + 1,item, price};
//         this.validator.validate(order);
//         this.orders.push(order);
//     }
//     getOrder(id:number){
//         return this.getOrders().find(order => order.id === id);
//     }

//     getTotalRevenue() {
//         return this.calculator.getRevenue(this.orders);
//     }

//     getBuyPower(){
//         return this.calculator.getAverageBuyPower(this.orders);
//     }
// }

// export class PremiumOrderManagement extends OrderManagement {
//     getOrder(id:number) : Order | undefined {
//         console.log("Alert: Premium order being fetched");
//         return super.getOrder(id);
//     }
// }


// interface IValidator{
//     validate(order: Order) : void;
// }

// interface IPossibleItems {
//     getPossibleItems() : string[];
// }

// export class Validator implements IValidator {
//   private rules: IValidator[] = [
//     new PriceValidator(),
//     new MaxPriceValidator(),
//     new ItemValidator()
//   ];

//   validate(order: Order): void {
//     this.rules.forEach(rule => rule.validate(order));
//   }
// }

// export class ItemValidator implements IValidator, IPossibleItems {
//   private static possibleItems = [
//     "Sponge",
//     "Chocolate",
//     "Fruit",
//     "Red Velvet",
//     "Birthday",
//     "Carrot",
//     "Marble",
//     "Coffee",
//   ];

//   getPossibleItems(): string[] {
//       return ItemValidator.possibleItems;
//   }
//   validate(order: Order) {
//     if (!ItemValidator.possibleItems.includes(order.item)) {
//       throw new Error(
//         `Invalid item. Must be one of: ${ItemValidator.possibleItems.join(", ")}`
//       );
//     }
//   }
// }
// export class PriceValidator implements IValidator {
//          validate(order: Order){
//         if(order.price <= 0){
//             throw new Error("Price must be greater than zero");
//         }
//     }
// }
// export class MaxPriceValidator implements IValidator{
//     validate(order : Order){
//         if(order.price > 100){
//             throw new Error("Price must be less than 100");
//         }
//     }
// }


// interface ICalculator {
//     getRevenue(orders: Order[]): number;
//     getAverageBuyPower(orders: Order[]): number;
// }
// export class FinanceCalculator implements ICalculator{
//   public   getRevenue(orders: Order[]){
//         return  orders.reduce((total, order) => total + order.price, 0);
//     }

//       // calculate total revenue and average by power
//    public  getAverageBuyPower(orders: Order[]){
//         return orders.length === 0 ? 0: this.getRevenue(orders)/orders.length;
//     }
  
// }


import logger from "./util/logger";

export interface Order {
    price: number;
    id: number;
    item: string;
}

export class OrderManagement {
    private orders: Order[] = [];

    constructor(
        private validator: IValidator,
        private calculator: ICalculator
    ) {
        logger.debug("Order Management instance created");
    }

    getOrders() {
        logger.debug("Fetching all orders");
        return this.orders;
    }

    addOrder(item: string, price: number) {
        const order: Order = {
            id: this.orders.length + 1,
            item,
            price
        };

        try {
            logger.info(`Adding new order: ${item}, price: ${price}`);

            this.validator.validate(order);

            this.orders.push(order);

            logger.info(`Order added successfully. ID: ${order.id}`);

        } catch (error) {
            logger.error(
                `Failed to add order ${item}: ${(error as Error).message}`
            );

            throw error;
        }
    }

    getOrder(id: number) {
        logger.debug(`Searching for order with ID: ${id}`);

        const order = this.orders.find(order => order.id === id);

        if (!order) {
            logger.warn(`Order with ID ${id} not found`);
        } else {
            logger.info(`Order found: ${order.item}`);
        }

        return order;
    }


    getTotalRevenue() {
        const revenue = this.calculator.getRevenue(this.orders);

        logger.info(`Total revenue calculated: ${revenue}`);

        return revenue;
    }


    getBuyPower() {
        const average = this.calculator.getAverageBuyPower(this.orders);

        logger.info(`Average buy power calculated: ${average}`);

        return average;
    }
}


export class PremiumOrderManagement extends OrderManagement {

    getOrder(id: number): Order | undefined {

        logger.info(`Premium order fetching ID: ${id}`);

        return super.getOrder(id);
    }
}



interface IValidator {
    validate(order: Order): void;
}


interface IPossibleItems {
    getPossibleItems(): string[];
}



export class Validator implements IValidator {

    private rules: IValidator[] = [
        new PriceValidator(),
        new MaxPriceValidator(),
        new ItemValidator()
    ];


    validate(order: Order): void {

        logger.debug(`Running validators for ${order.item}`);

        this.rules.forEach(rule => {
            rule.validate(order);
        });

        logger.debug(`Validation passed for ${order.item}`);
    }
}



export class ItemValidator implements IValidator, IPossibleItems {


    private static possibleItems = [
        "Sponge",
        "Chocolate",
        "Fruit",
        "Red Velvet",
        "Birthday",
        "Carrot",
        "Marble",
        "Coffee",
    ];


    getPossibleItems(): string[] {
        return ItemValidator.possibleItems;
    }


    validate(order: Order) {

        if (!ItemValidator.possibleItems.includes(order.item)) {

            logger.error(`Invalid item: ${order.item}`);

            throw new Error(
                `Invalid item. Must be one of: ${ItemValidator.possibleItems.join(", ")}`
            );
        }

        logger.debug(`Item validation passed: ${order.item}`);
    }
}



export class PriceValidator implements IValidator {

    validate(order: Order) {

        if (order.price <= 0) {

            logger.error(
                `Invalid price for ${order.item}: ${order.price}`
            );

            throw new Error("Price must be greater than zero");
        }

        logger.debug(`Price validation passed: ${order.price}`);
    }
}



export class MaxPriceValidator implements IValidator {

    validate(order: Order) {

        if (order.price > 100) {

            logger.error(
                `Price too high for ${order.item}: ${order.price}`
            );

            throw new Error("Price must be less than 100");
        }

        logger.debug(`Max price validation passed`);
    }
}




interface ICalculator {

    getRevenue(orders: Order[]): number;

    getAverageBuyPower(orders: Order[]): number;
}



export class FinanceCalculator implements ICalculator {


    public getRevenue(orders: Order[]) {

        const revenue = orders.reduce(
            (total, order) => total + order.price,
            0
        );

        logger.debug(`Revenue calculated: ${revenue}`);

        return revenue;
    }



    public getAverageBuyPower(orders: Order[]) {

        const average = orders.length === 0
            ? 0
            : this.getRevenue(orders) / orders.length;


        logger.debug(`Average buy power calculated: ${average}`);

        return average;
    }

}