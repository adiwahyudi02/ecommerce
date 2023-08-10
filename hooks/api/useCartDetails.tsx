import { axiosInstance } from '@/utils/helper/axios';
import { ICart } from '@/utils/type/carts';
import useSWR from 'swr';

const getCarts = async (url: string): Promise<ICart> => {
    try {
        const { data } = await axiosInstance.get(url);
        return data;
    } catch (error) {
        throw error;
    }
}

export const useCartDetails = (id: string | number) => {
    const { data, isLoading } = useSWR(`/carts/${id}`, getCarts);

    return {
        data,
        isLoading,
    }
}