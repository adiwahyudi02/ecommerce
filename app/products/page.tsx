'use client'

import { useCategories } from '@/hooks/api/useCategories';
import { useProducts } from '@/hooks/api/useProducts';
import { IProduct } from '@/utils/type/product';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Table, Pagination, Card, Select, InputNumber } from 'antd';
import { Input } from 'antd';
import type { PaginationProps, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Key, SortOrder, SorterResult } from 'antd/es/table/interface';
import { useMemo, useState, useCallback } from 'react';
import { ExpandItem } from '@/components/Table/ExpandItem';
import { FormGroup } from '@/components/Form/FormGroup';
import { Label } from '@/components/Form/Label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryParam } from '@/hooks/useQueryParam';

const columns: ColumnsType<IProduct> = [
    {
        title: 'Product Name',
        dataIndex: 'title',
        key: 'title',
        sorter: true,
    },
    {
        title: 'Brand',
        dataIndex: 'brand',
        key: 'brand',
        sorter: true,
        responsive: ['md'],
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: true,
        responsive: ['md'],
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        sorter: true,
        responsive: ['md'],
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        sorter: true,
        responsive: ['md'],
    },
];

export default function Products() {
    const [sortDirection, setSortDirection] = useState<SortOrder | undefined>();
    const [sortField, setSortField] = useState<Key | readonly Key[] | undefined>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const router = useRouter()
    const pathname = usePathname()
    const { createQueryString, getSearchParams } = useQueryParam();

    const search = getSearchParams('search') ?? undefined;
    const categoryFilter = getSearchParams('category');
    const brandFilter = getSearchParams('brand');
    const productFilter = getSearchParams('product');
    const minPriceFilter = getSearchParams('minPrice');
    const maxPriceFilter = getSearchParams('maxPrice');

    const isMD = useMediaQuery('(min-width: 768px)');

    const { data: products, isLoading } = useProducts({
        page,
        limit,
        search,
        categoryFilter,
        minPriceFilter,
        maxPriceFilter,
        brandFilter,
        productFilter,
        sortDirection,
        sortField,
    });
    const { data: categories, isLoading: isLoadingCategories } = useCategories();
    const { data: allProducts, isLoading: isLoadingAllProduct } = useProducts();

    const categoriesOption = useMemo(() => {
        if (categories?.length) {
            return categories?.map(item => ({
                value: item,
                label: item,
            }));
        } else return []
    }, [categories]);

    const brandsOption = useMemo(() => {
        if (allProducts?.products?.length) {
            const temp: { value: string; label: string }[] = [];

            allProducts?.products?.forEach(item => {
                const findSameBrand = temp.findIndex(object => object.value === item.brand);

                if (findSameBrand === -1) {
                    temp.push({
                        value: item.brand,
                        label: item.brand,
                    });
                }
            });

            return temp;
        } else return []
    }, [allProducts]);

    const productsOption = useMemo(() => {
        if (allProducts?.products?.length) {
            const temp: { value: string; label: string }[] = [];

            allProducts?.products?.forEach(item => {
                const findSameTitle = temp.findIndex(object => object.value === item.title);

                if (findSameTitle === -1) {
                    temp.push({
                        value: item.title,
                        label: item.title,
                    });
                }
            });

            return temp;
        } else return []
    }, [allProducts]);

    const handleReplaceParams = (query: string) => {
        router.replace(pathname + '?' + query, { scroll: false });
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleReplaceParams(createQueryString('search', e.target.value));
    };

    const handleMinPriceFilter = (value: number | null) => {
        handleReplaceParams(createQueryString('minPrice', value?.toString()));
    };

    const handleMaxPriceFilter = (value: number | null) => {
        handleReplaceParams(createQueryString('maxPrice', value?.toString()));
    };

    const handleCategorieFilter = (value: string) => {
        handleReplaceParams(createQueryString('category', value));
    };

    const handleBrandFilter = (value: string) => {
        handleReplaceParams(createQueryString('brand', value));
    };

    const handleProductFilter = (value: string) => {
        handleReplaceParams(createQueryString('product', value));
    };

    const handlePagination: PaginationProps['onChange'] = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleShowSizeChange: PaginationProps['onShowSizeChange'] = (_, pageSize) => {
        setLimit(pageSize);
    };

    const handleSorting = (sorter: SorterResult<IProduct> | SorterResult<IProduct>[]) => {
        setSortDirection((sorter as SorterResult<IProduct>).order);
        setSortField((sorter as SorterResult<IProduct>).field);
    };

    const handleChangeTable: TableProps<IProduct>['onChange'] = (_, __, sorter) => {
        handleSorting(sorter);
    };

    return (
        <section className="flex flex-col gap-6">
            <Card>
                <h1 className="text-xl font-bold mt-5 mb-10 text-indigo-800">
                    Products
                </h1>
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                        <FormGroup>
                            <Label htmlFor="search" text="Search" />
                            <Input
                                id="search"
                                allowClear
                                placeholder="By Product name"
                                value={search}
                                onChange={handleSearch}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="categorieFilter" text="Category" />
                            <Select
                                allowClear
                                showSearch
                                id="categorieFilter"
                                placeholder="Select "
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                onChange={handleCategorieFilter}
                                options={categoriesOption}
                                value={categoryFilter}
                                loading={isLoadingCategories}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="brandFilter" text="Brand" />
                            <Select
                                allowClear
                                showSearch
                                id="brandFilter"
                                placeholder="Select "
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                onChange={handleBrandFilter}
                                options={brandsOption}
                                value={brandFilter}
                                loading={isLoadingAllProduct}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="productFilter" text="Product" />
                            <Select
                                allowClear
                                showSearch
                                id="productFilter"
                                placeholder="Select "
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                onChange={handleProductFilter}
                                options={productsOption}
                                value={productFilter}
                                loading={isLoadingAllProduct}
                            />
                        </FormGroup>
                        <div className="flex gap-4 w-full flex-1">
                            <FormGroup>
                                <Label htmlFor="minPriceFilter" text="Min Price" />
                                <InputNumber
                                    id="minPriceFilter"
                                    min={0}
                                    value={minPriceFilter ? Number(minPriceFilter) : null}
                                    onChange={handleMinPriceFilter}
                                    style={{ width: '100%' }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="maxPriceFilter" text="Max Price" />
                                <InputNumber
                                    id="maxPriceFilter"
                                    min={0}
                                    value={maxPriceFilter ? Number(maxPriceFilter) : null}
                                    onChange={handleMaxPriceFilter}
                                    style={{ width: '100%' }}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={products?.products}
                    pagination={false}
                    loading={isLoading}
                    onChange={handleChangeTable}
                    showSorterTooltip={false}
                    expandable={{
                        expandedRowRender: (record) => !isMD && (
                            <div>
                                <ExpandItem title="Brand" value={record.brand} />
                                <ExpandItem title="Price" value={record.price} />
                                <ExpandItem title="Stock" value={record.stock} />
                                <ExpandItem title="Category" value={record.category} isShowDivider={false} />
                            </div>
                        ),
                        showExpandColumn: !isMD,
                        rowExpandable: () => !isMD,
                    }}
                />
                <div className="flex justify-end mt-10">
                    <Pagination
                        showSizeChanger
                        showQuickJumper
                        current={page}
                        pageSize={limit}
                        total={products?.total}
                        onChange={handlePagination}
                        onShowSizeChange={handleShowSizeChange}
                    />
                </div>
            </Card>
        </section>
    )
}
