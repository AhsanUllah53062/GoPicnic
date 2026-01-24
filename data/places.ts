import { Place } from '../types';

export const places: Place[] = [
  {
    id: '1',
    name: 'Faisal Mosque',
    location: 'Islamabad',
    temperature: '22°C',
    rating: 4.7,
    image: require('../assets/faisal.jpg'), // ✅ local image for cards
    imageUrl: 'https://example.com/faisal.jpg', // ✅ string for background
    description: 'The Faisal Mosque is the largest mosque in Pakistan, located in Islamabad.',
    gallery: [
      require('../assets/faisal.jpg'),
      { uri: 'https://example.com/faisal-night.jpg' },
    ],
    reviews: [
      'Beautiful architecture and peaceful environment.',
      'A must-visit landmark in Islamabad.',
    ],
  },
  {
    id: '2',
    name: 'Hanna Lake',
    location: 'Quetta',
    temperature: '18°C',
    rating: 4.5,
    image: require('../assets/hanna.jpg'),
    imageUrl: 'https://example.com/hanna.jpg', // ✅ string for background
    description: 'A beautiful lake surrounded by mountains, popular for picnics and boating.',
    gallery: [
      require('../assets/hanna.jpg'),
      { uri: 'https://example.com/hanna-boat.jpg' },
    ],
    reviews: [
      'Perfect for a family picnic.',
      'Loved the boat ride!',
    ],
  },
];
