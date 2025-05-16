import React, { memo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import UseDebouce from '../../hooks/useDebouce';
import { apiGetProduct } from '../../apis';
import { InputForm } from '..';
import { formatMoney } from '../../ultils/helpers';
import { FiSearch } from 'react-icons/fi';
const Search = () => {
    const {
        register,
        watch,
        formState: { errors },
    } = useForm();
    // const [params] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const query = watch('q');
    const queryDebounced = UseDebouce(query, 500);

    // Call API khi từ khóa thay đổi
    useEffect(() => {
        if (queryDebounced) {
            const fetchProducts = async () => {
                const response = await apiGetProduct({
                    q: queryDebounced,
                    limit: 20,
                });

                if (response.success) {
                    setProducts(response.products);
                }
            };
            fetchProducts();
        } else {
            setProducts([]);
            setSuggestions([]);
        }
    }, [queryDebounced]);

    // Lọc suggestions
    useEffect(() => {
        if (!query?.trim()) return setSuggestions([]);
        const filtered = products?.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered || []);
    }, [query, products]);

    const handleSelect = (product) => {
        navigate(`/${product?.category}/${product?._id}/${product?.title}`);
        setSuggestions([]); // Ẩn gợi ý
    };
    useEffect(() => {
        const handleClickOutOption = (e) => {
            const profile = document.getElementById('productSearch');
            if (!profile?.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('click', handleClickOutOption);

        return () => {
            document.removeEventListener('click', handleClickOutOption);
        };
    }, []);

    return (
        <div className="relative flex items-center justify-center w-full text-[13px]">
            <div className="w-[85%]">
                <InputForm
                    id="q"
                    register={register}
                    errors={errors}
                    placeholder="Tìm kiếm sản phẩm..."
                    fullWith
                    className="text-[12px] text-gray-900 outline-none 
                            placeholder:text-gray-400 placeholder:italic placeholder:text-[12px]
                            px-1 sm:text-[14px] sm:placeholder:text-base md:px-2 md:py-3 h-[30px] md:h-[40px]"
                />
            </div>
            <div className="w-[15%] ml-[-1px] flex items-center text-white justify-center bg-main h-[30.5px] md:h-[40.5px] p-1 border-t border-b border-r border-l-0 border-gray-500">
                <div className="text-[10px] md:text-[14px] lg:text-[18px]">
                    <FiSearch />
                </div>
            </div>

            {suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white shadow-lg mt-1 max-h-[360px] top-[80%] overflow-y-auto rounded-md border border-gray-200">
                    {suggestions.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => handleSelect(product)}
                            id="productSearch"
                            className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex flex-col max-w-[70%] sm:max-w-[75%]">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {product.title}
                                </p>
                                <div className="text-sm font-semibold text-red-600">
                                    {formatMoney(product?.price)} VNĐ
                                </div>
                            </div>
                            <img
                                src={product?.thumb}
                                alt="product"
                                className="object-contain w-10 h-10 sm:w-12 sm:h-12"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default memo(Search);
