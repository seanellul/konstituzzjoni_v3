"use client";

import { motion } from 'framer-motion';
import { AmendmentHistory, CrossReference, Paragraph, Section, Article } from '@/types/constitution';
import { toRomanNumeral } from '@/lib/utils';
import { useState } from 'react';

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);
  
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

  // Function to determine paragraph type and hierarchy level
  const getParagraphType = (text: string) => {
    if (text.startsWith('(1)') || text.startsWith('(2)') || text.startsWith('(3)') || 
        text.startsWith('(4)') || text.startsWith('(5)') || text.startsWith('(6)') ||
        text.startsWith('(7)') || text.startsWith('(8)') || text.startsWith('(9)')) {
      return { type: 'section', level: 0 };
    } else if (text.startsWith('(a)') || text.startsWith('(b)') || text.startsWith('(c)') || 
               text.startsWith('(d)') || text.startsWith('(e)') || text.startsWith('(f)')) {
      return { type: 'subsection', level: 1 };
    } else if (text.startsWith('(i)') || text.startsWith('(ii)') || text.startsWith('(iii)') || 
               text.startsWith('(iv)') || text.startsWith('(v)') || text.startsWith('(vi)')) {
      return { type: 'subsection', level: 2 };
    } else {
      return { type: 'paragraph', level: 0 };
    }
  };

  // Extract identifier and content from paragraph text
  const parseIdentifier = (text: string) => {
    const match = text.match(/^\(([a-z0-9]+)\)\s*(.*)/i);
    if (match) {
      return {
        identifier: match[1],
        content: match[2]
      };
    }
    return { identifier: '', content: text };
  };

  // Safe function to check previous/next paragraph types with proper null checks
  const getAdjacentParagraphType = (index: number, direction: 'prev' | 'next') => {
    if (!article.content || !Array.isArray(article.content)) return { type: 'paragraph', level: 0 };
    
    const adjacentIndex = direction === 'prev' ? index - 1 : index + 1;
    
    if (adjacentIndex < 0 || adjacentIndex >= article.content.length) {
      return { type: 'paragraph', level: 0 };
    }
    
    const paragraphText = typeof article.content[adjacentIndex] === 'string' 
      ? article.content[adjacentIndex] as string
      : (article.content[adjacentIndex] as Paragraph).text;
      
    return getParagraphType(paragraphText);
  };

  // Determine if an item at level 1 has any child items at level 2
  const hasChildItems = (startIndex: number) => {
    if (!article.content || !Array.isArray(article.content)) return false;
    
    // Look ahead from current position
    for (let i = startIndex + 1; i < article.content.length; i++) {
      const paragraphText = typeof article.content[i] === 'string' 
        ? article.content[i] as string
        : (article.content[i] as Paragraph).text;
      
      const { level } = getParagraphType(paragraphText);
      
      // If we find a level 2 item, return true
      if (level === 2) return true;
      
      // If we hit another level 0 or level 1 item before finding a level 2, stop looking
      if (level === 0 || level === 1) return false;
    }
    
    return false;
  };

  return (
    <>
      <motion.div 
        className="article-header mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="article-title text-3xl font-bold font-serif text-primary-DEFAULT mb-2">
          Article {article.number}: {article.title}
        </h1>
        <h2 className="chapter-title text-xl text-gray-700">
          Chapter {toRomanNumeral(article.chapterNumber)} - {article.chapterTitle}
        </h2>
      </motion.div>

      <motion.div 
        className="article-content bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {article.content && Array.isArray(article.content) && (
          <div className="space-y-4">
            {article.content.map((paragraph, index) => {
              const paragraphText = typeof paragraph === 'string' ? paragraph : paragraph.text;
              const paragraphNum = typeof paragraph === 'string' ? index + 1 : paragraph.paragraph;
              const { type, level } = getParagraphType(paragraphText);
              const { identifier, content } = parseIdentifier(paragraphText);
              
              // Determine styling based on paragraph type and level
              const paddingLeft = level * 24;
              
              // Base background color
              let bgBaseColor = 'bg-white';
              if (level === 1) bgBaseColor = 'bg-gray-50';
              if (level === 2) bgBaseColor = 'bg-gray-100';
              
              // Calculate hover background color (darker version)
              let bgHoverColor = 'bg-gray-100';
              if (level === 1) bgHoverColor = 'bg-gray-200';
              if (level === 2) bgHoverColor = 'bg-gray-300';
              
              const bgColorClass = hoveredParagraph === paragraphNum 
                ? bgHoverColor 
                : bgBaseColor;
              
              // Determine if this is the first or last item in a subgroup using the safe function
              const prevType = getAdjacentParagraphType(index, 'prev');
              const nextType = getAdjacentParagraphType(index, 'next');
              
              const isFirstInSubgroup = level === 1 && prevType.level === 0;
              const isLastInSubgroup = level === 1 && (nextType.level === 0 || nextType.level === undefined);
              const isFirstInNestedGroup = level === 2 && prevType.level !== 2;
              
              // Check if level 1 item has any level 2 children
              const hasChildren = level === 1 ? hasChildItems(index) : false;
              
              return (
                <motion.div 
                  key={index}
                  className={`paragraph-container relative rounded-md transition-all duration-200 ${bgColorClass} ${level > 0 ? 'p-3' : 'p-0 mb-6'}`}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredParagraph(paragraphNum)}
                  onMouseLeave={() => setHoveredParagraph(null)}
                >
                  {/* Tree structure connecting lines */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 pointer-events-none">
                    {/* Main vertical line for all nested items */}
                    {level > 0 && (
                      <div 
                        className={`absolute left-2 top-0 bottom-0 w-0.5 ${
                          hoveredParagraph === paragraphNum 
                            ? 'bg-primary-DEFAULT' 
                            : 'bg-gray-300'
                        }`} 
                      />
                    )}
                    
                    {/* Horizontal line connecting to content */}
                    {level > 0 && (
                      <div className="absolute left-2 top-1/2 w-6 h-0.5 bg-gray-300" />
                    )}
                    
                    {/* Additional vertical line for level 2 items */}
                    {level === 2 && (
                      <div className="absolute left-[-16px] top-0 bottom-0 w-0.5 bg-gray-300" />
                    )}
                    
                    {/* Horizontal connector for level 2 items */}
                    {level === 2 && (
                      <div className="absolute left-[-16px] top-1/2 w-6 h-0.5 bg-gray-300" />
                    )}
                  </div>

                  <div className={`flex ${level > 0 ? 'ml-10' : ''}`} style={{ paddingLeft: level === 0 ? paddingLeft : 0 }}>
                    {identifier && (
                      <span className={`font-medium mr-3 ${level === 0 ? 'text-primary-DEFAULT font-bold' : 'text-gray-700'}`}>
                        ({identifier})
                      </span>
                    )}
                    <div className="content flex-1">
                      <span className="text-lg">{content}</span>
                    </div>
                  </div>
                  
                  {/* Extra vertical line that extends down to connect with sub-items */}
                  {hasChildren && (
                    <div className="absolute left-2 top-[50%] bottom-[-12px] w-0.5 bg-gray-300" />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {article.amendmentHistory && (
          <motion.div 
            className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300 hover:bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-bold text-lg mb-3 text-primary-DEFAULT">Amendment History</h3>
            <p className="mb-2">{article.amendmentHistory.date} - {article.amendmentHistory.description}</p>
            <p className="text-sm text-gray-500">Legal Reference: {article.amendmentHistory.legalReference}</p>
          </motion.div>
        )}

        {article.crossReferences && article.crossReferences.length > 0 && (
          <motion.div 
            className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300 hover:bg-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-lg mb-3 text-primary-DEFAULT">Related Articles</h3>
            <ul className="space-y-2">
              {article.crossReferences.map((ref, index) => (
                <li key={index} className="hover:translate-x-1 transition-transform">
                  <a 
                    href={`/constitution/chapter/${ref.chapterNumber}/article/${ref.articleNumber}`}
                    className="text-primary-DEFAULT hover:underline flex items-center"
                  >
                    <span className="mr-2">→</span>
                    <span>Article {ref.articleNumber} - {ref.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </>
  );
} 