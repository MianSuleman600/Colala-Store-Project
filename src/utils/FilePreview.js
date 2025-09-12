// src/utils/FilePreview.js
import React, { useEffect, useMemo, useState } from 'react';

// Guarded checks so this works in any environment
function isFileLike(input) {
  const hasFile = typeof File !== 'undefined';
  const hasBlob = typeof Blob !== 'undefined';
  return (hasFile && input instanceof File) || (hasBlob && input instanceof Blob);
}

function createObjectUrlSafe(blob) {
  try {
    if (typeof URL !== 'undefined' && URL.createObjectURL) {
      return URL.createObjectURL(blob);
    }
  } catch {}
  return '';
}

function revokeObjectUrlSafe(url) {
  try {
    if (typeof URL !== 'undefined' && URL.revokeObjectURL && typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  } catch {}
}

// React component (no JSX)
function FilePreviewComponent(props) {
  const {
    file,        // File | Blob
    url,         // string URL
    alt = 'Preview',
    className = 'max-h-24 mx-auto mt-2 rounded object-contain',
    containerClassName = 'text-center mt-2',
    nameClassName = 'text-xs text-gray-600 truncate',
    showName = true,
    allowPdf = false,
    fallbackNode = null,
  } = props;

  const fileObj = isFileLike(file) ? file : (isFileLike(url) ? url : null);
  const rawUrl = typeof url === 'string' ? url : (typeof file === 'string' ? file : '');

  const [imgError, setImgError] = useState(false);

  const previewUrl = useMemo(() => {
    if (fileObj) return createObjectUrlSafe(fileObj);
    return rawUrl || '';
  }, [fileObj, rawUrl]);

  useEffect(() => {
    return () => {
      revokeObjectUrlSafe(previewUrl);
    };
  }, [previewUrl]);

  const fileName = fileObj && 'name' in fileObj ? fileObj.name : undefined;
  const mime = fileObj && 'type' in fileObj ? fileObj.type : '';

  const base = typeof previewUrl === 'string' ? previewUrl.split('?')[0] : '';
  const isDataImg = typeof previewUrl === 'string' && /^data:image\//i.test(previewUrl);
  const isBlobUrl = typeof previewUrl === 'string' && /^blob:/i.test(previewUrl);
  const hasImgExt = typeof base === 'string' && /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(base);

  const isImage = (mime?.startsWith?.('image/')) || isDataImg || isBlobUrl || hasImgExt;
  const isPdf = (mime === 'application/pdf') || (/\.pdf$/i.test(base));

  const children = [];

  if (showName && fileName) {
    children.push(
      React.createElement('p', { key: 'name', className: nameClassName, title: fileName }, fileName)
    );
  }

  if (previewUrl && isImage && !imgError) {
    children.push(
      React.createElement('img', {
        key: 'img',
        src: previewUrl,
        alt,
        className,
        loading: 'lazy',
        onError: () => setImgError(true),
      })
    );
  } else if (previewUrl && isPdf && allowPdf) {
    children.push(
      React.createElement('embed', {
        key: 'pdf',
        src: previewUrl,
        type: 'application/pdf',
        className: className || 'w-full h-24 rounded',
      })
    );
  } else if (previewUrl) {
    children.push(
      fallbackNode ??
      React.createElement('p', { key: 'fallback', className: 'text-xs text-gray-500 break-all' }, `Preview not available. File: ${previewUrl}`)
    );
  }

  return React.createElement('div', { className: containerClassName }, ...children);
}

// Named export (if you prefer to use it like a component)
export const FilePreview = FilePreviewComponent;

// Backward-compatible default helper (same API you used before)
const renderFilePreview = (fileOrUrl, props = {}) => {
  const fileProps = isFileLike(fileOrUrl)
    ? { file: fileOrUrl }
    : { url: typeof fileOrUrl === 'string' ? fileOrUrl : '' };
  return React.createElement(FilePreviewComponent, { ...fileProps, ...props });
};

export default renderFilePreview;