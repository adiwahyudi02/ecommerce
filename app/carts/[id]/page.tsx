'use client'

import { IProductCart } from '@/utils/type/carts';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Table, Card, Divider, Skeleton } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ExpandItem } from '@/components/Table/ExpandItem';
import { useCartDetails } from '@/hooks/api/useCartDetails';
import { BackButton } from '@/components/BackButton';
import moment from 'moment';

const columns: ColumnsType<IProductCart> = [
    {
        title: 'Product Name',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        responsive: ['md'],
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        responsive: ['md'],
    },
    {
        title: 'Discout Percentage',
        dataIndex: 'discountPercentage',
        key: 'discountPercentage',
        responsive: ['md'],
    },
    {
        title: 'Discouted Price',
        dataIndex: 'discountedPrice',
        key: 'discountedPrice',
        responsive: ['md'],
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        responsive: ['md'],
    },
];

export default function CartDetails({ params }: { params: { id: string } }) {
    const isMD = useMediaQuery('(min-width: 768px)');

    const { data: details, isLoading: isLoadingDetails } = useCartDetails(params.id);

    return (
        <section className="flex flex-col gap-6">
            <Card>
                <BackButton href="/carts" />
                <h1 className="text-xl font-bold my-10 text-indigo-800 ml-2">
                    Cart {params.id}
                </h1>
                <div className="mb-12">
                    <h2 className="text-base font-bold text-indigo-800 mb-6 ml-2">
                        Details
                    </h2>
                    <Card>
                        {isLoadingDetails ? (
                            <Skeleton />
                        ) : (
                            <div className="flex flex-col sm:flex-row">
                                <div className="w-1/2">
                                    <div className="flex items-center gap-3 my-3">
                                        <p className="font-bold">User:</p>
                                        <p>{details?.userName}</p>
                                    </div>
                                    <div className="flex items-center gap-3 my-3">
                                        <p className="font-bold">Added On:</p>
                                        <p>{moment(details?.date, 'DD-MM-YYYY').format('D MMMM YYYY')}</p>
                                    </div>
                                </div>
                                <div className="block sm:none">
                                    <Divider />
                                </div>
                                <div className="w-1/2">
                                    <div className="flex items-center gap-3 my-3">
                                        <p className="font-bold"># of Items:</p>
                                        <p>{details?.totalProducts}</p>
                                    </div>
                                    <div className="flex items-center gap-3 my-3">
                                        <p className="font-bold">Total Amount:</p>
                                        <p>{details?.total}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
                <div>
                    <h2 className="text-base font-bold text-indigo-800 mb-6 ml-2">
                        Products
                    </h2>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={details?.products}
                        loading={isLoadingDetails}
                        showSorterTooltip={false}
                        expandable={{
                            expandedRowRender: (record) => !isMD && (
                                <div>
                                    <ExpandItem title="Price" value={record.price} />
                                    <ExpandItem title="Quantity" value={record.quantity} />
                                    <ExpandItem title="Discout Percentage" value={record.discountPercentage} />
                                    <ExpandItem title="Discouted Price" value={record.discountedPrice} />
                                    <ExpandItem title="Total" value={record.total} isShowDivider={false} />
                                </div>
                            ),
                            showExpandColumn: !isMD,
                            rowExpandable: () => !isMD,
                        }}
                    />
                </div>
            </Card>
        </section>
    )
}
