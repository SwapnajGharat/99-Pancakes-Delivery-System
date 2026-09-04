import { Address } from '../models/Address.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get logged in user's addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    return successResponse(res, 200, 'Addresses retrieved successfully', addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single address by ID
// @route   GET /api/addresses/:id
// @access  Private
export const getAddressById = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return errorResponse(res, 404, 'Address not found or unauthorized');
    }
    return successResponse(res, 200, 'Address retrieved successfully', address);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req, res, next) => {
  try {
    const { fullName, phone, addressLine, landmark, city, state, pincode, type, isDefault } = req.body;

    // If marked default, unset other default addresses for user
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    // If first address for user, auto set as default
    const existingCount = await Address.countDocuments({ user: req.user._id });
    const shouldBeDefault = isDefault || existingCount === 0;

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      addressLine,
      landmark: landmark || '',
      city: city || 'Panvel',
      state: state || 'Maharashtra',
      pincode,
      type: type || 'Home',
      isDefault: shouldBeDefault,
    });

    return successResponse(res, 201, 'Address created successfully', address);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    let address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return errorResponse(res, 404, 'Address not found or unauthorized');
    }

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 200, 'Address updated successfully', address);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return errorResponse(res, 404, 'Address not found or unauthorized');
    }

    await Address.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'Address deleted successfully');
  } catch (error) {
    next(error);
  }
};
