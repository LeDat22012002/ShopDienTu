import React, { useCallback, useEffect, useState } from 'react';
import {
    InputForm,
    Select,
    Button,
    MarkdownEditor,
    Loading,
} from '../../../components';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { validate, convertToBase64 } from '../../../ultils/helpers';
import { toast } from 'react-toastify';
import { apiCreateBlogs } from '../../../apis';
import { showModal } from '../../../store/app/appSlice';

const CreateBlogs = () => {
    const dispatch = useDispatch();

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();

    // Review hình ảnh
    const [preview, setPreview] = useState({
        // thumb: null,
        image: null,
    });
    const [payload, setPayload] = useState({
        description: '',
    });

    const [invalidFields, setInvalidFields] = useState([]);
    // const [hoverElm, setHoverElm] = useState(null);
    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload]
    );

    const handlePreviewImage = async (file) => {
        if (!file) {
            return;
        }

        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            toast.warning('File không được hỗ trợ! Chỉ nhận PNG hoặc JPEG.');
            return;
        }

        try {
            const base64Thumb = await convertToBase64(file);
            setPreview((prev) => ({ ...prev, image: base64Thumb }));
        } catch (err) {
            toast.error('Có lỗi khi xử lý ảnh!');
            console.error(err);
        }
    };
    // const handlePreviewImages = async (files) => {
    //     // console.log(files);
    //     const imagesPreview = [];
    //     for (let file of files) {
    //         if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
    //             toast.warning('File not supported!');
    //             return;
    //         }
    //         const base64 = await convertToBase64(file);
    //         imagesPreview.push({ name: file.name, path: base64 });
    //     }

    //     setPreview((prev) => ({ ...prev, images: imagesPreview }));
    // };
    useEffect(() => {
        const imageFiles = watch('image');
        if (imageFiles && imageFiles.length > 0) {
            handlePreviewImage(imageFiles[0]);
        }
    }, [watch('image')]);

    const handleCreateBlogs = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            const finalPayload = { ...data, ...payload };
            const formData = new FormData();
            for (let i of Object.entries(finalPayload))
                formData.append(i[0], i[1]);
            if (finalPayload.image)
                formData.append('image', finalPayload.image[0]);

            dispatch(
                showModal({ isShowModal: true, modalChildren: <Loading /> })
            );
            const response = await apiCreateBlogs(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success(response.mess);
                reset();
                setPayload({
                    description: '',
                });

                setPreview({
                    image: null,
                    // images: [],
                });
            } else {
                toast.error(response.mess);
            }
        }
    };

    return (
        <div className="w-full">
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-300">
                <span>Create New Blog</span>
            </h1>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateBlogs)}>
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
                        placeholder="Title of new blog..."
                    />
                    <div className="flex w-full gap-4 my-6">
                        <InputForm
                            label="Author"
                            register={register}
                            errors={errors}
                            id="author"
                            validate={{
                                required: 'Author cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message:
                                        'Author cannot start with a space !',
                                },
                            }}
                            style="flex-auto "
                            placeholder="Author of new blog..."
                        />
                        <InputForm
                            label="Category"
                            register={register}
                            errors={errors}
                            id="category"
                            validate={{
                                required: 'Category cannot be blank !',
                                pattern: {
                                    value: /^[^\s]/,
                                    message:
                                        'Category cannot start with a space !',
                                },
                            }}
                            style="flex-auto "
                            placeholder="Category of new blog..."
                        />
                    </div>

                    <div className="w-full gap-4 my-6 ">
                        <MarkdownEditor
                            name="description"
                            changeValue={changeValue}
                            label="Blog description"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        <label
                            className="text-lg font-semibold text-gray-700"
                            htmlFor="image"
                        >
                            Upload image
                        </label>
                        <input
                            className="block w-full text-sm text-gray-500 file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            type="file"
                            id="image"
                            {...register('image', {
                                required: 'Please select a image',
                            })}
                        />
                        {errors['image'] && (
                            <small className="text-xs italic text-main">
                                {errors['image']?.message}
                            </small>
                        )}
                    </div>
                    {preview?.image && (
                        <div className="my-4">
                            <img
                                src={preview?.image}
                                alt="image"
                                className="w-[200px] object-contain"
                            ></img>
                        </div>
                    )}

                    <div className="my-6">
                        <Button type="submit">Create new Blog</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlogs;
