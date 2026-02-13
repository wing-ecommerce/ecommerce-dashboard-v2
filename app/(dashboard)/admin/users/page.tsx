"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, X, Users, UserCheck } from "lucide-react";
import userService from "@/services/user.service";
import UserDetails from "@/components/users/UserDetails";
import { User } from "@/types/user.types";

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      // Get all users (will be filtered by USER role on frontend)
      const response = await userService.getAll(currentPage, 100); // Get more to filter
      
      // Filter only USER role
      const userRoleUsers = response.content.filter(user => user.role === "USER");
      setUsers(userRoleUsers);
      setTotalElements(userRoleUsers.length);
      setTotalPages(Math.ceil(userRoleUsers.length / 10));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await userService.disableUser(userId);
      } else {
        await userService.enableUser(userId);
      }
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.delete(userId);
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const closeUserDetails = () => {
    setIsDetailsOpen(false);
    setSelectedUser(null);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userService.getFullName(user).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ENABLED" && user.enabled) ||
      (statusFilter === "DISABLED" && !user.enabled);
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const activeUsers = users.filter(u => u.enabled).length;
  const oauthUsers = users.filter(u => userService.isOAuthUser(u)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header with Stats */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Customers Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Customers */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center gap-6">
            <div className="p-4 bg-blue-100 rounded-xl">
              <Users className="w-10 h-10 text-blue-700" />
            </div>
            <div>
              <p className="text-gray-600 text-lg mb-1">Total Customers</p>
              <h3 className="text-4xl font-bold text-gray-800">{totalElements}</h3>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center gap-6">
            <div className="p-4 bg-green-100 rounded-xl">
              <UserCheck className="w-10 h-10 text-green-700" />
            </div>
            <div>
              <p className="text-gray-600 text-lg mb-1">Active Users</p>
              <h3 className="text-4xl font-bold text-gray-800">{activeUsers}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-sm text-gray-700 font-medium">
          <span>Total: {totalElements} customers</span>
          <span>•</span>
          <span>Showing: {filteredUsers.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 text-gray-900 placeholder:text-gray-500"
            />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ENABLED" | "DISABLED")}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="ENABLED">Active</option>
            <option value="DISABLED">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Auth Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt={userService.getFullName(user)}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-md">
                            {userService.getInitials(user)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{userService.getFullName(user)}</p>
                          <p className="text-xs text-gray-600">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-gray-900">{user.email}</p>
                        {user.emailVerified && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700">{user.phoneNumber || "—"}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userService.isOAuthUser(user)
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {userService.getOAuthProviderLabel(user.oauthProvider)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.enabled ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600 text-sm">
                      {userService.formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => openUserDetails(user)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700 font-medium">
            Showing {filteredUsers.length} of {totalElements} customers
          </div>
          <button
            onClick={loadUsers}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* User Details Modal */}
      {isDetailsOpen && selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={closeUserDetails}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
}