import React from 'react';
import { InputForm, Button, Select } from '../../components';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import { apiCreatePromotion } from '../../apis';

const TypeDiscountArr = [
    {
        value: 'percent',
        label: 'Giảm theo phần trăm (%)',
    },
    {
        value: 'fixed',
        label: 'Giảm theo số tiền cố định (VNĐ)',
    },
];
const ActiveArr = [
    {
        value: 'true',
        label: 'Hoạt động',
    },
    {
        value: 'false',
        label: 'Đã khóa',
    },
];

const CreatePromotion = () => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();

    const handleCreatePromotion = async (data) => {
        const response = await apiCreatePromotion(data);

        if (response.success) {
            reset();
            toast.success(response.mess);
        } else {
            toast.error(response.mess);
        }
    };

    return (
        <div className="relative flex flex-col w-full">
            <div className="h-[75px]  flex items-center  px-4 border-b border-gray-300 fixed right-0 left-[327px] top-0 bg-gray-100">
                <h1 className="text-3xl font-bold">Create Promotion</h1>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col p-4">
                <form
                    className="flex flex-col"
                    onSubmit={handleSubmit(handleCreatePromotion)}
                >
                    <div className="flex gap-2">
                        <InputForm
                            label="Code"
                            register={register}
                            errors={errors}
                            id="code"
                            validate={{
                                required: 'code cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message: 'code cannot start with a space !',
                                },
                            }}
                            style="flex-auto "
                            placeholder="Code of new promotion..."
                        />
                        <div className="flex gap-2">
                            <Select
                                label="Type Discount"
                                options={TypeDiscountArr?.map((el) => ({
                                    code: el?.value,
                                    value: el?.label,
                                }))}
                                register={register}
                                id="discountType"
                                validate={{
                                    required: 'Please select a discountType !',
                                }}
                                style="flex-auto "
                                errors={errors}
                            />
                            <Select
                                label="Active"
                                options={ActiveArr?.map((el) => ({
                                    code: el?.value,
                                    value: el?.label,
                                }))}
                                register={register}
                                id="isActive"
                                validate={{
                                    required: 'Please select!',
                                }}
                                style="flex-auto "
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3 ">
                        <InputForm
                            label="Description"
                            register={register}
                            errors={errors}
                            id="description"
                            validate={{
                                required: 'description cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message:
                                        'description cannot start with a space !',
                                },
                            }}
                            style="flex-auto "
                            placeholder="description of new promotion..."
                        />
                    </div>
                    <div className="flex gap-2 mt-3 ">
                        <InputForm
                            label="discountValue"
                            register={register}
                            errors={errors}
                            id="discountValue"
                            validate={{
                                required: 'discountValue cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message:
                                        'discountValue cannot start with a space !',
                                },
                            }}
                            style="flex-auto "
                            placeholder="discountValue of new promotion..."
                            type="number"
                        />
                        <InputForm
                            label="minOrderValue"
                            register={register}
                            errors={errors}
                            id="minOrderValue"
                            validate={{
                                required: 'minOrderValue cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message:
                                        'minOrderValue cannot start with a space !',
                                },
                            }}
                            style="flex-auto "
                            placeholder="minOrderValue of new promotion..."
                            type="number"
                        />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <InputForm
                            label="Start Date"
                            register={register}
                            errors={errors}
                            id="startDate"
                            validate={{
                                required: 'Start date is required!',
                            }}
                            style="flex-auto"
                            type="date"
                        />
                        <InputForm
                            label="End Date"
                            register={register}
                            errors={errors}
                            id="endDate"
                            validate={{
                                required: 'End date is required!',
                            }}
                            style="flex-auto"
                            type="date"
                        />
                        <InputForm
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
                        />
                    </div>

                    <div className="my-6">
                        <Button type="submit">Create new promotion</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePromotion;
