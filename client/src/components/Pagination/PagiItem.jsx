import React, { memo } from 'react';
import clsx from 'clsx';

import {
    useSearchParams,
    useNavigate,
    // useParams,
    createSearchParams,
    useLocation,
} from 'react-router-dom';
const PagiItem = ({ children }) => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const location = useLocation();
    // const { category } = useParams();
    const handlePagination = () => {
        const queries = Object.fromEntries([...params]);
        if (Number(children)) queries.page = children;
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        });
    };
    return (
        <button
            className={clsx(
                'flex  justify-center w-10 h-10 m-1 ',
                !Number(children) && 'items-end pb-2',
                Number(children) && 'items-center  cursor-pointer',
                +params.get('page') === +children && 'rounded-full bg-gray-300',
                !+params.get('page') &&
                    +children === 1 &&
                    'rounded-full bg-gray-300'
            )}
            onClick={handlePagination}
            type="button"
            disabled={!Number(children)}
        >
            {children}
        </button>
    );
};

export default memo(PagiItem);
