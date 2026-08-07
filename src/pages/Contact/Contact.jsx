import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Query',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for contacting 99 Pancakes Panvel! We will reach out shortly.', {
      icon: '📩'
    });
    setFormData({ name: '', email: '', phone: '', subject: 'Order Query', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF4D6D]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#5C3D2E]">
          Contact 99 Pancakes Panvel
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have a question about your order, party booking, or feedback? Drop us a message below!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold text-[#2D2D2D]">Send Us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98200 12345"
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                >
                  <option value="Order Query">Order Status Query</option>
                  <option value="Party Booking">Bulk / Party Order</option>
                  <option value="Feedback">Feedback & Suggestions</option>
                  <option value="Franchise">Franchise Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D2D2D] block mb-1">Your Message *</label>
              <textarea
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                placeholder="How can we help you today?"
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-[#FF4D6D] hover:bg-[#E63956] text-white font-bold text-xs shadow-md shadow-[#FF4D6D]/30 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>SEND MESSAGE</span>
              <FiSend />
            </button>
          </form>
        </div>

        {/* Store Details & Location Map Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Store Info */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-[#5C3D2E] pb-2 border-b border-amber-100">
              Panvel Store Location
            </h2>

            <ul className="space-y-4 text-xs text-slate-600">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#FF4D6D] text-lg mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2D2D2D] block">Address</span>
                  <span>Shop 12, Ground Floor, Sector 15, New Panvel East, Navi Mumbai, Maharashtra - 410206</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <FiPhone className="text-[#FFB703] text-lg mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2D2D2D] block">Order Helpline</span>
                  <span>+91 98200 99999 / +91 98200 88888</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <FiMail className="text-[#5C3D2E] text-lg mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2D2D2D] block">Email Support</span>
                  <span>panvel@99pancakes.in</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <FiClock className="text-green-600 text-lg mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[#2D2D2D] block">Opening Timings</span>
                  <span>Mon – Sun: 10:00 AM – 11:30 PM (Midnight delivery fri/sat)</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Google Maps Visual Embed Mockup */}
          <div className="bg-amber-100 rounded-3xl overflow-hidden border border-amber-200 shadow-sm aspect-16/9 relative group">
            <iframe
              title="99 Pancakes Panvel Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.639433433544!2d73.1190!3d18.9950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU5JzQyLjAiTiA3M8KwMDcnMDguNCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              loading="lazy"
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#5C3D2E] shadow-md pointer-events-none">
              📍 Sector 15, New Panvel
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;
