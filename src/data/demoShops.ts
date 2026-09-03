// Demo shop/seller profiles used to showcase the marketplace prototype.
// Replace with live seller data once real shops sign up.

export interface DemoShop {
  slug: string;
  name: string;
  owner: string;
  categorySlug: string;
  categoryName: string;
  emoji: string;
  tagline: string;
  about: string;
  city: string;
  area: string;
  rating: number;
  reviews: number;
  yearsActive: number;
  verified: boolean;
  premium: boolean;
  hours: string;
  phone: string;
  offerings: { name: string; price: string }[];
  tags: string[];
}

export const demoShops: DemoShop[] = [
  {
    slug: 'sri-lakshmi-kirana',
    name: 'Sri Lakshmi Kirana Store',
    owner: 'Ramesh Kumar',
    categorySlug: 'groceries',
    categoryName: 'Groceries & Kirana',
    emoji: '🛒',
    tagline: 'Daily essentials delivered in 30 minutes',
    about:
      'A neighbourhood kirana serving the locality for over a decade. Rice, pulses, spices, dairy and household staples with free doorstep delivery on orders above ₹300.',
    city: 'Bengaluru',
    area: 'Jayanagar 4th Block',
    rating: 4.7,
    reviews: 218,
    yearsActive: 12,
    verified: true,
    premium: true,
    hours: '7:00 AM – 10:00 PM',
    phone: '+91 98450 11223',
    offerings: [
      { name: 'Sona Masoori Rice (25kg)', price: '₹1,450' },
      { name: 'Monthly grocery bundle', price: '₹2,999' },
      { name: 'Fresh dairy & eggs', price: 'From ₹35' },
    ],
    tags: ['Home delivery', 'UPI accepted', 'Bulk orders'],
  },
  {
    slug: 'metro-mobile-hub',
    name: 'Metro Mobile Hub',
    owner: 'Arjun Nair',
    categorySlug: 'electronics',
    categoryName: 'Electronics',
    emoji: '📱',
    tagline: 'Phones, accessories and same-day screen repair',
    about:
      'Authorised reseller for major smartphone brands with an in-house repair bench. Walk-in diagnostics are free and most screen replacements are done within two hours.',
    city: 'Chennai',
    area: 'T. Nagar',
    rating: 4.5,
    reviews: 341,
    yearsActive: 7,
    verified: true,
    premium: false,
    hours: '10:00 AM – 9:00 PM',
    phone: '+91 99620 44881',
    offerings: [
      { name: 'Screen replacement', price: 'From ₹1,899' },
      { name: 'Battery service', price: 'From ₹899' },
      { name: 'Certified pre-owned phones', price: 'From ₹6,500' },
    ],
    tags: ['Warranty', 'EMI available', 'Same-day repair'],
  },
  {
    slug: 'green-leaf-cafe',
    name: 'Green Leaf Cafe',
    owner: 'Divya Menon',
    categorySlug: 'restaurants',
    categoryName: 'Restaurants & Cafes',
    emoji: '☕',
    tagline: 'Filter coffee, bakes and a quiet work corner',
    about:
      'A 40-seat cafe with all-day breakfast, single-origin filter coffee and free Wi-Fi. Private table bookings available for small meetings and birthdays.',
    city: 'Kochi',
    area: 'Panampilly Nagar',
    rating: 4.8,
    reviews: 512,
    yearsActive: 5,
    verified: true,
    premium: true,
    hours: '8:00 AM – 11:00 PM',
    phone: '+91 98470 76543',
    offerings: [
      { name: 'Breakfast platter', price: '₹249' },
      { name: 'Table booking (up to 8)', price: 'Free' },
      { name: 'Celebration package', price: '₹4,500' },
    ],
    tags: ['Free Wi-Fi', 'Outdoor seating', 'Card accepted'],
  },
  {
    slug: 'sharma-home-services',
    name: 'Sharma Home Services',
    owner: 'Vikas Sharma',
    categorySlug: 'home-services',
    categoryName: 'Home Services',
    emoji: '🔧',
    tagline: 'Plumbing, electrical and deep cleaning on call',
    about:
      'Background-verified technicians for household repairs and cleaning. Transparent pricing, 30-day service warranty and slots available on the same day.',
    city: 'Delhi',
    area: 'Rohini Sector 9',
    rating: 4.4,
    reviews: 176,
    yearsActive: 9,
    verified: true,
    premium: false,
    hours: '8:00 AM – 8:00 PM',
    phone: '+91 98110 22334',
    offerings: [
      { name: 'Plumbing visit', price: '₹399' },
      { name: 'Full home deep clean', price: '₹3,200' },
      { name: 'Electrical wiring check', price: '₹599' },
    ],
    tags: ['Verified staff', '30-day warranty', 'Same-day slots'],
  },
  {
    slug: 'glow-studio-salon',
    name: 'Glow Studio Salon & Spa',
    owner: 'Neha Kapoor',
    categorySlug: 'salons',
    categoryName: 'Beauty & Salons',
    emoji: '💇',
    tagline: 'Hair, skin and bridal styling by certified artists',
    about:
      'Unisex salon with a dedicated bridal suite. Products are cruelty-free and every appointment includes a complimentary consultation.',
    city: 'Mumbai',
    area: 'Bandra West',
    rating: 4.9,
    reviews: 604,
    yearsActive: 6,
    verified: true,
    premium: true,
    hours: '10:00 AM – 8:30 PM',
    phone: '+91 98200 55112',
    offerings: [
      { name: 'Haircut & styling', price: 'From ₹700' },
      { name: 'Bridal package', price: '₹18,000' },
      { name: 'Facial & skin therapy', price: 'From ₹1,200' },
    ],
    tags: ['Appointments', 'Home service', 'Cruelty-free'],
  },
  {
    slug: 'city-pharmacy-24x7',
    name: 'City Pharmacy 24x7',
    owner: 'Dr. Anitha Rao',
    categorySlug: 'medical',
    categoryName: 'Medical & Pharmacy',
    emoji: '💊',
    tagline: 'Round-the-clock medicines and health checks',
    about:
      'Licensed pharmacy open every day of the year with a resident pharmacist, free BP and sugar checks, and prescription delivery within 5 km.',
    city: 'Hyderabad',
    area: 'Madhapur',
    rating: 4.6,
    reviews: 289,
    yearsActive: 11,
    verified: true,
    premium: false,
    hours: 'Open 24 hours',
    phone: '+91 98490 33771',
    offerings: [
      { name: 'Prescription delivery', price: 'Free above ₹500' },
      { name: 'BP & sugar check', price: 'Free' },
      { name: 'Health supplements', price: 'From ₹180' },
    ],
    tags: ['24x7', 'Insurance billing', 'Delivery'],
  },
  {
    slug: 'heritage-banquet-hall',
    name: 'Heritage Banquet Hall',
    owner: 'Suresh Patel',
    categorySlug: 'places',
    categoryName: 'Places & Venues',
    emoji: '🏛️',
    tagline: 'A 400-guest venue for weddings and receptions',
    about:
      'Air-conditioned hall with in-house catering, valet parking for 80 cars and a decorated stage. Custom packages for engagements and corporate events.',
    city: 'Ahmedabad',
    area: 'Satellite',
    rating: 4.3,
    reviews: 97,
    yearsActive: 15,
    verified: true,
    premium: true,
    hours: '9:00 AM – 9:00 PM (bookings)',
    phone: '+91 98250 66009',
    offerings: [
      { name: 'Hall booking (day)', price: '₹65,000' },
      { name: 'Catering per plate', price: 'From ₹450' },
      { name: 'Decor package', price: '₹25,000' },
    ],
    tags: ['Parking', 'In-house catering', 'AC hall'],
  },
  {
    slug: 'pawsome-pet-care',
    name: 'Pawsome Pet Care',
    owner: 'Ritu Verma',
    categorySlug: 'pets',
    categoryName: 'Pets & Animal Care',
    emoji: '🐾',
    tagline: 'Grooming, boarding and vet visits for your pets',
    about:
      'Pet grooming studio and day-boarding facility with a visiting veterinarian on weekends. Pickup and drop available across the city.',
    city: 'Pune',
    area: 'Kalyani Nagar',
    rating: 4.7,
    reviews: 143,
    yearsActive: 4,
    verified: false,
    premium: false,
    hours: '9:00 AM – 7:00 PM',
    phone: '+91 98220 41200',
    offerings: [
      { name: 'Full grooming', price: '₹1,100' },
      { name: 'Day boarding', price: '₹700 / day' },
      { name: 'Vet consultation', price: '₹500' },
    ],
    tags: ['Pickup & drop', 'Weekend vet', 'Small pets welcome'],
  },
  {
    slug: 'urban-threads-boutique',
    name: 'Urban Threads Boutique',
    owner: 'Farah Sheikh',
    categorySlug: 'fashion',
    categoryName: 'Fashion',
    emoji: '👗',
    tagline: 'Custom tailoring and everyday ethnic wear',
    about:
      'Boutique with ready-to-wear collections and made-to-measure tailoring. Free first fitting and a 5-day turnaround on most stitched orders.',
    city: 'Jaipur',
    area: 'C-Scheme',
    rating: 4.5,
    reviews: 208,
    yearsActive: 8,
    verified: true,
    premium: false,
    hours: '11:00 AM – 8:00 PM',
    phone: '+91 94140 78990',
    offerings: [
      { name: 'Custom blouse stitching', price: '₹950' },
      { name: 'Ready ethnic sets', price: 'From ₹1,800' },
      { name: 'Alteration', price: 'From ₹200' },
    ],
    tags: ['Custom fit', 'Trial room', 'Festive collection'],
  },
  {
    slug: 'speedy-two-wheeler-garage',
    name: 'Speedy Two-Wheeler Garage',
    owner: 'Imran Khan',
    categorySlug: 'repairs',
    categoryName: 'Repairs & Maintenance',
    emoji: '🛠️',
    tagline: 'Bike servicing with free pickup within 5 km',
    about:
      'Multi-brand two-wheeler workshop offering periodic servicing, engine work and insurance claim assistance with genuine spare parts.',
    city: 'Bengaluru',
    area: 'Indiranagar',
    rating: 4.2,
    reviews: 132,
    yearsActive: 10,
    verified: false,
    premium: false,
    hours: '9:30 AM – 8:00 PM',
    phone: '+91 90080 33445',
    offerings: [
      { name: 'General service', price: '₹649' },
      { name: 'Engine overhaul', price: 'From ₹3,500' },
      { name: 'Doorstep pickup', price: 'Free' },
    ],
    tags: ['Genuine parts', 'Pickup', 'Insurance help'],
  },
  {
    slug: 'nest-realty-rentals',
    name: 'Nest Realty & Rentals',
    owner: 'Kavitha Reddy',
    categorySlug: 'real-estate',
    categoryName: 'Real Estate & Rentals',
    emoji: '🏠',
    tagline: 'Verified flats, PGs and commercial spaces',
    about:
      'Local property desk with physically verified listings, rental agreement support and zero brokerage on select PG inventory.',
    city: 'Hyderabad',
    area: 'Gachibowli',
    rating: 4.1,
    reviews: 88,
    yearsActive: 6,
    verified: true,
    premium: true,
    hours: '10:00 AM – 7:00 PM',
    phone: '+91 91000 55667',
    offerings: [
      { name: '2BHK rentals', price: 'From ₹22,000 / mo' },
      { name: 'PG beds', price: 'From ₹8,500 / mo' },
      { name: 'Rental agreement', price: '₹1,500' },
    ],
    tags: ['Verified listings', 'Site visits', 'Legal support'],
  },
  {
    slug: 'brightpath-tuition-centre',
    name: 'BrightPath Tuition Centre',
    owner: 'Prof. Sanjay Iyer',
    categorySlug: 'education',
    categoryName: 'Education & Tutoring',
    emoji: '📚',
    tagline: 'Small-batch coaching for classes 6 to 12',
    about:
      'Maths and science coaching in batches of eight, with weekly tests, parent reports and doubt-clearing sessions on Sundays.',
    city: 'Coimbatore',
    area: 'RS Puram',
    rating: 4.8,
    reviews: 164,
    yearsActive: 13,
    verified: true,
    premium: false,
    hours: '4:00 PM – 9:00 PM',
    phone: '+91 94430 21987',
    offerings: [
      { name: 'Monthly batch fee', price: '₹2,500' },
      { name: 'Home tuition', price: '₹800 / session' },
      { name: 'Crash course', price: '₹6,000' },
    ],
    tags: ['Small batches', 'Weekly tests', 'Demo class free'],
  },
];

export const demoShopCities = Array.from(new Set(demoShops.map((s) => s.city))).sort();
export const demoShopCategories = Array.from(
  new Map(demoShops.map((s) => [s.categorySlug, s.categoryName])).entries()
).map(([slug, name]) => ({ slug, name }));

export const getDemoShop = (slug: string) => demoShops.find((s) => s.slug === slug);
