export interface IProductCart {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedPrice: number;
}

export interface ICart {
    id: number;
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
    products: IProductCart[];
    userName: string;
    date: string;
}