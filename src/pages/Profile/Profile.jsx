import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMapPin, FiPackage, FiEdit3, FiPhone, FiMail, FiCheck, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { addressAPI, orderAPI } from '../../services/apiServices';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Address modal/form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    landmark: '',
    city: 'Panvel',
    state: 'Maharashtra',
    pincode: '410206',
    type: 'Home',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [addrs, ords] = await Promise.all([
        addressAPI.getAddresses().catch(() => []),
        orderAPI.getMyOrders().catch(() => []),
      ]);
      setSavedAddresses(Array.isArray(addrs) ? addrs : []);
      setRecentOrders(Array.isArray(ords) ? ords : []);
    } catch (err) {
      console.error('[Profile] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const res = await updateProfile(profileData);
    if (res.success) {
      setIsEditingProfile(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine) {
      toast.error('Please fill in required address fields');
      return;
    }

    try {
      if (editingAddressId) {
        await addressAPI.updateAddress(editingAddressId, addressForm);
        toast.success('Address updated successfully!');
      } else {
        await addressAPI.createAddress(addressForm);
        toast.success('New address added!');
      }
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine: '',
        landmark: '',
        city: 'Panvel',
        state: 'Maharashtra',
        pincode: '410206',
        type: 'Home',
        isDefault: false,
      });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await addressAPI.deleteAddress(id);
      toast.success('Address deleted');
      setSavedAddresses(savedAddresses.filter((a) => a._id !== id));
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const startEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      landmark: addr.landmark || '',
      city: addr.city || 'Panvel',
      state: addr.state || 'Maharashtra',
      pincode: addr.pincode || '410206',
      type: addr.type || 'Home',
      isDefault: addr.isDefault || false,
    });
    setShowAddressForm(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader text="Loading account profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C3D2E]">My Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your personal profile, saved addresses, and recent orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: User Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                alt={user?.name}
                className="w-full h-full rounded-full object-cover border-4 border-[#FF4D6D] shadow-md"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#2D2D2D]">{user?.name}</h2>
              <span className="text-xs text-[#FF4D6D] font-extrabold uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {user?.role === 'admin' ? '👑 Admin Account' : '🥞 Customer'}
              </span>
            </div>

            <div className="pt-4 border-t border-amber-100 space-y-2 text-xs text-slate-600 text-left">
              <div className="flex items-center gap-2">
                <FiMail className="text-[#FF4D6D]" /> <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-[#FF4D6D]" /> <span>{user?.phone || 'No phone set'}</span>
              </div>
            </div>

            <Link to="/orders">
              <button className="w-full py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#5C3D2E] font-bold text-xs flex items-center justify-center gap-2 border border-amber-200 mt-2 cursor-pointer">
                <FiPackage /> View Full Order History
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Editable Info & Saved Addresses */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Edit Profile Form */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100 text-[#5C3D2E]">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <FiUser className="text-[#FF4D6D]" /> Personal Information
              </h2>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs font-bold text-[#FF4D6D] hover:underline cursor-pointer"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Details'}
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#FF4D6D] text-white text-xs font-bold rounded-full hover:bg-[#E63956] cursor-pointer"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Full Name</span>
                  <span className="font-bold text-[#2D2D2D] text-sm">{user?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email Address</span>
                  <span className="font-bold text-[#2D2D2D] text-sm">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Number</span>
                  <span className="font-bold text-[#2D2D2D] text-sm">{user?.phone || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Saved Delivery Addresses */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100 text-[#5C3D2E]">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <FiMapPin className="text-[#FF4D6D]" /> Saved Addresses (Panvel)
              </h2>
              <button
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressForm({
                    fullName: user?.name || '',
                    phone: user?.phone || '',
                    addressLine: '',
                    landmark: '',
                    city: 'Panvel',
                    state: 'Maharashtra',
                    pincode: '410206',
                    type: 'Home',
                    isDefault: false,
                  });
                  setShowAddressForm(!showAddressForm);
                }}
                className="text-xs font-bold text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FiPlus /> Add New Address
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="text-xs font-bold text-[#5C3D2E]">
                  {editingAddressId ? 'Edit Address' : 'Add New Address'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    required
                    className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs"
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    required
                    className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Address Line *"
                    value={addressForm.addressLine}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                    required
                    className="sm:col-span-2 px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Landmark"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs"
                  />
                </div>
                <div className="flex items-center gap-4 text-xs pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FF4D6D] text-white font-bold rounded-full hover:bg-[#E63956] cursor-pointer"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="text-slate-500 font-bold hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {savedAddresses.length > 0 ? (
                savedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 rounded-2xl border border-amber-100 bg-[#FFF8F0]/50 flex items-start justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#5C3D2E] uppercase text-[11px] px-2 py-0.5 bg-amber-100 rounded-md">
                          {addr.type || 'Home'}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                            <FiCheck /> Default
                          </span>
                        )}
                        <span className="font-bold text-[#2D2D2D]">{addr.fullName} ({addr.phone})</span>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {addr.addressLine}, {addr.city} - {addr.pincode}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditAddress(addr)}
                        className="text-slate-400 hover:text-[#FF4D6D] text-sm p-1 cursor-pointer"
                        title="Edit address"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="text-slate-400 hover:text-red-600 text-sm p-1 cursor-pointer"
                        title="Delete address"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No saved addresses yet.</p>
              )}
            </div>
          </div>

          {/* Order History Preview */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100 text-[#5C3D2E]">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <FiPackage className="text-[#FF4D6D]" /> Recent Order Preview
              </h2>
              <Link to="/orders" className="text-xs font-bold text-[#FF4D6D] hover:underline">
                See All Orders
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 2).map((order) => (
                <div key={order._id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#FF4D6D]">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] border border-amber-300 bg-amber-100 text-amber-800 font-bold">
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-amber-100 font-bold">
                    <span>{order.items.length} item(s)</span>
                    <span className="text-[#5C3D2E] text-sm">₹{order.total}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No past orders yet.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
