import { Item, ItemCategory } from "./Item.model";

export class Book implements Item {
  constructor(
    private readonly title: string,
    private readonly author: string,
    private readonly genre: string,
    private readonly format: string,
    private readonly language: string,
    private readonly publisher: string,
    private readonly specialEdition: string,
    private readonly packaging: string,
  ) {}

  getCategory(): ItemCategory {
    return ItemCategory.BOOK;
  }

  getTitle(): string {
    return this.title;
  }

  getAuthor(): string {
    return this.author;
  }

  getGenre(): string {
    return this.genre;
  }

  getFormat(): string {
    return this.format;
  }

  getLanguage(): string {
    return this.language;
  }

  getPublisher(): string {
    return this.publisher;
  }

  getSpecialEdition(): string {
    return this.specialEdition;
  }

  getPackaging(): string {
    return this.packaging;
  }
}
