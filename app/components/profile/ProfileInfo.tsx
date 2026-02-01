"use client";

import { useState } from "react";

export default function ProfileInfo() {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    email: "alexarawles@gmail.com",
    dob: "",
    phone: "",
  });

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />

          <div>
            <h2 className="text-xl font-semibold">Alexa Rawles</h2>
            <p className="text-gray-500 text-sm">{form.email}</p>
          </div>
        </div>

        <button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-green-500 text-white hover:from-purple-600 hover:to-green-600 transition-all shadow-md">
          Update Profile
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            disabled
            value={form.email}
            className="w-full px-4 py-3 rounded-lg border bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Phone Number */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="+855 xxx xxx xxx"
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
