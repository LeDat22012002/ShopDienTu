import React, { useCallback, useEffect, useState } from 'react';
import {
    InputForm,
    Select,
    Button,
    MarkdownEditor,
    Loading,
} from '../../components';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { validate, convertToBase64 } from '../../ultils/helpers';
import { toast } from 'react-toastify';
import { apiCreateProduct } from '../../apis';
import { showModal } from '../../store/app/appSlice';

const CreateProduct = () => {
    const { categories } = useSelector((state) => state.app);
    // console.log(categories);
    const dispatch = useDispatch();
    // console.log(categories);
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm();

    // Review hình ảnh
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });
    const [payload, setPayload] = useState({
        description: '',
    });
    const [payloadDes, setPayloadDes] = useState({
        shortDescription: '',
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const [hoverElm, setHoverElm] = useState(null);
    const changeValue = useCallback(
        (e) => {
            setPayload(e);
        },
        [payload]
    );
    const changeValueDes = useCallback(
        (e) => {
            setPayloadDes(e);
        },
        [payloadDes]
    );
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
            imagesPreview.push({ name: file.name, path: base64 });
        }

        setPreview((prev) => ({ ...prev, images: imagesPreview }));
    };
    useEffect(() => {
        const thumbFiles = watch('thumb');
        if (thumbFiles && thumbFiles.length > 0) {
            handlePreviewThumb(thumbFiles[0]);
        }
    }, [watch('thumb')]);

    useEffect(() => {
        handlePreviewImages(watch('images'));
    }, [watch('images')]);

    // console.log(preview);
    // console.log(preview);
    // console.log(watch('category'));
    // Xử lý  khi tạo sản phẩm
    const handleCreateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if (data.category) {
                data.category = categories?.find(
                    (el) => el._id === data.category
                )?.title;
            }
            if (data.brand) {
                const matchedBrand = categories
                    ?.flatMap((cat) => cat.brand)
                    ?.find((brand) => brand._id === data.brand);
                data.brand = matchedBrand?.title;
            }
            const finalPayload = { ...data, ...payload, ...payloadDes };
            const formData = new FormData();
            for (let i of Object.entries(finalPayload))
                formData.append(i[0], i[1]);
            if (finalPayload.thumb)
                formData.append('thumb', finalPayload.thumb[0]);
            if (finalPayload.images) {
                for (let image of finalPayload.images)
                    formData.append('images', image);
            }
            dispatch(
                showModal({ isShowModal: true, modalChildren: <Loading /> })
            );
            const response = await apiCreateProduct(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
                toast.success(response.mess);
                reset();
                setPayload({
                    description: '',
                });
                setPayloadDes({
                    shortDescription: '',
                });
                setPreview({
                    thumb: null,
                    images: [],
                });
            } else {
                toast.error(response.mess);
            }
        }
    };

    // const handleRemoveImage = (name) => {
    //     const files = [...watch('images')]
    //     reset({
    //         images: files?.filter(el => el.name !== name)
    //     })
    //     if (preview.images?.some((el) => el.name === name))
    //         setPreview((prev) => ({
    //             ...prev,
    //             images: prev.images?.filter((el) => el.name !== name),
    //         }));
    // };
    return (
        <div className="w-full">
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-300">
                <span>Create New Product</span>
            </h1>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateProduct)}>
                    <InputForm
                        label="Name product"
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
                        fullWith
                        placeholder="Name of new product..."
                    />
                    <div className="flex w-full gap-4 my-6">
                        <InputForm
                            label="Price product"
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
                            placeholder="Price of new product..."
                            type="number"
                        />
                        <InputForm
                            label="Quantity product"
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
                        <InputForm
                            label="Color product"
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
                            placeholder="Color of new product..."
                        />
                    </div>
                    <div className="flex w-full gap-4 my-6">
                        <Select
                            label="Category product"
                            options={categories?.map((el) => ({
                                code: el?._id,
                                value: el?.title,
                            }))}
                            register={register}
                            id="category"
                            validate={{
                                required: 'Please select a product category !',
                            }}
                            style="flex-auto "
                            errors={errors}
                            withFull
                        />
                        <Select
                            label="Brand product"
                            options={categories
                                ?.find((el) => el?._id === watch('category'))
                                ?.brand?.map((item) => ({
                                    code: item?._id,
                                    value: item?.title,
                                }))}
                            register={register}
                            id="brand"
                            validate={{
                                required: 'Please select a product brand !',
                            }}
                            style="flex-auto "
                            errors={errors}
                            withFull
                        />
                    </div>
                    <div className="w-full gap-4 my-6 ">
                        <MarkdownEditor
                            name="description"
                            changeValue={changeValue}
                            label="Product description"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </div>
                    <div className="w-full gap-4 my-6 ">
                        <MarkdownEditor
                            name="shortDescription"
                            changeValue={changeValueDes}
                            label="Product description short"
                            height={300}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
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
                                        src={el?.path}
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
                        <Button type="submit">Create new product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
