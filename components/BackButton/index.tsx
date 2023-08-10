import { Button } from "antd";
import Link from "next/link";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface IBackButton {
    href: string;
}

export const BackButton = ({ href }: IBackButton) => (
    <Link href={href}>
        <Button type="text">
            <div className="w-fit flex items-center gap-2">
                <AiOutlineArrowLeft className="text-indigo-800" />
                <p className="text-indigo-800">Back</p>
            </div>
        </Button>
    </Link>
)