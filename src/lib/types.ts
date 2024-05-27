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