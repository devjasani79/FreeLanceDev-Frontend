'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Tag, User, CheckCircle, AlertCircle,
  HelpCircle, IndianRupee
} from 'lucide-react';

export default function GigDetail({ gig }) {
  return (
    <article
      className="max-w-6xl mx-auto p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 space-y-12"
    >
      {/* Header Section */}
      <header className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold text-primary"
        >
          {gig.title}
        </motion.h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {gig.desc}
        </p>

        {gig.user && (
          <address className="flex items-center gap-3 not-italic text-sm text-gray-600 dark:text-gray-400">
            <User className="w-5 h-5" />
            <span className="font-medium">{gig.user.name}</span>
            {gig.user.role && (
              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs">
                {gig.user.role}
              </span>
            )}
          </address>
        )}
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Info Column */}
        <div className="space-y-8">
          {/* Category */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="space-y-2"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" /> Category
            </h2>
            <span className="inline-block bg-accent/10 text-accent px-4 py-1 rounded-full text-sm">
              {gig.category}
            </span>
          </motion.section>

          {/* Keywords */}
          {gig.keywords?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Keywords</h2>
              <ul className="flex flex-wrap gap-3">
                {gig.keywords.map((kw, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-100 dark:bg-neutral-800 px-4 py-1 rounded-full text-sm"
                  >
                    {kw}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Price Plans */}
          {(gig.pricePlans?.length > 0 ? gig.pricePlans : [{ tier: 'Standard', description: gig.desc, price: gig.price || gig.amount || gig.budget || 'N/A', deliveryTime: gig.deliveryTime || 7, revisions: gig.revisions || 2, features: gig.features || [] }]).length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Price Plans</h2>
              <div className="space-y-4">
                {(gig.pricePlans?.length > 0 ? gig.pricePlans : [{ tier: 'Standard', description: gig.desc, price: gig.price || gig.amount || gig.budget || 'N/A', deliveryTime: gig.deliveryTime || 7, revisions: gig.revisions || 2, features: gig.features || [] }]).map((plan, index) => (
                  <motion.article
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 bg-gray-50 dark:bg-neutral-800 rounded-xl border hover:shadow-md"
                  >
                    <h3 className="font-semibold text-lg">{plan.tier}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <p className="font-bold text-primary mt-2 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" /> {plan.price}
                    </p>
                    <small className="text-xs text-gray-500 mt-1 block">
                      Delivery: {plan.deliveryTime} days • Revisions: {plan.revisions}
                    </small>
                    {plan.features?.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.article>
                ))}
              </div>
            </section>
          )}

          {/* Requirements */}
          {gig.requirements?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" /> Requirements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground">
                {gig.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs */}
          {gig.faqs?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> FAQs
              </h2>
              <dl className="space-y-4">
                {gig.faqs.map((faq, idx) => (
                  <div key={idx}>
                    <dt className="font-medium">{faq.question}</dt>
                    <dd className="text-sm text-muted-foreground">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        {/* Media Column */}
        <aside className="space-y-6">
          <figure className="relative w-full h-80 md:h-96">
            <Image
              src={gig.gigThumbnail || gig.cover || '/placeholder.jpg'}
              alt={gig.title}
              fill
              className="rounded-xl object-cover"
            />
          </figure>
        </aside>
      </section>
    </article>
  );
}
