import React, { memo, useEffect } from 'react';
import { InputForm, Button } from '../../components';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { apiUpdateColor } from '../../apis';

const UpdateColor = ({ editColor, render, setEditColor }) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();
    useEffect(() => {
        reset({
            title: editColor?.title || '',
            hexCode: editColor?.hexCode || '',
        });
    }, [editColor]);

    const handleUpdateColor = async (data) => {
        // console.log(data);
        const response = await apiUpdateColor(data, editColor?._id);
        if (response.success) {
            toast.success(response.mess);
            render();
            setEditColor(null);
        } else {
            toast.error(response.mess);
        }
    };
    return (
        <div className="relative flex flex-col w-full">
            <div className="h-[75px]  flex justify-between items-center  px-4 border-b border-gray-300 fixed right-0 left-[327px] top-0 bg-gray-100">
                <h1 className="text-3xl font-bold">Update Color</h1>
                <span
                    onClick={() => setEditColor(null)}
                    className="text-[17px] cursor-pointer text-main hover:underline"
                >
                    Cancel
                </span>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="p-4">
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(handleUpdateColor)}
                >
                    <InputForm
                        label="Name color"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'Color name cannot be blank !',
                            pattern: {
                                value: /^[^\s]/,
                                message:
                                    'Color name cannot start with a space !',
                            },
                        }}
                        fullWith
                        placeholder="Name of new color..."
                    />
                    <InputForm
                        label="Code color"
                        register={register}
                        errors={errors}
                        id="hexCode"
                        validate={{
                            required: 'HexCode cannot be blank !',
                            pattern: {
                                value: /^[^\s]/,
                                message: 'HexCode cannot start with a space !',
                            },
                        }}
                        fullWith
                        placeholder="HexCode of new color..."
                    />
                    <div className="my-6">
                        <Button type="submit">Update Color</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(UpdateColor);
