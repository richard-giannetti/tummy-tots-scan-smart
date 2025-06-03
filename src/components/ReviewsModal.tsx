
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface ReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

interface Review {
  id: string;
  parentName: string;
  babyAge: string;
  rating: number;
  comment: string;
  helpful: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    parentName: 'Sarah M.',
    babyAge: '8 months',
    rating: 5,
    comment: 'My little one absolutely loves this! Perfect texture and she finished the whole pouch.',
    helpful: 12
  },
  {
    id: '2',
    parentName: 'Mike L.',
    babyAge: '10 months',
    rating: 4,
    comment: 'Good quality ingredients. My baby enjoyed it but I wish it had less sugar.',
    helpful: 8
  },
  {
    id: '3',
    parentName: 'Emma R.',
    babyAge: '7 months',
    rating: 5,
    comment: 'Great for on-the-go! Clean ingredients and my baby loves the taste.',
    helpful: 15
  },
  {
    id: '4',
    parentName: 'Josh K.',
    babyAge: '9 months',
    rating: 3,
    comment: 'It\'s okay, but my baby didn\'t seem as excited about this flavor as others.',
    helpful: 4
  },
  {
    id: '5',
    parentName: 'Lisa H.',
    babyAge: '11 months',
    rating: 4,
    comment: 'Good nutrition content. Baby finished most of it. Would buy again.',
    helpful: 7
  }
];

export const ReviewsModal = ({ open, onOpenChange, productName }: ReviewsModalProps) => {
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Parent Reviews</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg mb-2">{productName}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {renderStars(Math.round(averageRating))}
                <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-600">Based on {mockReviews.length} reviews</span>
            </div>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-pink-100 text-pink-600">
                        {review.parentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{review.parentName}</p>
                          <p className="text-xs text-gray-500">Baby: {review.babyAge}</p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{review.helpful} parents found this helpful</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Reviews help other parents make informed choices for their babies
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
