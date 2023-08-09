import { Divider, Typography } from "antd";
const { Text } = Typography;

interface IExpandItem {
    title: string;
    value?: string | number;
    isShowDivider?: boolean;
}

export const ExpandItem = ({ title, value, isShowDivider = true }: IExpandItem) => (
    <div>
        <div className="flex justify-between gap-3">
            <Text strong>{title}</Text>
            <Text>{value}</Text>
        </div>
        {isShowDivider && <Divider className="my-3" />}
    </div>
);