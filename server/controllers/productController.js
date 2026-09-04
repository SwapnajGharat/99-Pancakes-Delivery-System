import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/apiResponse.js';

// Helper function to turn strings into URL-friendly slugs
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

// @desc    Get all products with filtering, searching, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      isVeg,
      featured,
      isAvailable,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search query
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Category filter (by slug, name, or ObjectId)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cleanCategory = category.toLowerCase().trim();
        const categoryDoc = await Category.findOne({
          $or: [{ slug: cleanCategory }, { name: new RegExp(`^${cleanCategory}$`, 'i') }],
        });
        if (categoryDoc) {
          query.$or = [{ category: categoryDoc._id }, { categorySlug: cleanCategory }];
        } else {
          query.categorySlug = cleanCategory;
        }
      }
    }

    // Price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
    }

    // Vegetarian filter
    if (isVeg !== undefined) {
      query.isVeg = isVeg === 'true' || isVeg === true;
    }

    // Featured filter
    if (featured !== undefined) {
      query.featured = featured === 'true' || featured === true;
    }

    // Availability filter
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, reviewCount: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'name') {
      sortOptions = { name: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum);

    return paginatedResponse(res, 200, 'Products fetched successfully', products, {
      page: pageNum,
      limit: limitNum,
      total,
      pages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name slug');
    }

    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() }).populate('category', 'name slug');
    }

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category: categoryId,
      image,
      images,
      isVeg,
      isAvailable,
      stock,
      featured,
      prepTime,
      calories,
      tags,
    } = req.body;

    const categoryDoc = await Category.findById(categoryId);
    if (!categoryDoc) {
      return errorResponse(res, 404, 'Specified Category not found');
    }

    const slug = slugify(name);

    // Check slug collision
    const existingProduct = await Product.findOne({ slug });
    const finalSlug = existingProduct ? `${slug}-${Date.now()}` : slug;

    const product = await Product.create({
      name,
      slug: finalSlug,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: categoryDoc._id,
      categorySlug: categoryDoc.slug,
      image,
      images: images || [image],
      isVeg: isVeg !== undefined ? isVeg : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      stock: stock !== undefined ? Number(stock) : 50,
      featured: featured || false,
      prepTime: prepTime || '10-15 mins',
      calories: calories || '',
      tags: tags || [],
    });

    return successResponse(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    if (req.body.name && req.body.name !== product.name) {
      req.body.slug = slugify(req.body.name);
    }

    if (req.body.category) {
      const categoryDoc = await Category.findById(req.body.category);
      if (!categoryDoc) {
        return errorResponse(res, 404, 'Category not found');
      }
      req.body.categorySlug = categoryDoc.slug;
    }

    product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    return successResponse(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    await Product.findByIdAndDelete(id);

    return successResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
