import React from 'react';
import { InputForm, Button } from '../../components';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiCreateColor } from '../../apis';

const CreateColor = () => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm();

    const handleCreateColor = async (data) => {
        const response = await apiCreateColor(data);
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
                <h1 className="text-3xl font-bold">Create Color</h1>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col p-4">
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(handleCreateColor)}
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
                        placeholder="Color of new product..."
                    />
                    <InputForm
                        label="Code color"
                        register={register}
                        errors={errors}
                        id="hexCode"
                        validate={{
                            required: 'Color code cannot be blank !',
                            pattern: {
                                value: /^[^\s]/,
                                message:
                                    'Color code cannot start with a space !',
                            },
                        }}
                        fullWith
                        placeholder="Color code of new color..."
                    />
                    <div className="my-6">
                        <Button type="submit">Create new Color</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateColor;
