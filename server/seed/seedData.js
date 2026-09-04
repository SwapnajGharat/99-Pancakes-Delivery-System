import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Address } from '../models/Address.js';
import { Review } from '../models/Review.js';

const seedCategories = [
  {
    name: 'Mini Pancakes',
    slug: 'mini-pancakes',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
    description: 'Bite-sized, fluffy mini pancakes drizzled with Belgian chocolate and fresh toppings.',
  },
  {
    name: 'Waffles',
    slug: 'waffles',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy on the outside, soft inside waffle pockets loaded with syrups & cream.',
  },
  {
    name: 'Cakes',
    slug: 'cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    description: 'Handcrafted celebration cakes, chocolate pull-up cakes, and pancake towers.',
  },
  {
    name: 'Pastries',
    slug: 'pastries',
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=600&q=80',
    description: 'Delicate pastry slices featuring chocolate truffle, red velvet, and fruit preserves.',
  },
  {
    name: 'Brownies',
    slug: 'brownies',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    description: 'Fudgy, melt-in-your-mouth brownies topped with chocolate drizzle and walnuts.',
  },
  {
    name: 'Milkshakes',
    slug: 'milkshakes',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    description: 'Thick, creamy gourmet thickshakes topped with whipped cream and crumbles.',
  },
  {
    name: 'Hot Drinks',
    slug: 'hot-drinks',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    description: 'Rich Belgian hot chocolate, hazelnut coffees, and aromatic warm beverages.',
  },
  {
    name: 'Cold Drinks',
    slug: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    description: 'Refreshing iced coffees, fruit coolers, and sparkling berry mocktails.',
  },
  {
    name: 'Combos',
    slug: 'combos',
    image: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&w=600&q=80',
    description: 'Curated value meal combos featuring pancakes, waffles, and thickshakes.',
  },
];

const seedProductsRaw = [
  {
    name: 'Holla Nutella Pancakes',
    categorySlug: 'mini-pancakes',
    description: 'Freshly baked warm mini pancakes drenched in rich, original Nutella hazelnut spread and topped with roasted hazelnut crunch.',
    price: 219,
    originalPrice: 249,
    rating: 4.9,
    reviewCount: 142,
    image: 'https://i.pinimg.com/736x/ca/e4/3f/cae43f6251ebf68fd5dd5abbd9870737.jpg',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '12-15 mins',
    calories: '420 kcal',
    tags: ['Nutella', 'Hazelnut', 'Chef Special'],
  },
  {
    name: 'Choco Lovely Pancakes',
    categorySlug: 'mini-pancakes',
    description: 'A chocolate lover’s dream! 12 mini pancakes loaded with dark, milk, and white melted Belgian chocolate drizzles.',
    price: 229,
    originalPrice: 269,
    rating: 4.8,
    reviewCount: 198,
    image: 'https://i.pinimg.com/736x/68/8b/a9/688ba99da1ccb3a5edbf73c023834531.jpg',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '10-15 mins',
    calories: '450 kcal',
    tags: ['Dark Chocolate', 'Belgian', 'Top Rated'],
  },
  {
    name: 'Red Velvet Pancake',
    categorySlug: 'mini-pancakes',
    description: 'Signature crimson red mini pancakes served with sweet cream cheese frosting, white chocolate chips, and edible gold dust.',
    price: 239,
    originalPrice: 279,
    rating: 4.7,
    reviewCount: 96,
    image: 'https://i.pinimg.com/1200x/7d/58/94/7d58946df9444f03da1b8b840eacd819.jpg',
    isVeg: true,
    isAvailable: true,
    featured: false,
    prepTime: '15 mins',
    calories: '410 kcal',
    tags: ['Red Velvet', 'Cream Cheese', 'Premium'],
  },
  {
    name: 'Maple Lady Pancakes',
    categorySlug: 'mini-pancakes',
    description: 'Traditional light & airy mini pancakes served with a generous scoop of whipped salted butter and pure Canadian maple syrup.',
    price: 179,
    originalPrice: 199,
    rating: 4.6,
    reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    featured: false,
    prepTime: '10 mins',
    calories: '340 kcal',
    tags: ['Classic', 'Maple Syrup', 'Breakfast'],
  },
  {
    name: 'Choco Heaven Waffle',
    categorySlug: 'waffles',
    description: 'Crispy waffle grid smothered in 70% pure dark Belgian chocolate ganache and dusted with cocoa powder.',
    price: 189,
    originalPrice: 219,
    rating: 4.9,
    reviewCount: 215,
    image: 'https://i.pinimg.com/736x/22/32/23/2232231ebcd869b128589a7da85e6c6a.jpg',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '12 mins',
    calories: '390 kcal',
    tags: ['Crispy', 'Dark Chocolate', 'Must Try'],
  },
  {
    name: 'Biscoff Caramel Waffle',
    categorySlug: 'waffles',
    description: 'Warm golden waffle layered with Lotus Biscoff spread, crushed Biscoff biscuit crumbles, and salted caramel drizzle.',
    price: 219,
    originalPrice: 249,
    rating: 4.8,
    reviewCount: 167,
    image: 'https://i.pinimg.com/1200x/3f/3a/cc/3f3acc7adc9a7816600087c57632cec0.jpg',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '12 mins',
    calories: '460 kcal',
    tags: ['Biscoff', 'Caramel', 'Trending'],
  },
  {
    name: 'Oreo and Cream Waffle',
    categorySlug: 'waffles',
    description: 'Crispy waffle grid loaded with crushed Oreo cookies, white chocolate ganache, and dark chocolate drizzle.',
    price: 199,
    originalPrice: 229,
    rating: 4.5,
    reviewCount: 72,
    image: 'https://i.pinimg.com/1200x/1a/04/39/1a0439165b40c56dedc34fdf4cf745bd.jpg',
    isVeg: true,
    isAvailable: true,
    featured: false,
    prepTime: '10 mins',
    calories: '380 kcal',
    tags: ['Oreo', 'Cream', 'Sweet'],
  },
  {
    name: 'Dutch Chocolate Overload Cake',
    categorySlug: 'cakes',
    description: 'Moist multi-layered chocolate sponge coated with rich Dutch truffle chocolate and chocolate curls.',
    price: 549,
    originalPrice: 629,
    rating: 4.9,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '20 mins',
    calories: '850 kcal',
    tags: ['Celebration', 'Truffle', 'Party'],
  },
  {
    name: 'Ferrero Rocher Cake',
    categorySlug: 'cakes',
    description: 'A magnificent multi-layer cake layered with Rocher chocolate cream, roasted hazelnuts, and whole Ferrero Rocher pralines.',
    price: 649,
    originalPrice: 749,
    rating: 4.9,
    reviewCount: 189,
    image: 'https://i.pinimg.com/736x/45/d3/58/45d3581e50eeae53775621361460b80d.jpg',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '25 mins',
    calories: '980 kcal',
    tags: ['Ferrero', 'Showstopper', 'Luxury'],
  },
  {
    name: 'Chocolate Truffle Pastry Slices',
    categorySlug: 'pastries',
    description: 'Rich & velvety eggless dark chocolate truffle pastry slice dusted with dark cocoa.',
    price: 139,
    originalPrice: 159,
    rating: 4.7,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    featured: false,
    prepTime: '5 mins',
    calories: '310 kcal',
    tags: ['Truffle', 'Pastry', 'Eggless'],
  },
  {
    name: 'Sizzling Walnut Brownie',
    categorySlug: 'brownies',
    description: 'Fudgy dark chocolate brownie packed with toasted Californian walnuts, served warm with rich dark chocolate fudge syrup.',
    price: 159,
    originalPrice: 189,
    rating: 4.8,
    reviewCount: 145,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    featured: false,
    prepTime: '8 mins',
    calories: '380 kcal',
    tags: ['Walnut', 'Warm', 'Fudgy'],
  },
  {
    name: 'Salted Caramel Brownie Sundae',
    categorySlug: 'brownies',
    description: 'Warm fudgy chocolate brownie layered with vanilla bean ice cream, hot caramel fudge, and toasted pecans.',
    price: 219,
    originalPrice: 259,
    rating: 4.9,
    reviewCount: 164,
    image: 'https://i.pinimg.com/1200x/14/7f/aa/147faab9cc042e0bc2745eb13c8bbe15.jpg',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '10 mins',
    calories: '490 kcal',
    tags: ['Caramel', 'Sundae', 'Indulgent'],
  },
  {
    name: 'Oreo Monster Thickshake',
    categorySlug: 'milkshakes',
    description: 'Ultra-creamy vanilla ice cream blended with crushed Oreo cookies, chocolate sauce, topped with whipped cream & whole Oreos.',
    price: 199,
    originalPrice: 229,
    rating: 4.7,
    reviewCount: 230,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '7 mins',
    calories: '520 kcal',
    tags: ['Oreo', 'Thickshake', 'Popular'],
  },
  {
    name: 'Belgian Hot Chocolate',
    categorySlug: 'hot-drinks',
    description: 'Slow-simmered whole milk infused with pure melted 54% dark Belgian chocolate and topped with miniature marshmallows.',
    price: 149,
    originalPrice: 169,
    rating: 4.9,
    reviewCount: 178,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '6 mins',
    calories: '280 kcal',
    tags: ['Hot Chocolate', 'Comfort', 'Belgian'],
  },
  {
    name: 'Hazelnut Cold Coffee Shake',
    categorySlug: 'cold-drinks',
    description: 'Smooth espresso cold brew shaken with vanilla ice cream, roasted hazelnut syrup, and cocoa powder garnish.',
    price: 169,
    originalPrice: 189,
    rating: 4.6,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    featured: false,
    prepTime: '5 mins',
    calories: '310 kcal',
    tags: ['Coffee', 'Hazelnut', 'Chilled'],
  },
  {
    name: 'Naughty Nutella Waffles',
    categorySlug: 'waffles',
    description: 'Fresh waffle cake topped with rich Nutella and dark Belgian chocolate sprinkles.',
    price: 299,
    originalPrice: 329,
    rating: 4.9,
    reviewCount: 61,
    image: 'https://i.pinimg.com/736x/86/d6/3c/86d63cd3bf0f44df95a5d84f751b9d6d.jpg',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '10 mins',
    calories: '480 kcal',
    tags: ['Nutella', 'Waffle', 'Bestseller'],
  },
  {
    name: 'Pancake & Shake Feast Combo',
    categorySlug: 'combos',
    description: '12 Holla Nutella Mini Pancakes + 1 Oreo Monster Thickshake at an irresistible combo discount.',
    price: 369,
    originalPrice: 418,
    rating: 4.9,
    reviewCount: 104,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isAvailable: true,
    featured: true,
    prepTime: '15 mins',
    calories: '940 kcal',
    tags: ['Combo', 'Value Meal', 'Saver'],
  },
];

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

const seedDB = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(env.MONGO_URI);
    console.log('[Seed] MongoDB Connected successfully.');

    // Clear existing collection data
    console.log('[Seed] Clearing old database records...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Address.deleteMany({});
    await Review.deleteMany({});

    // Seed Admin User
    console.log('[Seed] Creating default Admin and Customer accounts...');
    const adminUser = await User.create({
      name: '99 Pancakes Admin',
      email: 'admin@99pancakes.com',
      phone: '9876543210',
      password: 'Admin@123456',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });

    // Seed Customer User
    const customerUser = await User.create({
      name: 'Rohan Sharma',
      email: 'customer@99pancakes.com',
      phone: '9123456789',
      password: 'Customer@123456',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    });

    console.log(`[Seed] Admin created    : ${adminUser.email}`);
    console.log(`[Seed] Customer created : ${customerUser.email}`);

    // Seed Categories
    console.log('[Seed] Seeding categories...');
    const categoryDocs = await Category.insertMany(seedCategories);
    const categoryMap = {};
    categoryDocs.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log(`[Seed] ${categoryDocs.length} categories seeded successfully.`);

    // Seed Products
    console.log('[Seed] Seeding products...');
    const productsToInsert = seedProductsRaw.map((p) => {
      const categoryId = categoryMap[p.categorySlug];
      return {
        ...p,
        slug: slugify(p.name),
        category: categoryId,
        images: [p.image],
        stock: 50,
      };
    });

    const productDocs = await Product.insertMany(productsToInsert);
    console.log(`[Seed] ${productDocs.length} products seeded successfully.`);

    // Seed Customer Addresses
    console.log('[Seed] Seeding customer address...');
    await Address.create([
      {
        user: customerUser._id,
        fullName: customerUser.name,
        phone: customerUser.phone,
        addressLine: 'Flat 402, Sunshine Heights, Sector 15',
        landmark: 'Near Orion Mall',
        city: 'Panvel',
        state: 'Maharashtra',
        pincode: '410206',
        type: 'Home',
        isDefault: true,
      },
      {
        user: customerUser._id,
        fullName: customerUser.name,
        phone: customerUser.phone,
        addressLine: 'Building B3, Technopark, Sector 20',
        landmark: 'Opposite Railway Station',
        city: 'Panvel',
        state: 'Maharashtra',
        pincode: '410206',
        type: 'Work',
        isDefault: false,
      },
    ]);

    // Seed Reviews
    console.log('[Seed] Seeding sample review...');
    await Review.create({
      user: customerUser._id,
      product: productDocs[0]._id,
      rating: 5,
      comment: 'Absolutely heavenly mini pancakes! Fresh, warm, and drenched in Nutella.',
    });

    console.log('==================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    console.log('🔑 TEST ACCOUNTS:');
    console.log('   Admin    : admin@99pancakes.com    / Admin@123456');
    console.log('   Customer : customer@99pancakes.com / Customer@123456');
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDB();
