//D:\Project\frontend\src\utils\FilePreview.js
import React from 'react';

const renderFilePreview = (file) => {
  if (!file) return null;

  const url = file instanceof File ? URL.createObjectURL(file) : file;
  const isImage = typeof url === 'string' && /\.(jpe?g|png|gif|webp|bmp)$/i.test(url);

  return React.createElement(
    'div',
    { className: 'text-center mt-2' },
    file instanceof File
      ? React.createElement('p', { className: 'text-xs text-gray-600 truncate' }, file.name)
      : null,
    isImage
      ? React.createElement('img', {
          src: url,
          alt: 'preview',
          className: 'max-h-24 mx-auto mt-2 rounded object-contain'
        })
      : !(file instanceof File)
      ? React.createElement('p', { className: 'text-xs text-gray-500 break-all' }, `File: ${url}`)
      : null
  );
};

export default renderFilePreview;
