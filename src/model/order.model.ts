import { Item } from "./Item.model";

export interface Order {
    getItem() : Item
    getPrice(): Number
    getQuantity(): Number,
    getId(): String
}