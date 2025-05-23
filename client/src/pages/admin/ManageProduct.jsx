import React, { useCallback, useEffect, useState } from 'react';
import { CustomizeVarriants, InputForm, Pagination } from '../../components';
import { useForm } from 'react-hook-form';
import { apiGetProduct, apiDeleteProduct } from '../../apis';
import { formatMoney } from '../../ultils/helpers';
import {
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation,
} from 'react-router-dom';
import UseDebouce from '../../hooks/useDebouce';
import { UpdateProduct } from '.';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import icons from '../../ultils/icons';

const { ImBin, FaRegEdit, MdOutlineDashboardCustomize } = icons;

const ManageProduct = () => {
    const {
        register,
        formState: { errors },
        // handleSubmit,
        // reset,
        watch,
    } = useForm();

    const navigate = useNavigate();
    const location = useLocation();
    // Lấy cái dữ liệu từ params
    const [params] = useSearchParams();
    const [products, setProducts] = useState(null);
    const [counts, setCounts] = useState(0);

    //Varriants Product
    const [customizeVarriants, setCustomizeVarriants] = useState(null);
    // update product
    const [editProduct, setEditProduct] = useState(null);
    const [update, setUpdate] = useState(false);

    const render = useCallback(() => {
        setUpdate(!update);
    });

    const queriesDebounce = UseDebouce(watch('q'), 800);
    // Api lấy ds sản phẩm
    const fetchProducts = async (params) => {
        const response = await apiGetProduct({
            ...params,
            limit: import.meta.env.VITE_LIMIT,
        });
        if (response.success) {
            setCounts(response.counts);
            setProducts(response.products);
        }
    };

    useEffect(() => {
        if (queriesDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ q: queriesDebounce }).toString(),
            });
        } else {
            navigate({
                pathname: location.pathname,
            });
        }
    }, [queriesDebounce]);

    useEffect(() => {
        const searchParams = Object.fromEntries([...params]);

        fetchProducts(searchParams);
    }, [params, update]);
    // console.log(params.get('page'));

    // console.log(products);

    // Delete Product
    const handleDeleteProduct = (pid) => {
        Swal.fire({
            title: 'Are you sure...?',
            text: 'Are you sure remove this product ? ',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (rs) => {
            if (rs.isConfirmed) {
                const responseDelete = await apiDeleteProduct(pid);
                if (responseDelete.success) {
                    toast.success(responseDelete.mess);
                } else {
                    toast.error(responseDelete.mess);
                }
                render();
            }
        });
    };
    return (
        <div className="relative flex flex-col w-full">
            {editProduct && (
                <div className="absolute inset-0 z-50 min-h-screen bg-gray-100">
                    <UpdateProduct
                        editProduct={editProduct}
                        render={render}
                        setEditProduct={setEditProduct}
                    />
                </div>
            )}
            {customizeVarriants && (
                <div className="absolute inset-0 z-50 min-h-screen bg-gray-100">
                    <CustomizeVarriants
                        customizeVarriants={customizeVarriants}
                        render={render}
                        setCustomizeVarriants={setCustomizeVarriants}
                    />
                </div>
            )}
            <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-300 fixed top-0 bg-gray-100">
                <span>Manage Product</span>
            </h1>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col w-full gap-4 p-4">
                <div className="flex justify-end py-4">
                    <form className="w-[45%]">
                        <InputForm
                            id="q"
                            register={register}
                            errors={errors}
                            fullWith
                            placeholder="Search name or description product..."
                        />
                    </form>
                </div>
                <table className="w-full overflow-hidden text-left border-collapse rounded-lg shadow-md">
                    <thead className="text-sm text-white uppercase bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-center">#</th>
                            <th className="px-4 py-2 ">Title</th>
                            <th className="px-4 py-2 ">Thumb</th>
                            <th className="px-4 py-2 text-center">Brand</th>
                            <th className="px-4 py-2 text-center">Category</th>
                            <th className="px-4 py-2 text-center ">Price</th>
                            <th className="px-4 py-2 text-center ">Quantity</th>
                            <th className="px-4 py-2 text-center ">Sold</th>
                            {/* <th className="px-4 py-2 text-center">Color</th> */}
                            {/* <th className="px-4 py-2 text-center">Rating</th> */}
                            <th className="px-4 py-2 text-center ">
                                Varriants
                            </th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {products?.map((el, index) => (
                            <tr
                                key={el?._id}
                                className="transition hover:bg-gray-100"
                            >
                                <td className="px-4 py-3 text-center ">
                                    {(+params.get('page') > 1
                                        ? +params.get('page') - 1
                                        : 0) *
                                        import.meta.env.VITE_LIMIT +
                                        index +
                                        1}
                                </td>
                                <td className="px-4 py-3 w-[200px]">
                                    <span>{el?.title}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <img
                                        src={el?.thumb || el?.images[0]}
                                        alt="thumb"
                                        className="w-[60px] h-[60px] object-cover"
                                    ></img>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span> {el?.brand}</span>
                                </td>
                                <td className="px-4 py-3 text-center ">
                                    <span>{el?.category}</span>
                                </td>
                                <td className="px-4 py-3 text-center ">
                                    <span>{formatMoney(el?.price)} VNĐ</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span>{el?.quantity}</span>
                                </td>
                                <td className="px-4 py-3 text-center ">
                                    <span>{el?.sold}</span>
                                </td>
                                {/* <td className="px-4 py-3 text-center ">
                                    <span>{el?.color}</span>
                                </td>
                                <td className="px-4 py-3 text-center ">
                                    <span>{el?.totalRatings}</span>
                                </td> */}
                                <td className="px-4 py-3 text-center ">
                                    <span>{el?.varriants?.length || 0}</span>
                                </td>
                                <td className="px-4 py-3 space-x-2 text-center ">
                                    <div className="flex items-center justify-center gap-2">
                                        <span
                                            onClick={() => setEditProduct(el)}
                                            className="text-blue-500 cursor-pointer hover:underline hover:text-blue-900"
                                        >
                                            <FaRegEdit size={20} />
                                        </span>

                                        <span
                                            onClick={() =>
                                                handleDeleteProduct(el._id)
                                            }
                                            className="text-red-500 cursor-pointer hover:underline hover:text-red-900 "
                                        >
                                            <ImBin size={20} />
                                        </span>
                                        <span
                                            onClick={() =>
                                                setCustomizeVarriants(el)
                                            }
                                            className="cursor-pointer text-amber-500 hover:underline hover:text-amber-900"
                                        >
                                            <MdOutlineDashboardCustomize
                                                size={20}
                                            />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="w-full mt-8 ">
                    <Pagination totalCount={counts} />
                </div>
            </div>
        </div>
    );
};

export default ManageProduct;
