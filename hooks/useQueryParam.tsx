export const useQueryParam = () => {

    const createQueryString = (name: string, value?: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (value) {
            searchParams.set(name, value);
        } else {
            searchParams.delete(name);
        }

        return searchParams.toString();
    }

    const getSearchParams = (key: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.has(key)) return null;

        return searchParams.get(key);
    };

    return { createQueryString, getSearchParams };
}