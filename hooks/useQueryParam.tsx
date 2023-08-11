export const useQueryParam = () => {

    const createQueryString = (name: string, value?: string | string[] | number[], option?: { encode?: boolean }) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (value && value.length) {
            if (option?.encode) searchParams.set(name, JSON.stringify(value));
            else if (typeof value === 'string') searchParams.set(name, value);
        } else {
            searchParams.delete(name);
        }

        return searchParams.toString();
    }

    const getSearchParams = (key: string, option?: { decode?: boolean }) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.has(key)) return null;

        const value = searchParams.get(key) ?? '';

        if (option?.decode) return JSON.parse(value);
        return value;
    };

    return { createQueryString, getSearchParams };
}