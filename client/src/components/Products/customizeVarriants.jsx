import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, InputForm, Loading } from '..';
import { toast } from 'react-toastify';
import { convertToBase64 } from '../../ultils/helpers';
import { showModal } from '../../store/app/appSlice';
import { useDispatch } from 'react-redux';
import { apiAddVarriant } from '../../apis';

const CustomizeVarriants = ({
    customizeVarriants,
    setCustomizeVarriants,
    // render,
}) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
        // setValue,
    } = useForm();
    const dispatch = useDispatch();
    // Review hình ảnh
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });
    const [hoverElm, setHoverElm] = useState(null);
    useEffect(() => {
        reset({
            title: customizeVarriants?.title,
            color: customizeVarriants?.color,
            price: customizeVarriants?.price,
        });
    }, [customizeVarriants]);

    // Xử lý hiển thị ảnh trước khi tạo product
    const handlePreviewThumb = async (file) => {
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
            setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
        } catch (err) {
            toast.error('Có lỗi khi xử lý ảnh!');
            console.error(err);
        }
    };
    const handlePreviewImages = async (files) => {
        // console.log(files);
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                toast.warning('File not supported!');
                return;
            }
            const base64 = await convertToBase64(file);
            imagesPreview.push(base64);
        }

        setPreview((prev) => ({ ...prev, images: imagesPreview }));
    };

    // Image
    useEffect(() => {
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) {
            handlePreviewThumb(watch('thumb')[0]);
        }
    }, [watch('thumb')]);

    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0) {
            handlePreviewImages(watch('images'));
        }
    }, [watch('images')]);

    // Funtion xử lý add varriant
    const handleAddVarriant = async (data) => {
        if (data?.color === customizeVarriants?.color) {
            toast.error('Color not changed !');
        } else {
            const formData = new FormData();
            for (let i of Object.entries(data)) formData.append(i[0], i[1]);
            if (data.thumb) formData.append('thumb', data.thumb[0]);
            if (data.images) {
                for (let image of data.images) formData.append('images', image);
            }
            dispatch(
                showModal({ isShowModal: true, modalChildren: <Loading /> })
            );
            const response = await apiAddVarriant(
                formData,
                customizeVarriants?._id
            );
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success(response.mess);
                reset();
                setPreview({
                    thumb: null,
                    images: [],
                });
            } else {
                toast.error(response.mess);
            }
        }
    };
    return (
        <div className="relative flex flex-col w-full">
            <div className="h-[75px]  flex justify-between items-center  px-4 border-b border-gray-300 fixed right-0 left-[327px] top-0 bg-gray-100">
                <h1 className="text-3xl font-bold">
                    Customize varriants of Product
                </h1>
                <span
                    onClick={() => setCustomizeVarriants(null)}
                    className="text-[17px] cursor-pointer text-main hover:underline"
                >
                    Cancel
                </span>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col p-4">
                <form onSubmit={handleSubmit(handleAddVarriant)}>
                    <div className="w-full gap-4 my-6 ">
                        <InputForm
                            label="Original name"
                            register={register}
                            errors={errors}
                            id="title"
                            validate={{
                                required: 'Product name cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message:
                                        'Product name cannot start with a space !',
                                },
                            }}
                            placeholder="Name of varriant..."
                            // readOnly
                            fullWith
                            // style="flex-2/4 "
                        />
                        {/* <InputForm
                            label=" Original price"
                            register={register}
                            errors={errors}
                            id="price"
                            readOnly
                            fullWith
                            style="flex-1/4 "
                        />
                        <InputForm
                            label=" Original color "
                            register={register}
                            errors={errors}
                            id="color"
                            readOnly
                            fullWith
                            style="flex-1/4 "
                        /> */}
                    </div>
                    <div className="flex w-full gap-4 my-6">
                        <InputForm
                            label="Price varriant"
                            register={register}
                            errors={errors}
                            id="price"
                            validate={{
                                required: 'Product price cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message:
                                        'Product price cannot start with a space !',
                                },
                            }}
                            style="flex-auto "
                            placeholder="Price of varriant..."
                            type="number"
                        />
                        <InputForm
                            label="Color varriant"
                            register={register}
                            errors={errors}
                            id="color"
                            validate={{
                                required: 'Product color cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message:
                                        'Product color cannot start with a space !',
                                },
                            }}
                            style="flex-auto "
                            placeholder="Color of varriant..."
                        />
                    </div>
                    <div className="flex flex-col gap-4 mt-6">
                        <label
                            className="text-lg font-semibold text-gray-700"
                            htmlFor="thumb"
                        >
                            Upload Thumb
                        </label>
                        <input
                            className="block w-full text-sm text-gray-500 file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            type="file"
                            id="thumb"
                            {...register('thumb', {
                                required: 'Please select a image',
                            })}
                        />
                        {errors['thumb'] && (
                            <small className="text-xs italic text-main">
                                {errors['thumb']?.message}
                            </small>
                        )}
                    </div>
                    {preview?.thumb && (
                        <div className="my-4">
                            <img
                                src={preview?.thumb}
                                alt="thumb"
                                className="w-[200px] object-contain"
                            ></img>
                        </div>
                    )}
                    <div className="flex flex-col gap-4 mt-6">
                        <label
                            className="text-lg font-semibold text-gray-700"
                            htmlFor="products"
                        >
                            Upload images of product
                        </label>
                        <input
                            className="block w-full text-gray-500 file:cursor-pointer  text-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:text-[14px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            type="file"
                            id="products"
                            {...register('images', {
                                required: 'Please select images product',
                            })}
                            multiple
                        />
                        {errors['images'] && (
                            <small className="text-xs italic text-main">
                                {errors['images']?.message}
                            </small>
                        )}
                    </div>
                    {preview?.images.length > 0 && (
                        <div className="flex flex-wrap w-full gap-2 my-4">
                            {preview?.images?.map((el, index) => (
                                <div
                                    onMouseEnter={() => setHoverElm(el?.name)}
                                    key={index}
                                    className="relative w-fit"
                                    onMouseLeave={() => setHoverElm(null)}
                                >
                                    <img
                                        src={el}
                                        alt="products"
                                        className="w-[200px] object-contain "
                                    ></img>
                                    {hoverElm === el?.name && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black opacity-10 "></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="my-6">
                        <Button type="submit">Add varriant</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(CustomizeVarriants);
