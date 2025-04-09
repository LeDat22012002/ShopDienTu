import React, { memo, useCallback, useEffect, useState } from 'react';
import {
    InputForm,
    Select,
    Button,
    MarkdownEditor,
    Loading,
} from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { validate, convertToBase64 } from '../../ultils/helpers';
import { toast } from 'react-toastify';
import { apiUpdateProduct } from '../../apis';
import { showModal } from '../../store/app/appSlice';

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
    const { categories } = useSelector((state) => state.app);
    const dispatch = useDispatch();
    // console.log(editProduct);
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
        setValue,
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

    // Set value cho useForm
    useEffect(() => {
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',
            category: editProduct?.category || '',
        });
        setPayload({
            description:
                typeof editProduct?.description === 'object'
                    ? editProduct?.description?.join(', ')
                    : editProduct?.description,
        });
        setPayloadDes({
            shortDescription:
                typeof editProduct?.shortDescription === 'object'
                    ? editProduct?.shortDescription?.join(', ')
                    : editProduct?.shortDescription,
        });
        setPreview({
            thumb: editProduct?.thumb || '',
            images: editProduct?.images || [],
        });
    }, [editProduct]);
    // console.log(categories);
    useEffect(() => {
        const selectedCategory = categories.find(
            (cat) => cat.title === watch('category')
        );
        const brandExists = selectedCategory?.brand?.some(
            (b) => b.title === editProduct?.brand
        );

        if (brandExists) {
            setValue('brand', editProduct.brand);
        }
    }, [watch('category'), categories]);

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
            imagesPreview.push(base64);
        }

        setPreview((prev) => ({ ...prev, images: imagesPreview }));
    };
    // IMAGE
    // useEffect(() => {
    //     const thumbFiles = watch('thumb');
    //     if (thumbFiles && thumbFiles.length > 0) {
    //         handlePreviewThumb(thumbFiles[0]);
    //     }
    // }, [watch('thumb')]);

    // useEffect(() => {
    //     if (watch('images')) {
    //         handlePreviewImages(watch('images'));
    //     }
    // }, [watch('images')]);

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

    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if (data.category) {
                data.category = categories?.find(
                    (el) => el.title === data.category
                )?.title;
            }
            if (data.brand) {
                const matchedBrand = categories
                    ?.flatMap((cat) => cat.brand)
                    ?.find((brand) => brand.title === data.brand);
                data.brand = matchedBrand?.title;
            }
            const finalPayload = {
                ...data,
                ...payload,
                ...payloadDes,
            };

            const formData = new FormData();
            for (let i of Object.entries(finalPayload))
                formData.append(i[0], i[1]);

            if (finalPayload.thumb)
                formData.append(
                    'thumb',
                    finalPayload?.thumb?.length === 0
                        ? preview.thumb
                        : finalPayload.thumb[0]
                );
            if (finalPayload.images) {
                const images =
                    finalPayload?.images?.length === 0
                        ? preview.images
                        : finalPayload.images;
                for (let image of images) formData.append('images', image);
            }
            dispatch(
                showModal({ isShowModal: true, modalChildren: <Loading /> })
            );
            const response = await apiUpdateProduct(formData, editProduct?._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            // console.log('dataaa', response);
            if (response.success) {
                toast.success(response.mess);
                render();
                setEditProduct(null);
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
                <h1 className="text-3xl font-bold">Update Product</h1>
                <span
                    onClick={() => setEditProduct(null)}
                    className="text-[17px] cursor-pointer text-main hover:underline"
                >
                    Cancel
                </span>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
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
                                code: el?.title,
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
                                ?.find((el) => el?.title === watch('category'))
                                ?.brand?.map((item) => ({
                                    code: item?.title,
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
                            value={payload.description}
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
                            value={payloadDes.shortDescription}
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
                            {...register('thumb')}
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
                            {...register('images')}
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
                        <Button type="submit">Update product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default memo(UpdateProduct);
