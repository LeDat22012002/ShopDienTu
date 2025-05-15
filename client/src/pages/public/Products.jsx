import React, { useEffect, useState, useCallback } from 'react';
import {
    useNavigate,
    useParams,
    useSearchParams,
    createSearchParams,
} from 'react-router-dom';
import {
    Breadcrumb,
    Product,
    SearchItems,
    InputSelect,
    Pagination,
} from '../../components';
import { apiGetProduct } from '../../apis';
import Masonry from 'react-masonry-css';
import { sorts } from '../../ultils/contains';

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
};

const Products = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    // console.log(category);
    const [products, setProducts] = useState(null);
    const [activeClick, setActiveClick] = useState(null);
    const [sort, setSort] = useState('');
    const [params] = useSearchParams();
    // console.log(params);

    const fetchProductsByCategory = async (queries) => {
        if (category && category !== 'products') queries.category = category;

        // console.log(convertedCategory);
        const response = await apiGetProduct(queries);

        if (response.success) {
            setProducts(response);
        }
    };

    useEffect(() => {
        const queries = Object.fromEntries([...params]);

        let priceQuery = {};
        if (queries.from && queries.to) {
            priceQuery = {
                $and: [
                    { price: { gte: queries.from } },
                    { price: { lte: queries.to } },
                ],
            };
            delete queries.price;
        } else {
            if (queries.from) queries.price = { gte: queries.from };
            if (queries.to) queries.price = { lte: queries.to };
        }

        delete queries.from;
        delete queries.to;
        const q = { ...priceQuery, ...queries, limit: 8 };
        // console.log(q);
        fetchProductsByCategory(q);
        window.scrollTo(0, 0);
    }, [params]);

    const changeActiveFilter = useCallback(
        (name) => {
            if (activeClick === name) {
                setActiveClick(null);
            } else {
                setActiveClick(name);
            }
        },
        [activeClick]
    );

    const changeValue = useCallback(
        (value) => {
            setSort(value);
        },
        [sort]
    );

    useEffect(() => {
        if (sort) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({ sort }).toString(),
            });
        }
    }, [sort]);

    return (
        <div className="w-full ">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-full ml-[10px] lg:w-main lg:ml-0">
                    <h3 className="text-[12px] lg:text-[16px] font-semibold uppercase">
                        {category}
                    </h3>
                    <Breadcrumb category={category} />
                </div>
            </div>
            <div className="flex items-center justify-between w-[96%] p-4 mx-auto mt-8 border lg:w-main ">
                <div className="flex flex-col flex-auto w-3/5 gap-3 lg:w-4/5 ">
                    <span className="text-sm font-semibold ">Filter by</span>
                    <div className="flex items-center gap-4 ">
                        <SearchItems
                            name="Price"
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            type="input"
                        />
                        <SearchItems
                            name="Color"
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            type="checkbox"
                        />
                    </div>
                </div>
                <div className="flex flex-col w-2/5 gap-3 lg:w-1/5 ">
                    <span className="text-sm font-semibold ">Sort by</span>
                    <div className="w-full">
                        <InputSelect
                            changeValue={changeValue}
                            value={sort}
                            options={sorts}
                            style="w-full sm:w-auto"
                        />
                    </div>
                </div>
            </div>
            <div className="w-[94%] m-auto my-4 lg:w-main ">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex my-masonry-grid mx-[-10px] mb-[-10px]"
                    columnClassName="my-masonry-grid_column"
                >
                    {products?.products?.map((el) => (
                        <Product
                            key={el._id}
                            pid={el._id}
                            productData={el}
                            normal={true}
                            style="px-[10px] md:px-[3px] lg:px-[10px] mb-4"
                        ></Product>
                    ))}
                </Masonry>
            </div>

            <div className="flex justify-center w-full px-[10px] m-auto my-4 lg:px-0 lg:w-main">
                <Pagination totalCount={products?.counts} limit={8} />
            </div>
        </div>
    );
};

export default Products;
