// src/utils/data/dummyReviews.js
import reviewerAvatar1 from '../../assets/images/productImages/2.jpeg';
import reviewerAvatar2 from '../../assets/images/productImages/3.jpeg';
import reviewerAvatar3 from '../../assets/images/productImages/4.jpeg';
import reviewProduct1 from '../../assets/images/productImages/1.png';
import reviewProduct2 from '../../assets/images/productImages/2.jpeg';
import reviewProduct3 from '../../assets/images/productImages/3.jpeg';

export const DUMMY_STORE_REVIEWS = [
  {
    id: 'sr1',
    reviewerName: 'Adam Sandler',
    reviewerAvatar: reviewerAvatar1,
    rating: 4,
    reviewText: 'The Store is amazing',
    dateCreated: '07-16-25/05:33AM',
    storeId: 'store-1',
  },
  {
    id: 'sr2',
    reviewerName: 'Chris Pine',
    reviewerAvatar: reviewerAvatar2,
    rating: 5,
    reviewText: 'Great service and fast delivery!',
    dateCreated: '07-15-25/10:00AM',
    storeId: 'store-1',
  },
  {
    id: 'sr3',
    reviewerName: 'Sophia Loren',
    reviewerAvatar: reviewerAvatar3,
    rating: 3,
    reviewText: 'Good products, but delivery was a bit slow.',
    dateCreated: '07-14-25/09:00AM',
    storeId: 'store-1',
  },
];

export const DUMMY_PRODUCT_REVIEWS = [
  {
    id: 'pr1',
    reviewerName: 'Adam Sandler',
    reviewerAvatar: reviewerAvatar1,
    rating: 4,
    reviewText: 'Really great product, I enjoyed using it for a long time',
    dateCreated: '07-16-25/05:33AM',
    productImages: [reviewProduct1, reviewProduct2, reviewProduct3],
    productId: 'prod-1',
  },
  {
    id: 'pr2',
    reviewerName: 'Chris Evans',
    reviewerAvatar: reviewerAvatar2,
    rating: 5,
    reviewText: 'Fantastic quality, highly recommend!',
    dateCreated: '07-15-25/11:00AM',
    productImages: [reviewProduct2],
    productId: 'prod-2',
  },
  {
    id: 'pr3',
    reviewerName: 'Scarlett Johansson',
    reviewerAvatar: reviewerAvatar3,
    rating: 4,
    reviewText: 'Solid product for the price. Would buy again.',
    dateCreated: '07-14-25/09:00AM',
    productImages: [reviewProduct3, reviewProduct1],
    productId: 'prod-3',
  },
];