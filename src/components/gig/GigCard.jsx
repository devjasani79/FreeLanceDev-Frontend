'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTag } from 'react-icons/fa';

export default function GigCard({ gig }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-300 px-1 sm:px-2"
    >
      <Link href={`/gigs/${gig._id}`} className="block">
        {/* Thumbnail */}
        <div className="relative h-52 w-full">
          <Image
            src={gig.gigThumbnail || '/placeholder.jpg'}
            alt={gig.title || 'Gig Image'}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold text-primary line-clamp-1">
            {gig.title || 'Untitled Gig'}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {gig.desc || 'No description provided.'}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="flex items-center gap-1 text-sm font-medium text-accent">
              <FaTag className="text-xs" /> {gig.category || 'Uncategorized'}
            </span>
            <span className="text-base font-bold text-green-600 dark:text-green-400">
              ₹{gig.pricePlans?.[0]?.price ?? 'N/A'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
