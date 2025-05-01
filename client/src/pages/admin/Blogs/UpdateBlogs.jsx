import React, { memo, useCallback, useEffect, useState } from 'react';
import {
    InputForm,
    Button,
    MarkdownEditor,
    Loading,
} from '../../../components';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { validate, convertToBase64 } from '../../../ultils/helpers';
import { toast } from 'react-toastify';
import { apiUpdateBlog } from '../../../apis';
import { showModal } from '../../../store/app/appSlice';

const UpdateBlogs = ({ editBlog, render, setEditBlog }) => {
    // const { categories } = useSelector((state) => state.app);
    const dispatch = useDispatch();
    console.log(editBlog);
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

    // Set value cho useForm
    useEffect(() => {
        if (!editBlog || Object.keys(editBlog).length === 0) return;
        reset({
            title: editBlog?.title || '',
            category: editBlog?.category || '',
            author: editBlog?.author || '',
        });
        setPayload({
            description:
                typeof editBlog?.description === 'object'
                    ? editBlog?.description?.join(', ')
                    : editBlog?.description,
        });

        setPreview({
            image: editBlog?.image || '',
        });
    }, [editBlog]);
    // console.log(categories);

    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload]
    );

    // Xử lý hiển thị ảnh trước khi tạo product
    const handlePreviewImage = async (file) => {
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
            setPreview((prev) => ({ ...prev, image: base64Thumb }));
        } catch (err) {
            toast.error('Có lỗi khi xử lý ảnh!');
            console.error(err);
        }
    };

    useEffect(() => {
        if (watch('image') instanceof FileList && watch('image').length > 0) {
            handlePreviewImage(watch('image')[0]);
        }
    }, [watch('image')]);

    const handleUpdateBlog = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            const finalPayload = {
                ...data,
                ...payload,
            };

            const formData = new FormData();
            for (let i of Object.entries(finalPayload))
                formData.append(i[0], i[1]);

            if (finalPayload.image)
                formData.append(
                    'image',
                    finalPayload?.image?.length === 0
                        ? preview.image
                        : finalPayload.image[0]
                );

            dispatch(
                showModal({ isShowModal: true, modalChildren: <Loading /> })
            );
            const response = await apiUpdateBlog(formData, editBlog?._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            // console.log('dataaa', response);
            if (response.success) {
                toast.success(response.mess);
                render();
                setEditBlog(null);
                // reset();
                // setPayload({
                //     description: '',
                // });
                // setPayloadDes({
                //     shortDescription: '',
                // });
                // setPreview({
                //     thumb: null,
                //     images: [],
                // });
            } else {
                toast.error(response.mess);
            }
        }
    };
    return (
        <div className="relative flex flex-col w-full">
            <div className="h-[75px]  flex justify-between items-center  px-4 border-b border-gray-300 fixed right-0 left-[327px] top-0 bg-gray-100">
                <h1 className="text-3xl font-bold">Update Blog</h1>
                <span
                    onClick={() => setEditBlog(null)}
                    className="text-[17px] cursor-pointer text-main hover:underline"
                >
                    Cancel
                </span>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateBlog)}>
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
                            value={payload.description}
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        <label
                            className="text-lg font-semibold text-gray-700"
                            htmlFor="image"
                        >
                            Upload Image
                        </label>
                        <input
                            className="block w-full text-sm text-gray-500 file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            type="file"
                            id="image"
                            {...register('image')}
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
                        <Button type="submit">Update blog</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(UpdateBlogs);
