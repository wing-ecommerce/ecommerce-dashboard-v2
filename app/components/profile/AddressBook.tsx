"use client";

import { useState } from "react";

type AddressForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

export default function AddressBook() {
  const [addresses, setAddresses] = useState<AddressForm[]>([
    {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
    },
  ]);

  const handleChange = (
    index: number,
    field: keyof AddressForm,
    value: string
  ) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    console.log("Saved Address:", addresses[index]);
  };

  const removeAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-10">
      {addresses.map((item, index) => (
        <form
          key={index}
          onSubmit={(e) => handleSubmit(e, index)}
          className="max-w-5xl mx-auto bg-white rounded-2xl p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Address {index + 1}</h2>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-green-500 text-white hover:from-purple-600 hover:to-green-600 transition-all shadow-md"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => removeAddress(index)}
                className="px-5 py-2 rounded-full border text-red-500 hover:bg-red-50 transition"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="input w-full px-4 py-3 rounded-lg border focus:outline-none"
                placeholder="Enter full name"
                value={item.fullName}
                onChange={(e) =>
                  handleChange(index, "fullName", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="input w-full px-4 py-3 rounded-lg border focus:outline-none"
                placeholder="Enter email"
                value={item.email}
                onChange={(e) => handleChange(index, "email", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="input w-full px-4 py-3 rounded-lg border focus:outline-none"
                placeholder="+855 xxx xxx xxx"
                value={item.phone}
                onChange={(e) => handleChange(index, "phone", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select
                className="input w-full px-4 py-3 rounded-lg border focus:outline-none"
                value={item.country}
                onChange={(e) => handleChange(index, "country", e.target.value)}
              >
                <option value="">Select country</option>
                <option>Cambodia</option>
                <option>Thailand</option>
                <option>United States</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                className="input w-full px-4 py-3 rounded-lg border focus:outline-none"
                placeholder="Street, house number"
                value={item.address}
                onChange={(e) => handleChange(index, "address", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                className="input w-full px-4 py-3 rounded-lg border focus:outline-none"
                placeholder="Enter city"
                value={item.city}
                onChange={(e) => handleChange(index, "city", e.target.value)}
              />
            </div>
          </div>
        </form>
      ))}

      {/* Add Address Button */}
      <div className="max-w-5xl mx-auto flex justify-end">
        <button
          type="button"
          onClick={addAddress}
          className="px-6 py-3 rounded-full border font-semibold hover:bg-gray-100 transition"
        >
          + Add Address
        </button>
      </div>
    </div>
  );
}
