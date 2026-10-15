import { Item, ItemCategory } from "./Item.model";

export class Toy implements Item {
  constructor(
    private readonly type: string,
    private readonly ageGroup: string,
    private readonly brand: string,
    private readonly material: string,
    private readonly batteryRequired: boolean,
    private readonly educational: boolean,
  ) {}

  getCategory(): ItemCategory {
    return ItemCategory.TOY;
  }

  getType(): string {
    return this.type;
  }

  getAgeGroup(): string {
    return this.ageGroup;
  }

  getBrand(): string {
    return this.brand;
  }

  getMaterial(): string {
    return this.material;
  }

  isBatteryRequired(): boolean {
    return this.batteryRequired;
  }

  isEducational(): boolean {
    return this.educational;
  }
}
