// src/features/products/hooks/useProductActions.js
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateProduct, useDeleteProduct, useMarkProductStatusMutation } from '../../services/mutations/useProductMutation';
import { useToast } from '../../components/ui/ToastProvider';

const normalizeStatus = (s) => {
  const raw = String(s || '').trim().toLowerCase();
  if (raw === 'available' || raw === 'active') return 'available';
  if (['sold', 'sold out', 'out of stock', 'oos'].includes(raw)) return 'sold';
  if (raw === 'unavailable' || raw === 'inactive') return 'unavailable';
  return 'available';
};

export const useProductActions = ({ productId, userId }) => {
  const queryClient = useQueryClient();
  const { push } = useToast();

  const updateMutation = useUpdateProduct(userId);
  const deleteMutation = useDeleteProduct(userId);
  const markStatusMutation = useMarkProductStatusMutation({ userId });

  const markStatus = (status) => {
    markStatusMutation.mutate(
      { productId, status },
      {
        onSuccess: () => {
          push(`Product marked as ${status}.`, { type: 'success' });
          queryClient.invalidateQueries({ queryKey: ['productDetail', productId] });
          queryClient.invalidateQueries({ queryKey: ['myProducts', userId || 'anonymous'] });
        },
        onError: (err) => push(err?.message || 'Failed to update status.', { type: 'error' }),
      }
    );
  };

  const deleteProduct = (onDone) => {
    deleteMutation.mutate(productId, {
      onSuccess: () => {
        push('Product deleted successfully!', { type: 'success' });
        queryClient.invalidateQueries({ queryKey: ['myProducts', userId || 'anonymous'] });
        onDone?.();
      },
      onError: (err) => push(err?.message || 'Failed to delete product', { type: 'error' }),
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      push('Link copied to clipboard.', { type: 'success' });
    } catch {
      push('Failed to copy link.', { type: 'error' });
    }
  };

  const shareLink = async (title = 'Product') => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        push('Link copied to clipboard.', { type: 'success' });
      }
    } catch {}
  };

  return { markStatus, deleteProduct, copyLink, shareLink, normalizeStatus };
};