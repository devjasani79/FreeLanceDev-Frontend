'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import api from '@/utils/api';
import Spinner from '@/components/Spinner';
import { AuthContext } from '@/context/AuthContext';

const priceTierEnum = z.enum(['Basic', 'Standard', 'Premium']);

const gigSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  desc: z.string().min(10, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  keywords: z.string().optional(),

  pricePlans: z
    .array(
      z.object({
        tier: priceTierEnum,
        price: z.string().min(1, 'Price is required'),
        deliveryTime: z.string().min(1, 'Delivery time is required'),
        revisions: z.string().min(1, 'Revisions required'),
        features: z.string().min(1, 'At least one feature is required'),
      })
    )
    .min(1, 'At least one price plan is required'),

  faqs: z
    .array(
      z.object({
        question: z.string().min(5, 'Question too short'),
        answer: z.string().min(5, 'Answer too short'),
      })
    )
    .optional(),

  requirements: z
    .array(z.string().min(3, 'Requirement too short'))
    .min(1, 'At least one requirement is required'),

  gigThumbnail: z.any(),
  gigImages: z.any().optional(),
});

export default function CreateGigPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      title: '',
      desc: '',
      category: '',
      keywords: '',
      pricePlans: [{ tier: 'Basic', price: '', deliveryTime: '', revisions: '', features: '' }],
      faqs: [{ question: '', answer: '' }],
      requirements: [''],
      gigThumbnail: null,
      gigImages: [],
    },
  });

  const { fields: pricePlans, append: addPricePlan } = useFieldArray({ control, name: 'pricePlans' });
  const { fields: faqs, append: addFaq } = useFieldArray({ control, name: 'faqs' });
  const { fields: requirements, append: addReq } = useFieldArray({ control, name: 'requirements' });

  const onSubmit = async (data) => {
    setServerError('');
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('desc', data.desc);
    formData.append('category', data.category);
    formData.append('keywords', data.keywords || '');

    formData.append('pricePlans', JSON.stringify(data.pricePlans));
    formData.append('faqs', JSON.stringify(data.faqs));
    formData.append('requirements', JSON.stringify(data.requirements));

    if (data.gigThumbnail?.[0]) {
      formData.append('gigThumbnail', data.gigThumbnail[0]);
    }

    if (data.gigImages?.length) {
      for (let img of data.gigImages) {
        formData.append('gigImages', img);
      }
    }

    try {
      const res = await api.post('/gigs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 201) {
        setSuccessMsg('Gig created successfully!');
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('❌ Error creating gig:', err);
      setServerError(err.response?.data?.error || 'Unexpected error occurred.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Gig</h1>

      {serverError && <div className="text-red-600 mb-4">{serverError}</div>}
      {successMsg && <div className="text-green-600 mb-4">{successMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <input {...register('title')} placeholder="Title" className="w-full p-2 border rounded" />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <textarea {...register('desc')} rows={4} placeholder="Description" className="w-full p-2 border rounded" />
          {errors.desc && <p className="text-sm text-red-500">{errors.desc.message}</p>}
        </div>

        {/* Category */}
        <div>
          <select {...register('category')} className="w-full p-2 border rounded">
            <option value="">Select Category</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="marketing">Marketing</option>
            <option value="business">Business</option>
            <option value="writing">Writing</option>
            <option value="video">Video</option>
            <option value="music">Music</option>
          </select>
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>

        {/* Keywords */}
        <input {...register('keywords')} placeholder="Keywords (comma separated)" className="w-full p-2 border rounded" />

        {/* Price Plans */}
        <div>
          <h3 className="font-semibold mb-2">Price Plans</h3>
          {pricePlans.map((plan, idx) => (
            <div key={plan.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              <select {...register(`pricePlans.${idx}.tier`)} className="p-2 border rounded">
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
              <input {...register(`pricePlans.${idx}.price`)} placeholder="Price" className="p-2 border rounded" />
              <input {...register(`pricePlans.${idx}.deliveryTime`)} placeholder="Delivery Time" className="p-2 border rounded" />
              <input {...register(`pricePlans.${idx}.revisions`)} placeholder="Revisions" className="p-2 border rounded" />
              <input {...register(`pricePlans.${idx}.features`)} placeholder="Features" className="p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={() => addPricePlan({ tier: 'Basic', price: '', deliveryTime: '', revisions: '', features: '' })} className="text-sm text-blue-600">
            + Add another plan
          </button>
          {errors.pricePlans && <p className="text-sm text-red-500">{errors.pricePlans.message}</p>}
        </div>

        {/* FAQs */}
        <div>
          <h3 className="font-semibold mb-2">FAQs</h3>
          {faqs.map((faq, idx) => (
            <div key={faq.id} className="space-y-1 mb-2">
              <input {...register(`faqs.${idx}.question`)} placeholder="Question" className="w-full p-2 border rounded" />
              <input {...register(`faqs.${idx}.answer`)} placeholder="Answer" className="w-full p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={() => addFaq({ question: '', answer: '' })} className="text-sm text-blue-600">
            + Add FAQ
          </button>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="font-semibold mb-2">Requirements</h3>
          {requirements.map((req, idx) => (
            <input key={req.id} {...register(`requirements.${idx}`)} placeholder={`Requirement #${idx + 1}`} className="w-full p-2 border rounded mb-2" />
          ))}
          <button type="button" onClick={() => addReq('')} className="text-sm text-blue-600">
            + Add Requirement
          </button>
          {errors.requirements && <p className="text-sm text-red-500">{errors.requirements.message}</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block font-medium mb-1">Thumbnail</label>
          <input type="file" {...register('gigThumbnail')} className="w-full p-2 rounded bg-gray-50" />
          {errors.gigThumbnail && <p className="text-sm text-red-500">{errors.gigThumbnail.message}</p>}
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium mb-1">Additional Images</label>
          <input type="file" multiple {...register('gigImages')} className="w-full p-2 rounded bg-gray-50" />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {isSubmitting ? <Spinner /> : 'Create Gig'}
        </button>
      </form>
    </div>
  );
}
