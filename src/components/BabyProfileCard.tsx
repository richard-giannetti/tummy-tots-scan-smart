
import React, { useState } from 'react';
import { BabyProfile, BabyProfileService } from '@/services/babyProfileService';
import { BabyProfileForm } from './BabyProfileForm';
import { BabyProfileDisplay } from './BabyProfileDisplay';
import { toast } from '@/hooks/use-toast';

interface BabyProfileCardProps {
  hasProfile: boolean;
  babyProfile: BabyProfile | null;
  onProfileComplete: (profileData: BabyProfile) => void;
}

export const BabyProfileCard = ({ hasProfile, babyProfile, onProfileComplete }: BabyProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(!hasProfile);

  const handleSubmit = (profileData: Omit<BabyProfile, 'id' | 'user_id' | 'created_at'>) => {
    // Create a proper BabyProfile object with the existing ID if updating
    const completeProfile: BabyProfile = {
      id: babyProfile?.id,
      user_id: babyProfile?.user_id,
      created_at: babyProfile?.created_at,
      ...profileData
    };
    onProfileComplete(completeProfile);
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
      
      // Create updated profile data while preserving existing profile structure
      const updatedProfileData = {
        name: babyProfile.name,
        birth_date: babyProfile.birth_date,
        weight_kg: babyProfile.weight_kg,
        feeding_stage: babyProfile.feeding_stage,
        allergies: babyProfile.allergies,
        dietary_restrictions: babyProfile.dietary_restrictions,
        dietary_preferences: babyProfile.dietary_preferences || [],
        health_conditions: babyProfile.health_conditions || [],
        feeding_goals: babyProfile.feeding_goals || [],
        feeding_type: babyProfile.feeding_type,
        medical_conditions: babyProfile.medical_conditions || [],
        avatar_url: avatarUrl
      };

      const result = await BabyProfileService.saveBabyProfile(updatedProfileData);
      
      if (result.success && result.profile) {
        // Pass the complete profile back to parent
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
