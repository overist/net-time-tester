import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const CustomDropzone = ({ onImageChange }) => {
  // ** State
  const [previewImage, setPreviewImage] = useState("");

  // ** Handler
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
      onImageChange(file);
    };
  };

  const option: any = {
    accept: "image/*",
    onDrop,
  };
  const { getRootProps, getInputProps } = useDropzone(option);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {previewImage ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div
            style={{
              background: "#fff",
              display: "inline-block",
              padding: "10px",
              borderRadius: "50%",
              width: "200px",
              height: "200px",
              backgroundImage: `url(${previewImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            border: "2px #000 dashed",
            padding: "30px 15px",
            marginTop: "10px",
            fontSize: "14px",
            color: "#000",
            userSelect: "none",
          }}
        >
          클릭하여 파일을 업로드 또는 드래그하여 이미지를 업로드해주세요.
        </div>
      )}
    </div>
  );
};

export default CustomDropzone;
