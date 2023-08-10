import useSWR from 'swr';
import { axiosInstance } from '@/utils/helper/axios';
import { Key, SortOrder } from 'antd/es/table/interface';
import { ICart } from '@/utils/type/carts';

interface ICartResponse {
    carts: ICart[];
    total: number;
}

interface ICartParams {
    url: string;
    limit?: number | string;
    page?: number | string;
    sortDirection?: SortOrder | undefined;
    sortField?: Key | readonly Key[] | undefined;
    search?: string | null;
}

const getCarts = async ({
    url,
    limit,
    page,
    sortDirection,
    sortField,
    search,
}: ICartParams): Promise<ICartResponse> => {
    try {
        const params = {
            ...(!!page && { _page: page }),
            ...(!!limit && { _limit: limit }),
            ...(!!sortDirection && {
                _order: sortDirection === 'ascend' ? 'asc' : 'desc',
                _sort: sortField,
            }),
            ...(!!search && { userName_like: search }),
        };
        const { data, headers } = await axiosInstance.get(url, { params });

        return {
            carts: data,
            total: Number(headers["x-total-count"]),
        };
    } catch (error) {
        throw error;
    }
}

export const useCarts = (params?: Omit<ICartParams, 'url'>) => {
    const { data, isLoading } = useSWR({ url: '/carts', ...params }, getCarts);

    return {
        data,
        isLoading,
    }
}