import React, { useCallback, useEffect, useState } from 'react';
import { apiGetAllUser, apiUpdateUser, apiDeleteUser } from '../../apis';
import moment from 'moment';
import UseDebouce from '../../hooks/useDebouce';
import { roles, blockStatus } from '../../ultils/contains';
import {
    InputField,
    Pagination,
    InputForm,
    Select,
    Button,
} from '../../components';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import clsx from 'clsx';

const ManageUser = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        // reset,
    } = useForm({
        email: '',
        name: '',
        role: '',
        phone: '',
        isBlocked: '',
    });
    // API lấy danh sách user
    const [allUser, setAllUser] = useState(null);
    const [queries, setQueries] = useState({
        q: '',
    });
    const [params] = useSearchParams();
    const [update, setUpdate] = useState(false);
    // Edit
    const [editElm, setEditElm] = useState(null);
    const fetchapiUsers = async (params) => {
        const response = await apiGetAllUser({
            ...params,
            limit: import.meta.env.VITE_LIMIT,
        });
        if (response.success) {
            setAllUser(response);
        }
    };
    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);
    const queriesDebounce = UseDebouce(queries.q, 800);

    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (queriesDebounce) {
            queries.q = queriesDebounce;
        }
        fetchapiUsers(queries);
    }, [queriesDebounce, params, update]);

    // console.log(queries.q);
    // console.log(editElm);

    const handleUpdateUser = async (data) => {
        // console.log(data)
        const response = await apiUpdateUser(data, editElm?._id);
        if (response.success) {
            setEditElm(null);
            render();
            toast.success(response.mess);
        } else {
            toast.error(response.mess);
        }
    };
    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: 'Are you sure... ?',
            text: 'Are you ready remove this user ?',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUser(uid);
                if (response.success) {
                    render();
                    toast.success(response.mess);
                } else {
                    toast.error(response.mess);
                }
            }
        });
    };

    // useEffect(() => {
    //     if (editElm)
    //         reset({
    //             role: editElm.role,
    //             isBlocked: editElm.isBlocked,
    //         });
    // }, [editElm]);
    return (
        <div className={clsx('w-full ', editElm && 'pl-14')}>
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-300">
                <span>Manage users</span>
            </h1>
            <div className="w-full p-4">
                <div className="flex justify-end py-4">
                    <InputField
                        nameKey={'q'}
                        value={queries.q}
                        setValue={setQueries}
                        style={'w500'}
                        placeholder={'Search name or email user...'}
                        isShowLable
                    />
                </div>
                <form onSubmit={handleSubmit(handleUpdateUser)}>
                    {editElm && <Button type="submit">Update</Button>}
                    <table className="w-full overflow-hidden text-left border-collapse rounded-lg shadow-md">
                        <thead className="text-sm text-white uppercase bg-gray-700">
                            <tr>
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Type login</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                            {allUser?.users?.map((el, index) => (
                                <tr
                                    key={el._id}
                                    className="transition hover:bg-gray-100"
                                >
                                    <td className="px-4 py-3 ">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        {editElm?._id === el._id ? (
                                            <InputForm
                                                register={register}
                                                fullWith
                                                defaultValue={editElm?.email}
                                                errors={errors}
                                                id="email"
                                                validate={{
                                                    required: 'Required fill',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message:
                                                            'invalid email address',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <span>{el?.email}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editElm?._id === el._id ? (
                                            <InputForm
                                                register={register}
                                                fullWit
                                                defaultValue={
                                                    editElm?.name || 'Anonymous'
                                                }
                                                errors={errors}
                                                id="name"
                                                validate={{
                                                    required: 'Required fill',
                                                    pattern: {
                                                        value: /^[^\s]/,
                                                        message:
                                                            'Name cannot start with a space',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <span>
                                                {el?.name || 'Anonymous'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editElm?._id === el._id ? (
                                            <InputForm
                                                register={register}
                                                fullWith
                                                defaultValue={
                                                    editElm?.phone || 'Null'
                                                }
                                                errors={errors}
                                                id="phone"
                                                validate={{
                                                    required: 'Required fill',
                                                    pattern: {
                                                        value: /^(0|\+84)[0-9]{9}$/,
                                                        message:
                                                            'Invalid phone number',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <span> {el?.phone || 'Null'}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 ">
                                        {el?.loginType}
                                    </td>
                                    <td className="px-4 py-3 ">
                                        {editElm?._id === el._id ? (
                                            <Select
                                                register={register}
                                                fullWith
                                                defaultValue={editElm?.role}
                                                errors={errors}
                                                id="role"
                                                validate={{
                                                    required: 'Required fill',
                                                }}
                                                options={roles}
                                            />
                                        ) : (
                                            <span>{el?.role}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editElm?._id === el._id ? (
                                            <Select
                                                register={register}
                                                fullWith
                                                defaultValue={
                                                    editElm?.isBlocked
                                                }
                                                errors={errors}
                                                id="isBlocked"
                                                validate={{
                                                    required: 'Required fill',
                                                }}
                                                options={blockStatus}
                                            />
                                        ) : (
                                            <span>
                                                {el?.isBlocked
                                                    ? 'Blocked'
                                                    : 'Active'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 ">
                                        {moment(el?.createdAt).format(
                                            'DD/MM/YYYY'
                                        )}
                                    </td>
                                    <td className="px-4 py-3 space-x-2 ">
                                        {editElm?._id === el._id ? (
                                            <span
                                                onClick={() => setEditElm(null)}
                                                className="text-blue-500 cursor-pointer hover:underline"
                                            >
                                                Back
                                            </span>
                                        ) : (
                                            <span
                                                onClick={() => setEditElm(el)}
                                                className="text-blue-500 cursor-pointer hover:underline"
                                            >
                                                Edit
                                            </span>
                                        )}
                                        <span
                                            onClick={() =>
                                                handleDeleteUser(el._id)
                                            }
                                            className="text-red-500 cursor-pointer hover:underline"
                                        >
                                            Delete
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>

                <div className="w-full mt-8 ">
                    <Pagination totalCount={allUser?.counts} />
                </div>
            </div>
        </div>
    );
};

export default ManageUser;
