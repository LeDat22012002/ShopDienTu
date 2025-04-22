import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, InputForm, Select } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import avatarDefault from '../../assets/avt1.png';
import { apiUpdateCurrent } from '../../apis';
import { getCurent } from '../../store/user/asyncActions';
import { toast } from 'react-toastify';
import { convertToBase64 } from '../../ultils/helpers';
import dataGoogleMap from '../../data/data.json';

const Personal = () => {
    const { current } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors, isDirty },
        handleSubmit,
        watch,
        setValue,
        reset,
    } = useForm();

    // Review hình ảnh
    const [preview, setPreview] = useState({
        avatar: null,
    });

    useEffect(() => {
        if (current) {
            reset({
                name: current?.name || '',
                email: current?.email || '',
                phone: current?.phone || '',
                city: current?.city || '',
                district: current?.district || '',
                ward: current?.ward || '',
                detail: current?.detail || '',
            });

            setTimeout(() => {
                setValue('city', current?.city || '');
                setValue('district', current?.district || '');
                setValue('ward', current?.ward || '');
            }, 10); // delay 1 tick để render kịp options
        }
        setPreview({ avatar: current?.avatar || '' });
    }, [current]);

    // Xử lý hiển thị ảnh trước khi tạo product
    const handlePreviewAvatar = async (file) => {
        if (!file) {
            // toast.warning('Không có file được chọn!');
            return;
        }

        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            toast.warning('File không được hỗ trợ! Chỉ nhận PNG hoặc JPEG.');
            return;
        }

        try {
            const base64Thumb = await convertToBase64(file);
            setPreview((prev) => ({ ...prev, avatar: base64Thumb }));
        } catch (err) {
            toast.error('Có lỗi khi xử lý ảnh!');
            console.error(err);
        }
    };
    useEffect(() => {
        if (watch('avatar') instanceof FileList && watch('avatar').length > 0) {
            handlePreviewAvatar(watch('avatar')[0]);
        }
    }, [watch('avatar')]);
    const handleUpdateInformation = async (data) => {
        const formData = new FormData();

        for (let [key, value] of Object.entries(data)) {
            if (key !== 'avatar') {
                formData.append(key, value);
            }
        }

        if (data.avatar) {
            formData.append(
                'avatar',
                data?.avatar?.length === 0 ? preview.avatar : data.avatar[0]
            );
        }

        const response = await apiUpdateCurrent(formData);
        if (response.success) {
            dispatch(getCurent());
            toast.success(response.mess);
        } else {
            toast.error(response.mess);
        }
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

                    {/* <Select
                        label="City"
                        register={register}
                        fullWith
                        errors={errors}
                        id="city"
                        validate={{
                            required: 'Required fill',
                        }}
                    /> */}
                    <Select
                        label="Province / City"
                        options={dataGoogleMap?.map((el) => ({
                            code: el?.name,
                            value: el?.name,
                        }))}
                        register={register}
                        id="city"
                        // validate={{
                        //     required: 'Please select a province / City!',
                        // }}
                        withFull
                        errors={errors}
                    />
                    <Select
                        label="District"
                        options={dataGoogleMap
                            ?.find((el) => el?.name === watch('city'))
                            ?.level2s?.map((item) => ({
                                code: item?.name,
                                value: item?.name,
                            }))}
                        register={register}
                        id="district"
                        // validate={{
                        //     required: 'Please select a dstrict !',
                        // }}
                        errors={errors}
                        withFull
                    />
                    <Select
                        label="Ward / Commune"
                        options={dataGoogleMap
                            ?.find((el) => el.name === watch('city')) // Tìm thành phố theo ID
                            ?.level2s?.find((d) => d.name === watch('district')) // Tìm quận theo ID
                            ?.level3s?.map((item) => ({
                                code: item.name, // ID của phường
                                value: item.name, // Hiển thị tên phường
                            }))}
                        register={register}
                        id="ward"
                        // validate={{
                        //     required: 'Please select a ward / wommune!',
                        // }}
                        errors={errors}
                        withFull
                    />
                    {/* <InputForm
                        label="District"
                        register={register}
                        fullWith
                        errors={errors}
                        id="district"
                        validate={{
                            required: 'Required fill',
                        }}
                    /> */}

                    {/* <InputForm
                        label="Ward"
                        register={register}
                        fullWith
                        errors={errors}
                        id="ward"
                        validate={{
                            required: 'Required fill',
                        }}
                    /> */}
                    <InputForm
                        label="Home address"
                        register={register}
                        fullWith
                        errors={errors}
                        id="detail"
                        // validate={{
                        //     required: 'Required fill',
                        // }}
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
                        <span className="font-medium">Type login: </span>
                        <span>{current?.loginType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Create At: </span>
                        <span>{moment(current?.createdAt).fromNow()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Avatar: </span>
                        <label htmlFor="file">
                            <img
                                src={current?.avatar || avatarDefault}
                                alt="avatar"
                                className="object-cover w-20 h-20 rounded-full"
                            />
                        </label>
                        <input
                            type="file"
                            id="file"
                            {...register('avatar')}
                            hidden
                        />
                    </div>
                    {current?.loginType === 'account' && isDirty && (
                        <div className="flex justify-end my-6">
                            <Button type="submit">Update information</Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Personal;
