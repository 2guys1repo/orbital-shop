export type ProductType = {
  id: number;
  title: string;
  description: string;
  price: number; // TODO float??
  imagePath: string;
  // quantity: number;
  sellerId: string;
  createdAt: Date;
}

export type UserType = {
  id: number;
  name: string;
  email: string;
}

export type ReportType = {
  reportId: number;
  productId: number;
  reason: string;
  description: string;
  createdAt: Date;
}

// Different types of a seller
export enum SellerType {
  NEW = "NEW",
  EXPERIENCED = "EXPERIENCED",
  SUSPENDED = "SUSPENDED",
}

// Different roles of a user
export const UserRole: {
  SELLER: "SELLER",
  BUYER: "BUYER",
  MIDDLEMAN: "MIDDLEMAN",
  ADMIN: "ADMIN",
  BASIC: "BASIC",
} = {
  SELLER: "SELLER",
  BUYER: "BUYER",
  MIDDLEMAN: "MIDDLEMAN",
  ADMIN: "ADMIN",
  BASIC: "BASIC",
}
export type UserRole = typeof UserRole[keyof typeof UserRole]