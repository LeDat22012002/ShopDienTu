import React, { useEffect } from 'react';
import { InputForm, Button } from '../../components';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { apiUpdateBrand } from '../../apis';

const UpdateBrand = ({ editBrand, render, setEditBrand }) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();
    useEffect(() => {
        reset({
            title: editBrand?.title || '',
        });
    }, [editBrand]);

    const handleUpdateBrand = async (data) => {
        // console.log(data);
        const response = await apiUpdateBrand(data, editBrand?._id);
        if (response.success) {
            toast.success(response.mess);
            render();
            setEditBrand(null);
        } else {
            toast.error(response.mess);
        }
    };
    return (
        <div className="relative flex flex-col w-full">
            <div className="h-[75px]  flex justify-between items-center  px-4 border-b border-gray-300 fixed right-0 left-[327px] top-0 bg-gray-100">
                <h1 className="text-3xl font-bold">Update Brand</h1>
                <span
                    onClick={() => setEditBrand(null)}
                    className="text-[17px] cursor-pointer text-main hover:underline"
                >
                    Cancel
                </span>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateBrand)}>
                    <InputForm
                        label="Name brand"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'Brand name cannot be blank !',
                            pattern: {
                                value: /^[^\s]/,
                                message:
                                    'Brand name cannot start with a space !',
                            },
                        }}
                        fullWith
                        placeholder="Name of new brand..."
                    />
                    <div className="my-6">
                        <Button type="submit">Update Brand</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateBrand;
