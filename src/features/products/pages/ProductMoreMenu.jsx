// src/components/products/ProductMoreMenu.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  MegaphoneIcon,
  ChartBarIcon,
  LinkIcon,
  ShareIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const ProductMoreMenu = ({
  currentStatus = 'available',
  onEdit,
  onBoost,
  onStats,
  onCopyLink,
  onShare,
  onMarkSold,
  onMarkUnavailable,
  onMarkAvailable,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    if (open) {
      document.addEventListener('mousedown', onClick);
      document.addEventListener('keydown', onEsc);
    }
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button className="p-2 rounded-full hover:bg-gray-200" title="More" onClick={() => setOpen((v) => !v)}>
        <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-xl border z-50">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <button onClick={() => { setOpen(false); onEdit?.(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <PencilIcon className="h-4 w-4" /> Edit Product
              </button>
            </li>
            <li>
              <button onClick={() => { setOpen(false); onBoost?.(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <MegaphoneIcon className="h-4 w-4" /> Boost Post
              </button>
            </li>
            <li>
              <button onClick={() => { setOpen(false); onStats?.(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <ChartBarIcon className="h-4 w-4" /> View Stats
              </button>
            </li>
            <li>
              <button onClick={() => { setOpen(false); onCopyLink?.(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <LinkIcon className="h-4 w-4" /> Copy Link
              </button>
            </li>
            <li>
              <button onClick={() => { setOpen(false); onShare?.(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <ShareIcon className="h-4 w-4" /> Share
              </button>
            </li>
            <hr className="my-1" />
            {currentStatus !== 'sold' && (
              <li>
                <button onClick={() => { setOpen(false); onMarkSold?.(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" /> Mark as Sold
                </button>
              </li>
            )}
            {currentStatus !== 'unavailable' && (
              <li>
                <button onClick={() => { setOpen(false); onMarkUnavailable?.(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <XMarkIcon className="h-4 w-4" /> Mark as Unavailable
                </button>
              </li>
            )}
            {currentStatus !== 'available' && (
              <li>
                <button onClick={() => { setOpen(false); onMarkAvailable?.(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" /> Mark as Available
                </button>
              </li>
            )}
            <hr className="my-1" />
            <li>
              <button onClick={() => { setOpen(false); onDelete?.(); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2">
                <TrashIcon className="h-4 w-4" /> Delete
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductMoreMenu;