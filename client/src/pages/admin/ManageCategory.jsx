import React, { useCallback, useEffect, useState } from 'react';
import { InputForm, Pagination } from '../../components';
import { useForm } from 'react-hook-form';
import {
    useSearchParams,
    createSearchParams,
    useNavigate,
    useLocation,
} from 'react-router-dom';
import UseDebouce from '../../hooks/useDebouce';
import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';
import icons from '../../ultils/icons';
import { apiGetAllCategories } from '../../apis';
import { UpdateBrand } from '.';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const { ImBin, FaRegEdit } = icons;

const ManageCategory = () => {
    const { categories } = useSelector((state) => state.app);
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
    const [categorys, setCategorys] = useState(null);
    const [counts, setCounts] = useState(0);

    // update brand
    // const [editBrand, setEditBrand] = useState(null);
    // const [update, setUpdate] = useState(false);

    // const render = useCallback(() => {
    //     setUpdate(!update);
    // });
    const queriesDebounce = UseDebouce(watch('q'), 800);
    // Api lấy ds sản phẩm
    const fetchCategorys = async (params) => {
        const response = await apiGetAllCategories({
            ...params,
            limit: import.meta.env.VITE_LIMIT,
        });
        // console.log(response);
        if (response.success) {
            setCounts(response.counts);
            setCategorys(response.categorys);
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

        fetchCategorys(searchParams);
    }, [params]);

    return (
        <div className="relative flex flex-col w-full">
            {/* {editBrand && (
                    <div className="absolute inset-0 z-50 min-h-screen bg-gray-100">
                        <UpdateBrand
                            editBrand={editBrand}
                            render={render}
                            setEditBrand={setEditBrand}
                        />
                    </div>
                )} */}
            <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-300 fixed top-0 bg-gray-100">
                <span>Manage Categorys</span>
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
                            placeholder="Search name category..."
                        />
                    </form>
                </div>
                <table className="w-full overflow-hidden text-left border-collapse rounded-lg shadow-md">
                    <thead className="text-sm text-white uppercase bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-center">#</th>
                            <th className="px-4 py-2 ">Title</th>

                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {categorys?.map((el, index) => (
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

                                <td className="px-4 py-3 space-x-2 text-center ">
                                    <div className="flex items-center justify-center gap-2">
                                        <span
                                            // onClick={() => setEditBrand(el)}
                                            className="text-blue-500 cursor-pointer hover:underline hover:text-blue-900"
                                        >
                                            <FaRegEdit size={20} />
                                        </span>

                                        <span
                                            // onClick={() =>
                                            //     handleDeleteBrand(el?._id)
                                            // }
                                            className="text-red-500 cursor-pointer hover:underline hover:text-red-900 "
                                        >
                                            <ImBin size={20} />
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

export default ManageCategory;
