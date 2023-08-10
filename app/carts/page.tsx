'use client'

import { ICart } from '@/utils/type/carts';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Table, Pagination, Card, Button } from 'antd';
import type { PaginationProps, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Key, SortOrder, SorterResult } from 'antd/es/table/interface';
import { useState } from 'react';
import { ExpandItem } from '@/components/Table/ExpandItem';
import { useCarts } from '@/hooks/api/useCarts';
import Link from 'next/link';

const ActionButtons = ({ value }: { value: string }) => (
    <Link href={`/carts/${value}`}>
        <Button type="primary" ghost>Details</Button>
    </Link>
)

const columns: ColumnsType<ICart> = [
    {
        title: 'User',
        dataIndex: 'userId',
        key: 'userId',
        sorter: true,
        render(value) {
            return `User${value}`
        },
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

    const isMD = useMediaQuery('(min-width: 768px)');

    const { data: carts, isLoading: isLoadingCarts } = useCarts({
        page,
        limit,
        sortDirection,
        sortField,
    });

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

    return (
        <section className="flex flex-col gap-6">
            <Card>
                <h1 className="text-xl font-bold mt-5 mb-10 text-indigo-800">
                    Carts
                </h1>
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
