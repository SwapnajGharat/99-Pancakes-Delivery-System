import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // Attach product counts dynamically
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ categorySlug: cat.slug });
        return {
          ...cat.toObject(),
          count,
        };
      })
    );

    return successResponse(res, 200, 'Categories retrieved successfully', categoriesWithCount);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID or Slug
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }

    if (!category) {
      category = await Category.findOne({ slug: id.toLowerCase() });
    }

    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    const count = await Product.countDocuments({ categorySlug: category.slug });

    return successResponse(res, 200, 'Category retrieved successfully', {
      ...category.toObject(),
      count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    const slug = slugify(name);

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return errorResponse(res, 409, 'Category already exists with this name');
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    return successResponse(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    let category = await Category.findById(id);
    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    if (req.body.name && req.body.name !== category.name) {
      req.body.slug = slugify(req.body.name);
    }

    category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 200, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    // Check if category has associated products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return errorResponse(
        res,
        400,
        `Cannot delete category. It has ${productCount} associated products.`
      );
    }

    await Category.findByIdAndDelete(id);

    return successResponse(res, 200, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
