import React from 'react';
import Button from '../ui/Button';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const BulkUploadSection = ({
  templateDownloadUrl = '/path/to/bulk_template.csv',
  onFileUpload = (file) => console.log('Bulk upload file selected:', file),
  onUploadClick = () => console.log('Bulk upload initiated! (Simulated)'),
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl space-y-6">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">Bulk Upload Products</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload several products at once using our template.
        </p>
      </div>

      {/* Instructions */}
      <div className="space-y-3">
        {['Download the template below.', 'Fill in the template with your product data.', 'Upload the completed file to finalize.'].map((text, index) => (
          <p key={index} className="flex items-center text-gray-700">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold mr-2">
              {index + 1}
            </span>
            {text}
          </p>
        ))}
      </div>

      {/* Download Template */}
      <a href={templateDownloadUrl} download className="block">
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-300 bg-white shadow-sm transition-colors hover:border-blue-500">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-6 w-6 text-gray-500" />
            <div>
              <p className="font-medium text-gray-800">Download CSV Template</p>
              <p className="text-xs text-gray-500">Template for bulk product upload</p>
            </div>
          </div>
          <ArrowDownTrayIcon className="h-6 w-6 text-gray-500 transition-colors group-hover:text-blue-500" />
        </div>
      </a>

      {/* Upload Area */}
      <div className="text-center">
        <label
          htmlFor="bulk-upload-file"
          className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-gray-300 bg-white cursor-pointer transition-colors hover:border-blue-500 hover:bg-gray-100"
        >
          <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">Click to upload your file</span>
          <input
            id="bulk-upload-file"
            type="file"
            name="bulkUploadFile"
            className="sr-only"
            onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0])}
            accept=".csv"
          />
        </label>
      </div>

      {/* Submit Button */}
      <Button
        onClick={onUploadClick}
        className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
      >
        Upload Products
      </Button>
    </div>
  );
};

export default BulkUploadSection;
