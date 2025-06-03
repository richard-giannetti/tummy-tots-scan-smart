
import React, { useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface AvatarUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdate: (avatarUrl: string) => void;
  babyName: string;
}

export const AvatarUploadDialog = ({ isOpen, onClose, onAvatarUpdate, babyName }: AvatarUploadDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a data URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onAvatarUpdate(result);
          toast({
            title: "Avatar updated!",
            description: `${babyName}'s photo has been updated.`,
          });
          onClose();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Update {babyName}'s Photo</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            onClick={handleCameraClick}
            className="flex flex-col items-center space-y-2 h-20 bg-pink-500 hover:bg-pink-600"
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">Take Photo</span>
          </Button>
          
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="flex flex-col items-center space-y-2 h-20 border-pink-200 hover:bg-pink-50"
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm">Upload Photo</span>
          </Button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Choose a photo to personalize {babyName}'s profile
        </p>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};
