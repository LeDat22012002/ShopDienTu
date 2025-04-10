import React from 'react';
import { InputForm, Button, Loading } from '../../components';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import { apiCreateBrand } from '../../apis';

const CreateBrand = () => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();

    const handleCreateBrand = async (data) => {
        const response = await apiCreateBrand(data);

        // console.log(response);
        if (response.success) {
            toast.success(response.mess);
            reset();
        } else {
            toast.error(response.mess);
        }
    };

    return (
        <div className="relative flex flex-col w-full">
            <div className="h-[75px]  flex items-center  px-4 border-b border-gray-300 fixed right-0 left-[327px] top-0 bg-gray-100">
                <h1 className="text-3xl font-bold">Create Brand</h1>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col p-4">
                <form onSubmit={handleSubmit(handleCreateBrand)}>
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
                        placeholder="Brand of new product..."
                    />
                    <div className="my-6">
                        <Button type="submit">Create new brand</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBrand;
