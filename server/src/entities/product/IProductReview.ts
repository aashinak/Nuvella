export default interface IProductReview {
  _id?: string;
  userId: string;
  productId: string;
  images?: string[];
  review: string;
  rating: number;
}
