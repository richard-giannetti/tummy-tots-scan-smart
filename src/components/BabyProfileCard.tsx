
import React, { useState } from 'react';
import { BabyProfile } from '@/services/babyProfileService';
import { BabyProfileForm } from './BabyProfileForm';
import { BabyProfileDisplay } from './BabyProfileDisplay';

interface BabyProfileCardProps {
  hasProfile: boolean;
  babyProfile: BabyProfile | null;
  onProfileComplete: (profileData: Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>) => void;
}

export const BabyProfileCard = ({ hasProfile, babyProfile, onProfileComplete }: BabyProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(!hasProfile);

  const handleSubmit = (profileData: Omit<BabyProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    onProfileComplete(profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!hasProfile || isEditing) {
    return (
      <BabyProfileForm
        hasProfile={hasProfile}
        babyProfile={babyProfile}
        onSubmit={handleSubmit}
        onCancel={hasProfile ? handleCancel : undefined}
      />
    );
  }

  if (!babyProfile) {
    return null;
  }

  return (
    <BabyProfileDisplay
      babyProfile={babyProfile}
      onEdit={handleEdit}
    />
  );
};
