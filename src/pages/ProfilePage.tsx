import React, { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { makeClients } from "../api";
import { AutoForm } from "../components/core/AutoForm";
import type { UserRead } from "../generated/users/models/UserRead";
import type { UserUpdate } from "../generated/users/models/UserUpdate";

const ProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const clients = useMemo(() => makeClients(token), [token]);

  // NOTE: updateUserUsersIdPut signature is (id: string, requestBody: UserUpdate)
  const { execute: updateUser, isLoading, error } = useApi<
    UserRead,
    [string, UserUpdate]
  >(clients?.userApi.updateUserUsersIdPut, { lazy: true });

  const handleProfileUpdate = async (formData: UserUpdate) => {
    if (!user?.id || !clients) return;
    const { success } = await updateUser(user.id, formData);
    if (success) alert("Profile updated successfully!");
    else alert("Failed to update profile.");
  };

  if (!user) return <div className="p-6">User not found. Please log in.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p className="text-gray-700 mb-4">Welcome, {user.username}!</p>

      <h2 className="text-lg font-semibold mb-2">Edit Your Information</h2>
      <AutoForm<UserRead> defaultValues={user} onSubmit={handleProfileUpdate} />

      {isLoading && <p>Updating profile...</p>}
      {error && <p className="text-red-600">Error: {(error as Error).message}</p>}
    </div>
  );
};

export default ProfilePage;
