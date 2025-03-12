'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Chapter } from '@/types/constitution';
import { toRomanNumeral } from '@/lib/utils';

interface ConstitutionContentProps {
  chapters: Chapter[];
}

export default function ConstitutionContent({ chapters }: ConstitutionContentProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {chapters.map((chapter: Chapter, index) => (
        <motion.div
          key={chapter.number}
          variants={itemVariants}
          transition={{
            delay: index * 0.05
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <Link 
            href={`/constitution/chapter/${chapter.number}`}
            className="chapter-card group block"
          >
            <h2 className="text-2xl font-bold font-serif text-primary-DEFAULT group-hover:text-primary-dark transition-colors">
              Chapter {toRomanNumeral(chapter.number)}
            </h2>
            <h3 className="text-xl text-gray-700 mb-4">{chapter.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                {chapter.articles?.length || 0} Articles
              </span>
              <span className="text-primary-DEFAULT group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
} 