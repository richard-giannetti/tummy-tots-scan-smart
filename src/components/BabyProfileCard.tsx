
import React, { useState } from 'react';
import { BabyProfile, BabyProfileService } from '@/services/babyProfileService';
import { BabyProfileForm } from './BabyProfileForm';
import { BabyProfileDisplay } from './BabyProfileDisplay';
import { toast } from '@/hooks/use-toast';

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

  const handleAvatarUpdate = async (avatarUrl: string) => {
    if (!babyProfile) return;

    try {
      const updatedProfile = { ...babyProfile, avatar_url: avatarUrl };
      const result = await BabyProfileService.saveBabyProfile(updatedProfile);
      
      if (result.success && result.profile) {
        onProfileComplete(result.profile);
      } else {
        toast({
          title: "Error",
          description: "Failed to update avatar. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
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
      onAvatarUpdate={handleAvatarUpdate}
    />
  );
};
