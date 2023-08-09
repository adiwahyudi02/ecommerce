import useSWR from 'swr';
import { axiosInstance } from '@/utils/helper/axios';
import { IProduct } from '@/utils/type/product';
import { Key, SortOrder } from 'antd/es/table/interface';

interface IProductResponse {
    products: IProduct[];
    total: number;
}

interface IProductParams {
    url: string;
    limit?: number;
    page?: number;
    search?: string;
    categorieFilter?: string;
    minPriceFilter?: number | null,
    maxPriceFilter?: number | null,
    brandFilter?: string;
    productFilter?: string;
    sortDirection?: SortOrder | undefined;
    sortField?: Key | readonly Key[] | undefined,
}

const getProducts = async ({
    url,
    limit,
    page,
    search,
    categorieFilter,
    minPriceFilter,
    maxPriceFilter,
    brandFilter,
    productFilter,
    sortDirection,
    sortField,
}: IProductParams): Promise<IProductResponse> => {
    try {
        const params = {
            ...(!!page && { _page: page }),
            ...(!!limit && { _limit: limit }),
            ...(!!search && { title_like: search }),
            ...(!!categorieFilter && { category: categorieFilter }),
            ...(!!minPriceFilter && { price_gte: minPriceFilter }),
            ...(!!maxPriceFilter && { price_lte: maxPriceFilter }),
            ...(!!brandFilter && { brand: brandFilter }),
            ...(!!productFilter && { title: productFilter }),
            ...(!!sortDirection && {
                _order: sortDirection === 'ascend' ? 'asc' : 'desc',
                _sort: sortField,
            }),
        };
        const { data, headers } = await axiosInstance.get(url, { params });

        return {
            products: data,
            total: Number(headers["x-total-count"]),
        };
    } catch (error) {
        throw error;
    }
}

export const useProducts = (params?: Omit<IProductParams, 'url'>) => {
    const { data, isLoading } = useSWR({ url: '/products', ...params }, getProducts);

    return {
        data,
        isLoading,
    }
}