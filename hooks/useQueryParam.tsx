import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryParam = () => {
    const searchParams = useSearchParams()

    const createQueryString = useCallback((name: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }

        return params.toString();
    }, [searchParams]);

    const getSearchParams = (key: string) => {
        if (!searchParams.has(key)) return null;

        return searchParams.get(key);
    }

    return { createQueryString, getSearchParams, searchParams };
}