import React from 'react';
import { useEffect, useState } from 'react';
const UseDebouce = (value, ms) => {
    const [decounceValue, setDecounceValue] = useState('');
    useEffect(() => {
        const setTimeOutId = setTimeout(() => {
            setDecounceValue(value);
        }, ms);
        return () => {
            clearTimeout(setTimeOutId);
        };
    }, [value, ms]);
    return decounceValue;
};

export default UseDebouce;
