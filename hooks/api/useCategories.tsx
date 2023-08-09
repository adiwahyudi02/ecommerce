import useSWR from 'swr';
import { axiosInstance } from '@/utils/helper/axios';

interface ICategoriesParams {
    url: string;
    limit?: number;
    page?: number;
    search?: string;
}

const getCategories = async ({ url, limit, page, search }: ICategoriesParams): Promise<string[]> => {
    try {
        const params = {
            ...(!!page && { _page: page }),
            ...(!!limit && { _limit: limit }),
            ...(!!search && { title_like: search }),
            ...(!!search && { title_like: search })
        };

        const { data } = await axiosInstance.get(url, { params });
        return data;

    } catch (error) {
        throw error;
    }
}

export const useCategories = (params?: Omit<ICategoriesParams, 'url'>) => {
    const { data, isLoading } = useSWR({ url: '/categories', ...params }, getCategories);

    return {
        data,
        isLoading,
    }
}