import { Divider, Typography } from "antd";
const { Text } = Typography;

interface ILabel {
    htmlFor: string;
    text: string;
}

export const Label = ({ htmlFor, text }: ILabel) => (
    <label htmlFor={htmlFor}>
        <Text className="font-bold text-xs">{text}</Text>
    </label>
);