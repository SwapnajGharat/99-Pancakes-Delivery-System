import { JsonModel } from '../utils/jsonModel.js';

export const Address = new JsonModel('Address', 'addresses', {
  landmark: '', city: 'Panvel', state: 'Maharashtra', type: 'Home', isDefault: false,
});
