import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMapPin, FiPackage, FiEdit3, FiPhone, FiMail, FiCheck } from 'react-icons/fi';
import { dummyOrders } from '../../data/orders';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98200 12345',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    joined: 'January 2026'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile details updated successfully!');
  };

  const savedAddresses = [
    {
      id: 1,
      type: 'Home',
      address: 'Flat 402, Royal Palms, Sector 17, New Panvel East, Navi Mumbai - 410206',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      address: 'Plot 12, Cyber Park, Sector 15, Belapur, Navi Mumbai - 400614',
      isDefault: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C3D2E]">My Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your profile, saved addresses, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: User Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-4 border-[#FF4D6D] shadow-md"
              />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#5C3D2E] text-white flex items-center justify-center text-xs shadow-md hover:bg-[#4A3024]"
                title="Edit avatar"
              >
                <FiEdit3 />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#2D2D2D]">{user.name}</h2>
              <p className="text-xs text-amber-900/60 font-medium">Customer since {user.joined}</p>
            </div>

            <div className="pt-4 border-t border-amber-100 space-y-2 text-xs text-slate-600 text-left">
              <div className="flex items-center gap-2">
                <FiMail className="text-[#FF4D6D]" /> <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-[#FF4D6D]" /> <span>{user.phone}</span>
              </div>
            </div>

            <Link to="/orders">
              <button className="w-full py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#5C3D2E] font-bold text-xs flex items-center justify-center gap-2 border border-amber-200 mt-2">
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
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-[#FF4D6D] hover:underline"
              >
                {isEditing ? 'Cancel' : 'Edit Details'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#FF4D6D] text-white text-xs font-bold rounded-full hover:bg-[#E63956]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Full Name</span>
                  <span className="font-bold text-[#2D2D2D] text-sm">{user.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email Address</span>
                  <span className="font-bold text-[#2D2D2D] text-sm">{user.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Number</span>
                  <span className="font-bold text-[#2D2D2D] text-sm">{user.phone}</span>
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
                onClick={() => toast.success('Add new address modal opened!')}
                className="text-xs font-bold text-[#FF4D6D] hover:underline"
              >
                + Add New Address
              </button>
            </div>

            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl border border-amber-100 bg-[#FFF8F0]/50 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#5C3D2E] uppercase text-[11px] px-2 py-0.5 bg-amber-100 rounded-md">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                          <FiCheck /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{addr.address}</p>
                  </div>

                  <button
                    onClick={() => toast('Address edit mode')}
                    className="text-slate-400 hover:text-[#FF4D6D] text-sm"
                  >
                    <FiEdit3 />
                  </button>
                </div>
              ))}
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

            {dummyOrders.slice(0, 1).map((order) => (
              <div key={order.orderId} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-[#FF4D6D]">{order.orderId}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] border ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-slate-500">{order.date}</p>
                <div className="flex items-center justify-between pt-2 border-t border-amber-100 font-bold">
                  <span>{order.items.length} item(s)</span>
                  <span className="text-[#5C3D2E] text-sm">₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
