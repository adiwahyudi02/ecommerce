'use client'

export const dynamic = 'force-dynamic';
import { useCategories } from '@/hooks/api/useCategories';
import { useProducts } from '@/hooks/api/useProducts';
import { IProduct } from '@/utils/type/product';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Table, Pagination, Card, Select, InputNumber } from 'antd';
import { Input } from 'antd';
import type { PaginationProps, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Key, SortOrder, SorterResult } from 'antd/es/table/interface';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { ExpandItem } from '@/components/Table/ExpandItem';
import { FormGroup } from '@/components/Form/FormGroup';
import { Label } from '@/components/Form/Label';
import { usePathname } from 'next/navigation';
import { useQueryParam } from '@/hooks/useQueryParam';
import ChartColumn from '@/components/Chart/ChartColumn';
import debounce from 'lodash.debounce';

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

    const pathname = usePathname();
    const { createQueryString, getSearchParams } = useQueryParam();

    const [search, setSearch] = useState<string | undefined>(undefined);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const [productFilter, setProductFilter] = useState<string | null>(null);
    const [minPriceFilter, setMinPriceFilter] = useState<string | null>(null);
    const [maxPriceFilter, setMaxPriceFilter] = useState<string | null>(null);
    const [minPriceFilterDebounced, setMinPriceFilterDebounced] = useState<string | null>(null);
    const [maxPriceFilterDebounced, setMaxPriceFilterDebounced] = useState<string | null>(null);
    const [searchDebounced, setSearchDebounced] = useState<string | undefined>(undefined);
    const [chartFilterByBrand, setChartFilterByBrand] = useState<string[] | null | undefined>([]);

    const isMD = useMediaQuery('(min-width: 768px)');

    const { data: products, isLoading } = useProducts({
        page,
        limit,
        search: searchDebounced,
        categoryFilter,
        minPriceFilter: minPriceFilterDebounced,
        maxPriceFilter: maxPriceFilterDebounced,
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

    const chartData = useMemo(() => {
        if (allProducts?.products?.length) {
            const counts = allProducts?.products?.reduce((a: { [key: string]: number }, b) => {
                const name = b.brand;
                if (!a.hasOwnProperty(name)) {
                    a[name] = 0;
                }
                a[name]++;
                return a;
            }, {});

            const countsExtended = Object.keys(counts)
                .map(i => ({ brand: i, products: counts[i] }))
                .sort((a, b) => (a.brand > b.brand) ? 1 : ((b.brand > a.brand) ? -1 : 0))

            return countsExtended;
        } else return []
    }, [allProducts]);

    const chartDataFiltered = useMemo(() => {
        if (!chartFilterByBrand?.length) return chartData;
        return chartData.filter(item => chartFilterByBrand?.includes(item.brand));
    }, [chartData, chartFilterByBrand]);

    const handleReplaceParams = (query: string) => {
        const newUrl = decodeURIComponent(`${pathname}?${query}`);
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }

    const handleResetPage = () => setPage(1);

    const handleSearchDebounce = useCallback(debounce((value: string) => {
        setSearchDebounced(value);
        handleResetPage();
        handleReplaceParams(createQueryString('search', value));
    }, 1000), []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        handleSearchDebounce(value);
    };

    const handleMinPriceFilterDebounce = useCallback(debounce((value: string | null) => {
        setMinPriceFilterDebounced(value);
        handleResetPage();
        handleReplaceParams(createQueryString('minPrice', value?.toString()));
    }, 1000), []);

    const handleMinPriceFilter = (value: string | null) => {
        setMinPriceFilter(value);
        handleMinPriceFilterDebounce(value);
    };

    const handleMaxPriceFilterDebounce = useCallback(debounce((value: string | null) => {
        setMaxPriceFilterDebounced(value);
        handleResetPage();
        handleReplaceParams(createQueryString('maxPrice', value?.toString()));
    }, 1000), []);

    const handleMaxPriceFilter = (value: string | null) => {
        setMaxPriceFilter(value);
        handleMaxPriceFilterDebounce(value);
    };

    const handleCategorieFilter = (value: string) => {
        setCategoryFilter(value);
        handleResetPage();
        handleReplaceParams(createQueryString('category', value));
    };

    const handleBrandFilter = (value: string) => {
        setBrandFilter(value);
        handleResetPage();
        handleReplaceParams(createQueryString('brand', value));
    };

    const handleProductFilter = (value: string) => {
        setProductFilter(value);
        handleResetPage();
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

    const handleChartFilterByBrand = (value: string[]) => {
        setChartFilterByBrand(value);
        handleReplaceParams(createQueryString('chartByBrand', value, { encode: true }));
    };

    useEffect(() => {
        setSearch(getSearchParams('search') ?? undefined);
        setSearchDebounced(getSearchParams('search') ?? undefined);
        setCategoryFilter(getSearchParams('category'));
        setBrandFilter(getSearchParams('brand'));
        setProductFilter(getSearchParams('product'));
        setMinPriceFilter(getSearchParams('minPrice'));
        setMaxPriceFilter(getSearchParams('maxPrice'));
        setMinPriceFilterDebounced(getSearchParams('minPrice'));
        setMaxPriceFilterDebounced(getSearchParams('maxPrice'));
        setChartFilterByBrand(getSearchParams('chartByBrand', { decode: true }) ?? []);
    }, []);

    return (
        <section className="flex flex-col gap-6">
            <Card>
                <h1 className="text-xl font-bold mt-5 mb-10 text-indigo-800">
                    Products
                </h1>
                <h2 className="text-base font-bold text-indigo-800 mb-6">
                    Brand Chart
                </h2>
                <div className="flex justify-start mb-10">
                    <div className="w-full sm:w-80">
                        <FormGroup>
                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                id="chartFilterByBrand"
                                placeholder="Select Brand"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                onChange={handleChartFilterByBrand}
                                options={brandsOption}
                                value={chartFilterByBrand}
                                loading={isLoadingAllProduct}
                            />
                        </FormGroup>
                    </div>
                </div>
                <ChartColumn
                    data={chartDataFiltered}
                    xField="brand"
                    yField="products"
                    isLoading={isLoadingAllProduct}
                    isScrollbar
                />
            </Card>
            <Card>
                <h2 className="text-base font-bold text-indigo-800 mb-6">
                    Product List
                </h2>
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
                                filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
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
                                filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
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
                                filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
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
                                    min="0"
                                    value={minPriceFilter}
                                    onChange={handleMinPriceFilter}
                                    style={{ width: '100%' }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="maxPriceFilter" text="Max Price" />
                                <InputNumber
                                    id="maxPriceFilter"
                                    min="0"
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
