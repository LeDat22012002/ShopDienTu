import React, { memo, useEffect, useState } from 'react';
import { InputForm, Button, Loading, InputCheckbox } from '../../components';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiGetProduct, apiUpdateFlashSales } from '../../apis';
import moment from 'moment';

const UpdateFlashSale = ({ editFlashSale, render, setEditFlashSales }) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();
    // console.log(editFlashSale);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    useEffect(() => {
        reset({
            title: editFlashSale?.title || '',
            startTime: editFlashSale?.startTime
                ? moment(editFlashSale.startTime).format('YYYY-MM-DDTHH:mm')
                : '',
            endTime: editFlashSale?.endTime
                ? moment(editFlashSale.endTime).format('YYYY-MM-DDTHH:mm')
                : '',
        });

        const selected = {};
        if (editFlashSale?.products?.length > 0) {
            editFlashSale.products.forEach((item) => {
                const id = item.product._id || item.product;
                selected[id] = {
                    salePrice: item.salePrice,
                    quantity: item.quantity,
                };
            });
        }
        setSelectedProducts(selected);
    }, [editFlashSale, reset]);

    const fetchProducts = async () => {
        const rsproducts = await apiGetProduct();
        if (rsproducts.success) {
            setProducts(rsproducts.products);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedProducts((prev) => {
            const updated = { ...prev };
            if (checked) {
                updated[value] = { salePrice: '', quantity: '' };
            } else {
                delete updated[value];
            }
            return updated;
        });
    };

    const handleProductChange = (productId, field, value) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value,
            },
        }));
    };

    const handleUpdateFlashSale = async (data) => {
        const updatedProducts = Object.entries(selectedProducts).map(
            ([productId, info]) => ({
                product: productId,
                salePrice: Number(info.salePrice),
                quantity: Number(info.quantity),
            })
        );

        const payload = {
            title: data.title,
            startTime: data.startTime,
            endTime: data.endTime,
            products: updatedProducts,
        };

        const response = await apiUpdateFlashSales(payload, editFlashSale._id);

        if (response.success) {
            toast.success(response.mess);
            render(); // reload lại danh sách
            setEditFlashSales(null); // tắt form edit
        } else {
            toast.error(response.mess);
        }
    };

    return (
        <div className="relative flex flex-col w-full">
            <div className="h-[75px]  flex justify-between items-center px-4 border-b border-gray-300 fixed right-0 left-[327px] top-0 bg-gray-100">
                <h1 className="text-3xl font-bold">Update FlashSale</h1>
                <span
                    onClick={() => setEditFlashSales(null)}
                    className="text-[17px] cursor-pointer text-main hover:underline"
                >
                    Cancel
                </span>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col p-4">
                <form onSubmit={handleSubmit(handleUpdateFlashSale)}>
                    <InputForm
                        label="Title"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'Title cannot be blank!',
                            pattern: {
                                value: /^[^\s]/,
                                message: 'Title cannot start with a space!',
                            },
                        }}
                        fullWith
                        placeholder="Title of new flashSale..."
                    />

                    <div className="my-4">
                        <p className="mb-2 font-semibold">Choose Products</p>
                        <div className="grid grid-cols-2 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="p-3 border rounded-md"
                                >
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={product._id}
                                            onChange={handleCheckboxChange}
                                            checked={
                                                !!selectedProducts[product._id]
                                            }
                                        />
                                        {product.title}
                                    </label>

                                    {selectedProducts[product._id] && (
                                        <div className="flex flex-col gap-2 mt-2">
                                            <input
                                                type="number"
                                                placeholder="Sale Price"
                                                value={
                                                    selectedProducts[
                                                        product._id
                                                    ].salePrice
                                                }
                                                onChange={(e) =>
                                                    handleProductChange(
                                                        product._id,
                                                        'salePrice',
                                                        e.target.value
                                                    )
                                                }
                                                className="px-2 py-1 border rounded"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Quantity"
                                                value={
                                                    selectedProducts[
                                                        product._id
                                                    ].quantity
                                                }
                                                onChange={(e) =>
                                                    handleProductChange(
                                                        product._id,
                                                        'quantity',
                                                        e.target.value
                                                    )
                                                }
                                                className="px-2 py-1 border rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
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
                    </div>

                    <div className="my-6">
                        <Button type="submit">Update new flashSale</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(UpdateFlashSale);
