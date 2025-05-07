import React, { memo } from 'react';
import usePagination from '../../hooks/usePagination';
import PagiItem from './PagiItem';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ totalCount, limit }) => {
    // const [first, setfirst] = useState(second)
    const pageSize = +import.meta.env.VITE_LIMIT;
    const [params] = useSearchParams();

    const pagination = usePagination(
        totalCount,
        params.get('page') || 1,
        limit || pageSize
    );

    const range = () => {
        const currentPage = +params.get('page');
        const pageSizes = +limit || +import.meta.env.VITE_LIMIT;
        const start = Math.min((currentPage - 1) * pageSizes + 1, totalCount);
        const end = Math.min(currentPage * pageSizes, totalCount);

        return `${start} - ${end}`;
    };
    return (
        <div className="flex items-center justify-between w-full">
            {!+params.get('page') ? (
                <span className="text-sm italic">{`Show products ${Math.min(
                    totalCount,
                    1
                )} - ${Math.min(pageSize, totalCount)} of ${totalCount}`}</span>
            ) : (
                ''
            )}
            {+params.get('page') ? (
                <span className="text-sm italic">{`Show products ${range()} of ${totalCount}`}</span>
            ) : (
                ''
            )}

            <div className="flex items-center">
                {pagination?.map((el) => (
                    <PagiItem key={el}>{el}</PagiItem>
                ))}
            </div>
        </div>
    );
};

export default memo(Pagination);
