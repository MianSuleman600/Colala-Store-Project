// src/utils/fileHandler.js
export const handleFileChange = (fileInput, callback) => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    callback({ name: file.name, type: file.type, file, fileUrl: e.target.result });
  };
  reader.readAsDataURL(file);
};
