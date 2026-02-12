"use client";

import { useState } from "react";
import { X, Mail, Phone, Calendar, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import userService from "@/services/user.service";
import { User } from "@/types/user.types";

interface UserDetailsProps {
  user: User;
  onClose: () => void;
  onToggleStatus: (userId: number, currentStatus: boolean) => void;
  onDelete: (userId: number) => void;
}

export default function UserDetails({ user, onClose, onToggleStatus, onDelete }: UserDetailsProps) {
  const [updating, setUpdating] = useState(false);

  const handleToggleStatus = async () => {
    setUpdating(true);
    try {
      await onToggleStatus(user.id, user.enabled);
      onClose();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    onDelete(user.id);
    onClose();
  };

  const isOAuth = userService.isOAuthUser(user);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={userService.getFullName(user)}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-2xl shadow-md">
                {userService.getInitials(user)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{userService.getFullName(user)}</h2>
              <p className="text-gray-600">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              user.enabled
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {user.enabled ? (
                <>
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Active Account
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 inline mr-2" />
                  Inactive Account
                </>
              )}
            </span>

            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isOAuth
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {userService.getOAuthProviderLabel(user.oauthProvider)}
            </span>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
            
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              {user.emailVerified && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                  Verified
                </span>
              )}
            </div>

            {user.phoneNumber && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900 font-medium">{user.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Account Details</h3>
            
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-gray-900 font-medium">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Joined</p>
                <p className="text-gray-900 font-medium">{userService.formatDate(user.createdAt)}</p>
              </div>
            </div>

            {user.lastLogin && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="text-gray-900 font-medium">{userService.formatDateTime(user.lastLogin)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Account ID */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">User ID</p>
            <p className="text-gray-900 font-mono font-semibold">{user.id}</p>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Account Actions</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleStatus}
                disabled={updating}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  user.enabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                {updating ? "Updating..." : user.enabled ? "Disable Account" : "Enable Account"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
          >
            Delete User
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}