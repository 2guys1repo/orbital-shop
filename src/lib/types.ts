export type ProductType = {
  id: number;
  title: string;
  description: string;
  price: number; // TODO float??
  imagePath: string;
  sellerId: string;
}

export type UserType = {
  id: number;
  name: string;
  email: string;
}

// Different types of a seller
export enum SellerType {
  NEW = "NEW",
  EXPERIENCED = "EXPERIENCED",
  SUSPENDED = "SUSPENDED",
}

// Different roles of a user
export enum UserRole {
  SELLER = "SELLER",
  BUYER = "BUYER",
  MIDDLEMAN = "MIDDLEMAN",
  ADMIN = "ADMIN",
  BASIC = "BASIC",
}