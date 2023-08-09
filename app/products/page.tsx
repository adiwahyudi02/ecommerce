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
import { useMemo, useState } from 'react';
import { ExpandItem } from '@/components/Table/ExpandItem';
import { FormGroup } from '@/components/Form/FormGroup';
import { Label } from '@/components/Form/Label';

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
    const [search, setSearch] = useState('');
    const [categorieFilter, setCategorieFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
    const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<SortOrder | undefined>();
    const [sortField, setSortField] = useState<Key | readonly Key[] | undefined>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const isMD = useMediaQuery('(min-width: 768px)');

    const { data: products, isLoading } = useProducts({
        page,
        limit,
        search,
        categorieFilter,
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


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleMinPriceFilter = (value: number | null) => {
        setMinPriceFilter(value);
    };

    const handleMaxPriceFilter = (value: number | null) => {
        setMaxPriceFilter(value);
    };

    const handleCategorieFilter = (value: string) => {
        setCategorieFilter(value);
    };

    const handleBrandFilter = (value: string) => {
        setBrandFilter(value);
    };

    const handleProductFilter = (value: string) => {
        setProductFilter(value);
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
                                placeholder="Search by Product name"
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
                                loading={isLoadingAllProduct}
                            />
                        </FormGroup>
                        <div className="flex gap-4 w-full flex-1">
                            <FormGroup>
                                <Label htmlFor="minPriceFilter" text="Min Price" />
                                <InputNumber
                                    id="minPriceFilter"
                                    min={0}
                                    value={minPriceFilter}
                                    onChange={handleMinPriceFilter}
                                    style={{ width: '100%' }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="maxPriceFilter" text="Max Price" />
                                <InputNumber
                                    id="maxPriceFilter"
                                    min={0}
                                    value={maxPriceFilter}
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
