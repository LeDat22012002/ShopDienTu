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

    // const convertSlugToTitle = (slug) => {
    //     return slug
    //         .split('-') // Tách chuỗi theo dấu "-"
    //         .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Viết hoa chữ cái đầu
    //         .join(' '); // Ghép lại thành chuỗi có dấu cách
    // };

    // const datngu = convertSlugToTitle(category);
    // console.log(datngu);

    const fetchProductsByCategory = async (queries) => {
        const response = await apiGetProduct(queries);

        if (response.success) {
            setProducts(response);
        }
    };

    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        // let param = [];
        // for (let i of params.entries()) param.push(i);
        // const queries = {};
        // for (let i of params) queries[i[0]] = i[1];
        // if (category) {
        //     queries.category = convertSlugToTitle(category);
        // }
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
        const q = { ...priceQuery, ...queries };
        // console.log(q);
        fetchProductsByCategory(q);
        window.scrollTo(0, 0);
    }, [params, category]);

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
        <div className="w-full">
            <div className="h-[81px] flex  justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">{category}</h3>
                    <Breadcrumb category={category} />
                </div>
            </div>
            <div className="flex items-center justify-between p-4 m-auto mt-8 border w-main">
                <div className="flex flex-col flex-auto w-4/5 gap-3 ">
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
                <div className="flex flex-col w-1/5 gap-3">
                    <span className="text-sm font-semibold ">Sort by</span>
                    <div className="w-full">
                        <InputSelect
                            changeValue={changeValue}
                            value={sort}
                            options={sorts}
                        />
                    </div>
                </div>
            </div>
            <div className="m-auto my-8 w-main ">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex my-masonry-grid mx-[-10px]"
                    columnClassName="my-masonry-grid_column"
                >
                    {products?.products?.map((el) => (
                        <Product
                            key={el._id}
                            pid={el._id}
                            productData={el}
                            normal={true}
                        ></Product>
                    ))}
                </Masonry>
            </div>

            <div className="flex justify-center m-auto my-4 w-main">
                <Pagination totalCount={products?.counts} />
            </div>
            <div className="h-[300px]"></div>
        </div>
    );
};

export default Products;
