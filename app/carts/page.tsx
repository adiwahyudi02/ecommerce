'use client'

import { ICart } from '@/utils/type/carts';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Table, Pagination, Card, Button, Input } from 'antd';
import type { PaginationProps, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Key, SortOrder, SorterResult } from 'antd/es/table/interface';
import { useState, useEffect, useCallback } from 'react';
import { ExpandItem } from '@/components/Table/ExpandItem';
import { useCarts } from '@/hooks/api/useCarts';
import Link from 'next/link';
import { FormGroup } from '@/components/Form/FormGroup';
import { Label } from '@/components/Form/Label';
import { usePathname } from 'next/navigation';
import { useQueryParam } from '@/hooks/useQueryParam';
import debounce from 'lodash.debounce';

const ActionButtons = ({ value }: { value: string }) => (
    <Link href={`/carts/${value}`}>
        <Button type="primary" ghost>Details</Button>
    </Link>
)

const columns: ColumnsType<ICart> = [
    {
        title: 'User',
        dataIndex: 'userName',
        key: 'userName',
        sorter: true,
    },
    {
        title: 'Total Products',
        dataIndex: 'totalProducts',
        key: 'totalProducts',
        sorter: true,
        responsive: ['md'],
    },
    {
        title: 'Total Quantity',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        sorter: true,
        responsive: ['md'],
    },
    {
        title: 'Discounted Total',
        dataIndex: 'discountedTotal',
        key: 'discountedTotal',
        sorter: true,
        responsive: ['md'],
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        sorter: true,
        responsive: ['md'],
    },
    {
        title: 'Actions',
        dataIndex: 'id',
        key: 'x',
        align: 'right',
        width: 50,
        render: (value: string) => <ActionButtons value={value} />,
        responsive: ['md'],
    },
];

export default function Carts() {
    const [sortDirection, setSortDirection] = useState<SortOrder | undefined>();
    const [sortField, setSortField] = useState<Key | readonly Key[] | undefined>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [searchDebounced, setSearchDebounced] = useState<string | undefined>(undefined);

    const isMD = useMediaQuery('(min-width: 768px)');
    const pathname = usePathname();
    const { createQueryString, getSearchParams } = useQueryParam();

    const { data: carts, isLoading: isLoadingCarts } = useCarts({
        search: searchDebounced,
        page,
        limit,
        sortDirection,
        sortField,
    });

    const handleReplaceParams = (query: string) => {
        const newUrl = decodeURIComponent(`${pathname}?${query}`);
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }

    const handleResetPage = () => setPage(1);

    const handlePagination: PaginationProps['onChange'] = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleShowSizeChange: PaginationProps['onShowSizeChange'] = (_, pageSize) => {
        setLimit(pageSize);
    };

    const handleSorting = (sorter: SorterResult<ICart> | SorterResult<ICart>[]) => {
        setSortDirection((sorter as SorterResult<ICart>).order);
        setSortField((sorter as SorterResult<ICart>).field);
    };

    const handleChangeTable: TableProps<ICart>['onChange'] = (_, __, sorter) => {
        handleSorting(sorter);
    };

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

    useEffect(() => {
        setSearch(getSearchParams('search') ?? undefined);
        setSearchDebounced(getSearchParams('search') ?? undefined);
    }, []);

    return (
        <section className="flex flex-col gap-6">
            <Card>
                <h1 className="text-xl font-bold mt-5 mb-10 text-indigo-800">
                    Carts
                </h1>
                <div className="w-full sm:w-80 flex justify-end mb-10">
                    <FormGroup>
                        <Label htmlFor="search" text="Search" />
                        <Input
                            id="search"
                            allowClear
                            placeholder="By user"
                            value={search}
                            onChange={handleSearch}
                        />
                    </FormGroup>
                </div>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={carts?.carts}
                    pagination={false}
                    loading={isLoadingCarts}
                    onChange={handleChangeTable}
                    showSorterTooltip={false}
                    expandable={{
                        expandedRowRender: (record) => !isMD && (
                            <div>
                                <ExpandItem title="Total Products" value={record.totalProducts} />
                                <ExpandItem title="Total Quantity" value={record.totalQuantity} />
                                <ExpandItem title="Discounted Total" value={record.discountedTotal} />
                                <ExpandItem title="Total" value={record.total} />
                                <ExpandItem title="Actions" value={<ActionButtons value={record.id.toString()} />} isShowDivider={false} />
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
                        total={carts?.total}
                        onChange={handlePagination}
                        onShowSizeChange={handleShowSizeChange}
                    />
                </div>
            </Card>
        </section>
    )
}
