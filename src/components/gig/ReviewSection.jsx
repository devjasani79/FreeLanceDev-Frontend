'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ReviewSection({ gigId, gigTitle }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    category: 'overall'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [gigId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/reviews/gig/${gigId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    setIsSubmitting(true);
    try {
      // First, we need to get the user's orders for this gig
      const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const completedOrder = ordersData.orders.find(
          order => order.gigId._id === gigId && order.status === 'Completed'
        );

        if (!completedOrder) {
          alert('You can only review completed orders for this gig.');
          return;
        }

        const reviewResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            orderId: completedOrder._id,
            rating: newReview.rating,
            comment: newReview.comment.trim(),
            category: newReview.category
          })
        });

        if (reviewResponse.ok) {
          setShowReviewForm(false);
          setNewReview({ rating: 5, comment: '', category: 'overall' });
          fetchReviews(); // Refresh reviews
        } else {
          const errorData = await reviewResponse.json();
          alert(errorData.msg || 'Failed to submit review');
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'communication': 'Communication',
      'quality': 'Quality',
      'value': 'Value',
      'delivery': 'Delivery',
      'overall': 'Overall'
    };
    return labels[category] || category;
  };

  if (!stats && reviews.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Reviews
        </h3>
        <p className="text-muted-foreground text-center py-8">
          No reviews yet. Be the first to review this gig!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      {stats && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Review Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.totalReviews} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = stats.ratingDistribution.find(d => d.rating === rating)?.count || 0;
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-8">
                        {rating}★
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {user && !showReviewForm && (
        <div className="card p-6">
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn btn-primary w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </button>
        </div>
      )}

      {showReviewForm && (
        <div className="card p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Write Your Review
          </h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= newReview.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                value={newReview.category}
                onChange={(e) => setNewReview(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="overall">Overall Experience</option>
                <option value="communication">Communication</option>
                <option value="quality">Quality of Work</option>
                <option value="value">Value for Money</option>
                <option value="delivery">Delivery Time</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this gig..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !newReview.comment.trim()}
                className="btn btn-primary flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setNewReview({ rating: 5, comment: '', category: 'overall' });
                }}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            All Reviews ({reviews.length})
          </h3>
          
          {reviews.map((review) => (
            <div key={review._id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Reviewer Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {review.reviewer.profilePic ? (
                      <img 
                        src={review.reviewer.profilePic} 
                        alt={review.reviewer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500">
                          {review.reviewer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground">
                      {review.reviewer.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getCategoryLabel(review.category)}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 