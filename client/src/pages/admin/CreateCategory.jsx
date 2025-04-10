import React, { useEffect, useState } from 'react';
import { InputForm, Button, Loading, InputCheckbox } from '../../components';
import { useForm } from 'react-hook-form';
import { convertToBase64 } from '../../ultils/helpers';
import { toast } from 'react-toastify';
import { apiGetAllBrands, apiCreateCategories } from '../../apis';
import { useDispatch } from 'react-redux';
import { showModal } from '../../store/app/appSlice';
const CreateCategory = () => {
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        reset,
        watch,
        handleSubmit,
    } = useForm();
    // gán data lấy từ API Brands
    const [brands, setBrands] = useState(null);
    const fetchBrands = async () => {
        const rsbrands = await apiGetAllBrands();
        // console.log(rsbrands);
        if (rsbrands.success) {
            setBrands(rsbrands.brands);
        }
    };

    // Image
    const [preview, setPreview] = useState({
        image: null,
    });
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

    const handleCreateCategory = async (data) => {
        const formData = new FormData();

        const brandList = Array.isArray(data.brand)
            ? data.brand
            : typeof data.brand === 'string'
            ? data.brand.split(',') // xử lý khi value là "id1,id2,id3"
            : [];

        brandList.forEach((id) => formData.append('brand', id));

        //  Append các field còn lại, trừ 'brand' và 'image'
        for (let [key, value] of Object.entries(data)) {
            if (key !== 'image' && key !== 'brand') {
                formData.append(key, value);
            }
        }

        // Xử lý image (nếu có)
        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        }
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
        const response = await apiCreateCategories(formData);
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        if (response.success) {
            toast.success(response.mess);
            reset();
            setPreview({
                image: null,
            });
        } else {
            toast.error(response.mess);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);
    return (
        <div className="relative flex flex-col w-full">
            <div className="h-[75px]  flex items-center  px-4 border-b border-gray-300 fixed right-0 left-[327px] top-0 bg-gray-100">
                <h1 className="text-3xl font-bold">Create Category</h1>
            </div>
            <div className="h-[69px] w-full mt-2"></div>
            <div className="flex flex-col p-4">
                <form onSubmit={handleSubmit(handleCreateCategory)}>
                    <InputForm
                        label="Name category"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: 'Category name cannot be blank !',
                            pattern: {
                                value: /^[^\s]/,
                                message:
                                    'Category name cannot start with a space !',
                            },
                        }}
                        fullWith
                        placeholder="Name of new category..."
                    />
                    <div className="flex flex-col gap-2 mb-4 mt-[20px]">
                        <p className="text-[14px] font-semibold text-gray-700">
                            Choose brand
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                            {brands?.map((brand) => (
                                <InputCheckbox
                                    key={brand._id}
                                    name="brand"
                                    value={brand._id}
                                    label={brand.title}
                                    register={register}
                                    validate={{
                                        validate: (value, values) => {
                                            return (
                                                values?.brand?.length > 0 ||
                                                'Please select a brand !'
                                            );
                                        },
                                    }}
                                    errors={errors}
                                />
                            ))}
                        </div>
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
                        <Button type="submit">Create new category</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategory;
