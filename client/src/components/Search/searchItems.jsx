import React, { memo, useEffect, useState } from 'react';
import icons from '../../ultils/icons';
import { colors } from '../../ultils/contains';
import {
    createSearchParams,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom';
import { apiGetProduct } from '../../apis';
import { formatMoney } from '../../ultils/helpers';
import UseDebouce from '../../hooks/useDebouce';
import { toast } from 'react-toastify';
const { FaChevronDown } = icons;

const SearchItems = ({
    name,
    activeClick,
    changeActiveFilter,
    type = 'checkbox',
}) => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [selected, setSelected] = useState([]);
    const [bestPrice, setBestPrice] = useState(null);
    const [price, setPrice] = useState({
        from: '',
        to: '',
    });

    const [params] = useSearchParams();
    const handleSelect = (e) => {
        const alreadyEl = selected.find((el) => el === e.target.value);
        if (alreadyEl) {
            setSelected((prev) => prev.filter((el) => el !== e.target.value));
        } else {
            setSelected((prev) => [...prev, e.target.value]);
        }
        changeActiveFilter(null);
    };
    // console.log(selected);

    const fetchBestPriceProduct = async () => {
        const response = await apiGetProduct({ sort: '-price', limit: 1 });
        if (response.success) {
            setBestPrice(response?.products[0]?.price);
        }
    };

    useEffect(() => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of param) queries[i[0]] = i[1];
        if (selected.length > 0) {
            queries.color = selected.join(',');
            queries.page = 1;
        } else {
            delete queries.color;
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        });
    }, [selected]);

    useEffect(() => {
        // console.log(type);
        if (type === 'input') {
            fetchBestPriceProduct();
        }
    }, [type]);
    const [hasWarned, setHasWarned] = useState(false);
    useEffect(() => {
        if (price.from && price.to && price.from > price.to) {
            if (!hasWarned) {
                const timeout = setTimeout(() => {
                    toast.warning(
                        'From price cannot be greater than To price!'
                    );
                    setHasWarned(true); // Đánh dấu đã hiển thị toast
                }, 500); // Delay 500ms

                return () => clearTimeout(timeout); // Clear timeout khi `price` thay đổi trước khi timeout chạy
            }
        } else {
            setHasWarned(false); // Reset trạng thái khi lỗi không còn
        }
    }, [price]);
    const deboucePriceFrom = UseDebouce(price.from, 500);
    const deboucePriceTo = UseDebouce(price.to, 500);
    useEffect(() => {
        let param = [];
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of param) queries[i[0]] = i[1];

        if (Number(price.from) > 0) queries.from = price.from;
        else delete queries.from;
        if (Number(price.to) > 0) queries.to = price.to;
        else delete queries.to;
        queries.page = 1;
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        });
    }, [deboucePriceFrom, deboucePriceTo]);

    return (
        <div
            onClick={() => changeActiveFilter(name)}
            className="sm:w-[80px] relative flex items-center justify-between gap-2 p-2 text-sm border border-gray-800 cursor-pointer"
        >
            <span className="capitalize">{name}</span>
            <FaChevronDown />
            {activeClick === name && (
                <div className="absolute p-4 bg-white z-50 border border-gray-400 top-[calc(100%+1px)] left-[-2px] fit min-w-[150px]">
                    {type === 'checkbox' && (
                        <div className="">
                            <div className="flex items-center justify-between gap-8 p-4 border-b border-gray-300">
                                <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation(),
                                            setSelected([]),
                                            changeActiveFilter(null);
                                    }}
                                    className="underline cursor-pointer hover:text-main"
                                >
                                    Reset
                                </span>
                            </div>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col gap-3 mt-4"
                            >
                                {colors.map((el, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4"
                                    >
                                        <input
                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer "
                                            type="checkbox"
                                            key={index}
                                            value={el}
                                            onChange={handleSelect}
                                            id={el}
                                            checked={selected.some(
                                                (selectedItem) =>
                                                    selectedItem === el
                                            )}
                                        ></input>
                                        <label
                                            className="text-gray-900 capitalize"
                                            htmlFor={el}
                                        >
                                            {el}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {type === 'input' && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-between gap-8 p-4 border-b border-gray-300"
                            >
                                <span className="whitespace-nowrap">{`The highest price is ${formatMoney(
                                    bestPrice
                                )} VND`}</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation(),
                                            setPrice({ from: '', to: '' }),
                                            changeActiveFilter(null);
                                    }}
                                    className="underline cursor-pointer hover:text-main"
                                >
                                    Reset
                                </span>
                            </div>
                            <div className="flex items-center gap-2 p-2">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="from">From</label>
                                    <input
                                        className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none shadow-sm text-gray-800 placeholder-gray-500 transition-all duration-200 
                                        [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
                                        [-moz-appearance:textfield]"
                                        type="number"
                                        id="from"
                                        value={price.from}
                                        onChange={(e) =>
                                            setPrice((prev) => ({
                                                ...prev,
                                                from: e.target.value,
                                            }))
                                        }
                                    ></input>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="to">To</label>
                                    <input
                                        className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none shadow-sm text-gray-800 placeholder-gray-500 transition-all duration-200 
                                        [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
                                        [-moz-appearance:textfield] "
                                        type="number"
                                        id="to"
                                        value={price.to}
                                        onChange={(e) =>
                                            setPrice((prev) => ({
                                                ...prev,
                                                to: e.target.value,
                                            }))
                                        }
                                    ></input>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(SearchItems);
