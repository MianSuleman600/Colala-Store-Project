// src/utils/data/dummyFeed.js

import userProfilePic from '../../assets/images/profileImage.png';
import postImage1 from '../../assets/images/productImages/2.jpeg';
import postImage2 from '../../assets/images/productImages/3.jpeg';
import postImage3 from '../../assets/images/feed/2.png';
import userProfilePic2 from '../../assets/images/feed/2.png';
import userProfilePic3 from '../../assets/images/feed/3.png';

const DUMMY_POSTS = [
  {
    id: 'post-1',
    userName: 'Sasha Stores',
    userProfilePic: userProfilePic,
    timeAgo: '20 min ago',
    location: 'Lagos, Nigeria',
    imageUrl: postImage1,
    text: 'Get this phone at a cheap price for a limited period',
    likes: 500,
    comments: 26,
    shares: 25,
    commentsList: [
      { id: 'c1', userName: 'Adam Chris', userProfilePic: userProfilePic, timeAgo: '1 min', text: 'This product looks really nice, do you deliver nationwide?', likes: 30 },
      { id: 'c2', userName: 'Adam Chris', userProfilePic: userProfilePic, timeAgo: '1 min', text: 'This product looks really nice, do you deliver nationwide?', likes: 30 },
      { id: 'c3', userName: 'Adam Chris', userProfilePic: userProfilePic, timeAgo: '1 min', text: 'This product looks really nice, do you deliver nationwide?', likes: 30 },
      { id: 'c4', userName: 'Sasha Stores', userProfilePic: userProfilePic, timeAgo: '1 min', text: '@Adam Chris We do deliver nationwide.', likes: 0 },
    ],
  },
  {
    id: 'post-2',
    userName: 'Dee Stores',
    userProfilePic: userProfilePic2,
    timeAgo: '1 hr ago',
    location: 'Abuja, Nigeria',
    imageUrl: postImage2,
    text: 'New arrivals just dropped! Check out our latest collection.',
    likes: 120,
    comments: 10,
    shares: 5,
    commentsList: [
      { id: 'c5', userName: 'Jane Doe', userProfilePic: userProfilePic, timeAgo: '5 min', text: 'Love these!', likes: 5 },
    ],
  },
  {
    id: 'post-3',
    userName: 'Sam Stores',
    userProfilePic: userProfilePic3,
    timeAgo: '1 hr ago',
    location: 'Abuja, Nigeria',
    imageUrl: postImage3,
    text: 'New arrivals just dropped! Check out our latest collection.',
    likes: 120,
    comments: 10,
    shares: 5,
    commentsList: [
      { id: 'c5', userName: 'Jane Doe', userProfilePic: userProfilePic, timeAgo: '5 min', text: 'Love these!', likes: 5 },
    ],
  },
];

export default DUMMY_POSTS;