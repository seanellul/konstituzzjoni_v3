'use client';

import { useEffect } from 'react';
import { trackChapterView } from '@/lib/analytics';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import { toRomanNumeral } from '@/lib/utils';
import { Paragraph } from '@/types/constitution';
import { motion } from 'framer-motion';

interface ArticlePreview {
  number: number;
  title: string;
  content: string | string[] | Paragraph[];
}

interface Chapter {
  number: number;
  title: string;
  subtitle?: string;
}

interface ChapterContentProps {
  chapter: Chapter;
  articles: ArticlePreview[];
  chapterNum: number;
}

export default function ChapterContent({ chapter, articles, chapterNum }: ChapterContentProps) {
  useEffect(() => {
    // Track chapter view when the component mounts
    if (chapterNum) {
      trackChapterView(chapterNum);
    }
  }, [chapterNum]);

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

  // Helper function to extract preview text from article content
  const getContentPreview = (content: string | string[] | Paragraph[]): string => {
    if (!content) return "No content available";
    
    // If content is a string, use it directly
    if (typeof content === 'string') {
      return content.substring(0, 150) + (content.length > 150 ? "..." : "");
    }
    
    // If content is an array
    if (Array.isArray(content) && content.length > 0) {
      const firstItem = content[0];
      
      // If the first item is a string
      if (typeof firstItem === 'string') {
        return firstItem.substring(0, 150) + (firstItem.length > 150 ? "..." : "");
      }
      
      // If the first item is a Paragraph object
      if (firstItem && typeof firstItem === 'object' && 'text' in firstItem) {
        return firstItem.text.substring(0, 150) + (firstItem.text.length > 150 ? "..." : "");
      }
    }
    
    return "No content available";
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/constitution", label: "Constitution" },
          { href: "", label: `Chapter ${toRomanNumeral(chapterNum)} - ${chapter.title}`, active: true },
        ]}
      />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold font-serif mt-6 mb-2 text-primary-DEFAULT"
          variants={itemVariants}
        >
          Chapter {toRomanNumeral(chapterNum)} - {chapter.title}
        </motion.h1>

        {chapter.subtitle && (
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            variants={itemVariants}
          >
            {chapter.subtitle}
          </motion.p>
        )}

        <motion.div 
          className="mt-10 grid grid-cols-1 gap-4"
          variants={itemVariants}
        >
          {articles.map((article, index) => (
            <motion.div
              key={article.number}
              variants={itemVariants}
              transition={{
                delay: index * 0.05
              }}
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
            >
              <Link
                href={`/constitution/chapter/${chapterNum}/article/${article.number}`}
                className="article-card group block"
              >
                <h2 className="text-xl font-semibold font-serif mb-2 group-hover:text-primary-DEFAULT transition-colors">
                  Article {article.number}{" "}
                  {article.title && <span>- {article.title}</span>}
                </h2>
                <p className="text-gray-600">
                  {getContentPreview(article.content)}
                </p>
                <div className="flex justify-end mt-2">
                  <span className="text-primary-DEFAULT text-sm group-hover:translate-x-1 transition-transform">
                    Read article →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
} 