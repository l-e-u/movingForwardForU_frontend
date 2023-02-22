import { useState, useEffect } from 'react';

// debounces query input
export const useDebounceQuery = (query, time = 175) => {
    const [debounceQuery, setDebounceQuery] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceQuery(query);
        }, time);

        return () => {
            clearTimeout(timeout);
        };
    }, [query, time]);

    return debounceQuery;
};