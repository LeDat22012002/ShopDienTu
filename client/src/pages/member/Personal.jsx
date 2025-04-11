import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, InputForm } from '../../components';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Personal = () => {
    const { current } = useSelector((state) => state.user);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    useEffect(() => {
        reset({
            name: current?.name || 'Anonymous',
            email: current?.email || '',
            phone: current?.phone || 'Null',
        });
    }, [current]);
    const handleUpdateInformation = (data) => {
        console.log(data);
    };
    return (
        <div className="relative w-full px-4 ">
            <header className="w-full py-4 text-3xl font-semibold border-b border-gray-200">
                Personal
            </header>
            <div className="w-3/5 py-8 mx-auto">
                <form
                    onSubmit={handleSubmit(handleUpdateInformation)}
                    className="flex flex-col gap-4"
                >
                    <InputForm
                        label="Name"
                        register={register}
                        errors={errors}
                        id="name"
                        validate={{
                            required: 'name cannot be blank !',
                            pattern: {
                                value: /^[^\s]/,
                                message: ' name cannot start with a space !',
                            },
                        }}
                        fullWith
                    />
                    <InputForm
                        label="Email"
                        register={register}
                        fullWith
                        errors={errors}
                        id="email"
                        validate={{
                            required: 'Required fill',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'invalid email address',
                            },
                        }}
                    />
                    <InputForm
                        label="Phone"
                        register={register}
                        fullWith
                        errors={errors}
                        id="phone"
                        validate={{
                            required: 'Required fill',
                            pattern: {
                                value: /^(0|\+84)[0-9]{9}$/,
                                message: 'Invalid phone number',
                            },
                        }}
                    />
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Account Status: </span>
                        <span>
                            {current?.isBlocked ? 'Blocked' : 'Actived'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Role: </span>
                        <span>{current?.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Create At: </span>
                        <span>{moment(current?.createdAt).fromNow()}</span>
                    </div>
                    <div className="flex justify-end my-6">
                        <Button type="submit">Update information</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Personal;
