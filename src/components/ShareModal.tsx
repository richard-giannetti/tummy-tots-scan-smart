
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Mail, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  shareUrl: string;
}

export const ShareModal = ({ open, onOpenChange, productName, shareUrl }: ShareModalProps) => {
  const shareText = `Check out this baby food analysis for ${productName} on Healthy Tummies!`;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Baby Food Analysis: ${productName}`);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(emailUrl, '_blank');
    onOpenChange(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Product Analysis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Share this {productName} analysis with other parents
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleWhatsAppShare}
              className="w-full justify-start"
              variant="outline"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Share via WhatsApp
            </Button>
            
            <Button
              onClick={handleEmailShare}
              className="w-full justify-start"
              variant="outline"
            >
              <Mail className="w-4 h-4 mr-2" />
              Share via Email
            </Button>
            
            <Button
              onClick={handleCopyLink}
              className="w-full justify-start"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
