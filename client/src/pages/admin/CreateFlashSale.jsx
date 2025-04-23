import React, { useEffect, useState } from 'react';
import { InputForm, Button, Loading, InputCheckbox } from '../../components';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import { apiCreateFlashSale, apiGetProduct } from '../../apis';

const CreateFlashSale = () => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();

    // gán data lấy từ API Product
    const [products, setProducts] = useState(null);
    const fetchProducts = async () => {
        const rsproducts = await apiGetProduct();

        if (rsproducts.success) {
            setProducts(rsproducts.products);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateFlashSale = async (data) => {
        const productList = Array.isArray(data.product)
            ? data.product
            : typeof data.product === 'string'
            ? data.product.split(',').map((id) => id.trim())
            : [];

        const products = productList.map((id) => ({
            product: id,
            salePrice: Number(data.salePrice),
            quantity: Number(data.quantity),
        }));

        const payload = {
            title: data.title,
            startTime: data.startTime,
            endTime: data.endTime,
            products,
        };

        const response = await apiCreateFlashSale(payload);

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
                <h1 className="text-3xl font-bold">Create FlashSale</h1>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col p-4">
                <form onSubmit={handleSubmit(handleCreateFlashSale)}>
                    <InputForm
                        label="Title"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'Title cannot be blank !',
                            pattern: {
                                value: /^[^\s]/,
                                message: 'Title cannot start with a space !',
                            },
                        }}
                        fullWith
                        placeholder="Title of new flashSale..."
                    />
                    <div className="flex flex-col gap-2 mb-4 mt-[20px]">
                        <p className="text-[14px] font-semibold text-gray-700">
                            Choose product
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-x-4 gap-y-2">
                            {products?.map((product) => (
                                <InputCheckbox
                                    key={product._id}
                                    name="product"
                                    value={product._id}
                                    label={product.title}
                                    register={register}
                                    validate={{
                                        validate: (value, values) => {
                                            return (
                                                values?.product?.length > 0 ||
                                                'Please select a product !'
                                            );
                                        },
                                    }}
                                    errors={errors}
                                />
                            ))}
                        </div>
                        <div className="flex w-full gap-4 my-6">
                            <InputForm
                                label="Price sale"
                                register={register}
                                errors={errors}
                                id="salePrice"
                                validate={{
                                    required: 'salePrice cannot be blank !',
                                    pattern: {
                                        value: /^[^\s]/,
                                        message:
                                            'salePrice cannot start with a space !',
                                    },
                                }}
                                style="flex-auto "
                                placeholder="Price of new product..."
                                type="number"
                            />
                            <InputForm
                                label="Quantity "
                                register={register}
                                errors={errors}
                                id="quantity"
                                validate={{
                                    required: 'Product price cannot be blank !',
                                    pattern: {
                                        value: /^[^\s]/,
                                        message:
                                            'Product price cannot start with a space !',
                                    },
                                }}
                                style="flex-auto "
                                placeholder="Quantity of new product..."
                                type="number"
                            />
                        </div>
                        <div className="flex gap-2 mt-3">
                            <InputForm
                                label="Start Date & Time"
                                register={register}
                                errors={errors}
                                id="startTime"
                                validate={{
                                    required: 'Start date is required!',
                                }}
                                style="flex-auto"
                                type="datetime-local"
                            />
                            <InputForm
                                label="End Date & Time"
                                register={register}
                                errors={errors}
                                id="endTime"
                                validate={{
                                    required: 'End date is required!',
                                }}
                                style="flex-auto"
                                type="datetime-local"
                            />

                            {/* <InputForm
                                label="usageLimit"
                                register={register}
                                errors={errors}
                                id="usageLimit"
                                validate={{
                                    required: 'usageLimit cannot be blank !',
                                    pattern: {
                                        value: /^[^\s]/,
                                        message:
                                            'usageLimit cannot start with a space !',
                                    },
                                }}
                                style="flex-auto "
                                placeholder="usageLimit of new promotion..."
                                type="number"
                            /> */}
                        </div>
                    </div>
                    <div className="my-6">
                        <Button type="submit">Create new flashSale</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFlashSale;
