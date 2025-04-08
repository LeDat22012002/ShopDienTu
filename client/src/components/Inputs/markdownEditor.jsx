import { Editor } from '@tinymce/tinymce-react';
import { memo } from 'react';

const MarkdownEditor = ({
    label,
    value,
    changeValue,
    name,
    invalidFields,
    setInvalidFields,
    height = 500,
}) => {
    return (
        <div className="flex flex-col">
            <span className="">{label}</span>
            <Editor
                apiKey={import.meta.env.VITE_APP_MCETITNY} // Hoặc bỏ trống để dùng free
                initialValue={value}
                init={{
                    height,
                    menubar: true,
                    plugins:
                        'lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                         bullist numlist outdent indent | removeformat | help',
                    toolbar_mode: 'sliding',
                    content_style: `
                        body {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        line-height: 1.6;
                        
                    }`,
                }}
                onChange={(e) =>
                    changeValue((prev) => ({
                        ...prev,
                        [name]: e.target.getContent(),
                    }))
                }
                onFocus={() => {
                    setInvalidFields && setInvalidFields([]);
                }}
            />
            {invalidFields?.some((el) => el.name === name) && (
                <small className="text-sm italic text-main">
                    {invalidFields?.find((el) => el.name === name)?.mess}
                </small>
            )}
        </div>
    );
};
export default memo(MarkdownEditor);
