import React, { useState } from 'react';
import { Baby, Edit3, AlertTriangle } from 'lucide-react';
import { BabyProfile } from '@/services/babyProfileService';
import { AvatarUploadDialog } from './AvatarUploadDialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
interface BabyProfileDisplayProps {
  babyProfile: BabyProfile;
  onEdit: () => void;
  onAvatarUpdate: (avatarUrl: string) => void;
}
export const BabyProfileDisplay = ({
  babyProfile,
  onEdit,
  onAvatarUpdate
}: BabyProfileDisplayProps) => {
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const babyAge = babyProfile.birth_date ? Math.floor((new Date().getTime() - new Date(babyProfile.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 0;

  // Show alert if name is missing or age calculation failed
  const showAlert = !babyProfile.name || !babyProfile.birth_date || babyAge < 0;
  return <>
      <div className="bg-white rounded-2xl p-6 shadow-sm py-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setIsAvatarDialogOpen(true)} className="relative mr-3 transition-transform hover:scale-105">
              <Avatar className="w-12 h-12">
                {babyProfile.avatar_url ? <AvatarImage src={babyProfile.avatar_url} alt={babyProfile.name} /> : <AvatarFallback className="bg-gradient-to-r from-pink-200 to-purple-200">
                    <Baby className="w-6 h-6 text-pink-600" />
                  </AvatarFallback>}
              </Avatar>
            </button>
            <div className="flex items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{babyProfile.name}</h3>
                <p className="text-sm text-gray-600">{babyAge} months old</p>
              </div>
              {showAlert && <AlertTriangle className="w-5 h-5 text-amber-500 ml-2" />}
            </div>
          </div>
          <button onClick={onEdit} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AvatarUploadDialog isOpen={isAvatarDialogOpen} onClose={() => setIsAvatarDialogOpen(false)} onAvatarUpdate={onAvatarUpdate} babyName={babyProfile.name} />
    </>;
};