export const useQueryParam = () => {

    const getAllParams = () => {
        const search = window.location.search;
        const queryString = !!search ? search.replace('?', '').split('&') : [];

        const existingKey: string[] = [];
        let params = queryString.map((itemString) => {
            let [itemKey, itemValue] = itemString.split('=');
            existingKey.push(itemKey);
            return { [itemKey]: itemValue };
        });

        return { params, existingKey };
    }

    const createQueryString = (name: string, value?: string | string[] | number[]) => {
        let { params, existingKey } = getAllParams();

        if (value && value.length) {
            if (existingKey.includes(name)) {
                params = params.filter(item => Object.keys(item)[0] !== name);
            }

            if (typeof value === 'string') {
                params = [
                    ...params,
                    { [name]: encodeURIComponent(value?.toString()) },
                ];
            } else {
                params = [
                    ...params,
                    { [name]: encodeURIComponent(JSON.stringify(value)) },
                ];
            }
        } else {
            params = params.filter(item => Object.keys(item)[0] !== name);
        }

        const makeQueryString = params.map((item) => {
            return `${encodeURIComponent(Object.keys(item)[0])}=${encodeURIComponent(item[Object.keys(item)[0]])}`;
        }).join('&');

        return makeQueryString;
    }

    const getSearchParams = (key: string, option?: { decode?: boolean }) => {
        const { params } = getAllParams();
        const query = params.find(item => Object.keys(item)[0] === key);

        if (!query) return null;

        const queryValue = decodeURIComponent(query[Object.keys(query)[0]]);
        if (!option?.decode) return queryValue;

        return JSON.parse(queryValue);
    };

    return { createQueryString, getSearchParams };
}