'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  TrashIcon, 
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import api from '@/utils/api';

export default function CreateGigForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    keywords: '',
    requirements: []
  });

  const [pricePlans, setPricePlans] = useState([
    {
      tier: 'Basic',
      price: '',
      deliveryTime: '',
      revisions: 0,
      features: ['']
    }
  ]);

  const [faqs, setFaqs] = useState([
    { question: '', answer: '' }
  ]);

  const [newRequirement, setNewRequirement] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [gigThumbnail, setGigThumbnail] = useState(null);
  const [gigImages, setGigImages] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    'design', 'development', 'marketing', 'business', 'writing', 'video', 'music'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== requirement)
    }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(kw => kw !== keyword)
    }));
  };

  const handlePricePlanChange = (index, field, value) => {
    const newPricePlans = [...pricePlans];
    newPricePlans[index][field] = value;
    setPricePlans(newPricePlans);
  };

  const handleAddPricePlan = () => {
    setPricePlans([...pricePlans, {
      tier: pricePlans.length === 1 ? 'Standard' : 'Premium',
      price: '',
      deliveryTime: '',
      revisions: 0,
      features: ['']
    }]);
  };

  const handleRemovePricePlan = (index) => {
    if (pricePlans.length > 1) {
      setPricePlans(pricePlans.filter((_, i) => i !== index));
    }
  };

  const handlePricePlanFeatureChange = (planIndex, featureIndex, value) => {
    const newPricePlans = [...pricePlans];
    newPricePlans[planIndex].features[featureIndex] = value;
    setPricePlans(newPricePlans);
  };

  const handleAddFeature = (planIndex) => {
    const newPricePlans = [...pricePlans];
    newPricePlans[planIndex].features.push('');
    setPricePlans(newPricePlans);
  };

  const handleRemoveFeature = (planIndex, featureIndex) => {
    const newPricePlans = [...pricePlans];
    newPricePlans[planIndex].features.splice(featureIndex, 1);
    setPricePlans(newPricePlans);
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGigThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setGigImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('desc', formData.desc);
      submitData.append('category', formData.category);
      submitData.append('keywords', formData.keywords.join(','));
      submitData.append('requirements', JSON.stringify(formData.requirements));
      submitData.append('pricePlans', JSON.stringify(pricePlans));
      submitData.append('faqs', JSON.stringify(faqs));

      if (gigThumbnail) {
        submitData.append('gigThumbnail', gigThumbnail);
      }

      gigImages.forEach((image, index) => {
        submitData.append('gigImages', image);
      });

      const response = await api.post('/gigs', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.msg) {
        setMessage({ type: 'success', text: response.data.msg });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.error || 'Failed to create gig';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="card">
        <h3 className="text-xl font-semibold text-foreground mb-6">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Gig Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input"
              placeholder="e.g., I will design a professional logo"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="desc" className="block text-sm font-medium text-foreground mb-2">
            Description *
          </label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            rows={6}
            className="input resize-none"
            placeholder="Describe what you offer, your experience, and what makes you unique..."
            required
          />
        </div>
      </div>

      {/* Keywords */}
      <div className="card">
        <h3 className="text-xl font-semibold text-foreground mb-6">Keywords</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="input flex-1"
              placeholder="Add a keyword"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="btn btn-primary px-4"
              disabled={!newKeyword.trim()}
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="card">
        <h3 className="text-xl font-semibold text-foreground mb-6">Requirements</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              className="input flex-1"
              placeholder="Add a requirement"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="btn btn-primary px-4"
              disabled={!newRequirement.trim()}
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="flex-1">{requirement}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(requirement)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Plans */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Price Plans</h3>
          <button
            type="button"
            onClick={handleAddPricePlan}
            className="btn btn-outline text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Plan
          </button>
        </div>

        <div className="space-y-6">
          {pricePlans.map((plan, planIndex) => (
            <div key={planIndex} className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-foreground">{plan.tier} Package</h4>
                {pricePlans.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePricePlan(planIndex)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => handlePricePlanChange(planIndex, 'price', e.target.value)}
                    className="input"
                    placeholder="0"
                    min="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Delivery Time (days)</label>
                  <input
                    type="number"
                    value={plan.deliveryTime}
                    onChange={(e) => handlePricePlanChange(planIndex, 'deliveryTime', e.target.value)}
                    className="input"
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Revisions</label>
                  <input
                    type="number"
                    value={plan.revisions}
                    onChange={(e) => handlePricePlanChange(planIndex, 'revisions', e.target.value)}
                    className="input"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Features</label>
                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handlePricePlanFeatureChange(planIndex, featureIndex, e.target.value)}
                        className="input flex-1"
                        placeholder="Add a feature"
                        required
                      />
                      {plan.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(planIndex, featureIndex)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddFeature(planIndex)}
                    className="btn btn-outline text-sm"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Feature
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h3>
          <button
            type="button"
            onClick={handleAddFaq}
            className="btn btn-outline text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add FAQ
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">FAQ {index + 1}</h4>
                {faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  className="input"
                  placeholder="Question"
                  required
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  className="input resize-none"
                  rows={3}
                  placeholder="Answer"
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="card">
        <h3 className="text-xl font-semibold text-foreground mb-6">Images</h3>
        
        {/* Thumbnail */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Gig Thumbnail *
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <div className="w-32 h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <PhotoIcon className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload</span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                required
              />
            </label>
            <div>
              <p className="text-sm text-muted-foreground">
                This will be the main image for your gig
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 1280x720px, JPG/PNG
              </p>
            </div>
          </div>
        </div>

        {/* Additional Images */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Additional Images
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <div className="w-32 h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors">
                <PhotoIcon className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Upload</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>
            <div>
              <p className="text-sm text-muted-foreground">
                Add more images to showcase your work
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max 10 images, JPG/PNG
              </p>
            </div>
          </div>
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setGigImages(gigImages.filter((_, i) => i !== index));
                      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary px-8"
        >
          {isLoading ? 'Creating...' : 'Create Gig'}
        </button>
      </div>
    </form>
  );
} 