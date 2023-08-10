import { memo } from 'react';
import { Spin, theme } from 'antd';
import { Column } from '@ant-design/plots';

const { useToken } = theme;

interface IData {
    [key: string | number]: string | number,
}

interface IChartColumn {
    isLoading?: boolean;
    data: IData[];
    xField: string | number;
    yField: string | number;
    isScrollbar?: boolean;
    color?: string;
}

const ChartColumn = ({
    isLoading = false,
    data,
    xField,
    yField,
    isScrollbar,
    color,
}: IChartColumn) => {
    const { token } = useToken();

    return (
        <div>
            {isLoading ? (
                <div className="w-full h-64 bg-gray-50 rounded-lg flex justify-center items-center">
                    <Spin />
                </div>
            ) : (
                <Column
                    data={data}
                    xField={xField.toString()}
                    yField={yField.toString()}
                    xAxis={{
                        label: {
                            autoHide: false,
                            autoRotate: true,
                            formatter: (text) => {
                                if (text.length > 10) {
                                    return text.slice(0, 10) + '...';
                                }
                                return text;
                            }
                        },
                    }}
                    label={{
                        position: 'middle',
                        style: {
                            fill: '#FFFFFF'
                        },
                    }}
                    scrollbar={({
                        ...(isScrollbar && { type: 'horizontal' })
                    })}
                    color={color ? color : token.colorPrimary}
                />
            )}
        </div>
    )
}

export default memo(ChartColumn);