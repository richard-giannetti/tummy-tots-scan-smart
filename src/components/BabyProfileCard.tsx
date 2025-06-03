
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
      console.log('Updating avatar with URL:', avatarUrl);
      
      // Create updated profile with new avatar URL
      const updatedProfileData = {
        name: babyProfile.name,
        birth_date: babyProfile.birth_date,
        allergies: babyProfile.allergies,
        dietary_restrictions: babyProfile.dietary_restrictions,
        avatar_url: avatarUrl
      };

      const result = await BabyProfileService.saveBabyProfile(updatedProfileData);
      
      if (result.success && result.profile) {
        onProfileComplete(result.profile);
        toast({
          title: "Success!",
          description: "Avatar updated successfully!",
        });
      } else {
        console.error('Failed to update avatar:', result.error);
        toast({
          title: "Error",
          description: result.error || "Failed to update avatar. Please try again.",
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
