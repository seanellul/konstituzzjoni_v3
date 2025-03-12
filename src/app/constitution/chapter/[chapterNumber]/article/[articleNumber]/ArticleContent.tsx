"use client";

import { motion } from 'framer-motion';
import { AmendmentHistory, CrossReference, Paragraph, Section, Article } from '@/types/constitution';
import { toRomanNumeral } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { trackArticleView } from '@/lib/analytics';

interface ArticleContentProps {
  article: Article;
  chapterNum: number;
  articleNum: number;
}

export default function ArticleContent({ article, chapterNum, articleNum }: ArticleContentProps) {
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);
  
  useEffect(() => {
    // Track article view when the component mounts
    if (chapterNum && articleNum) {
      trackArticleView(chapterNum, articleNum);
    }
  }, [chapterNum, articleNum]);

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

  // Get background color based on level for the identifier badge
  const getBadgeStyles = (level: number, isHovered: boolean) => {
    // Define base colors for each level
    let bgColor, textColor, borderColor, shadow;
    
    if (level === 0) {
      bgColor = isHovered ? 'bg-primary-700' : 'bg-primary-50';
      textColor = isHovered ? 'text-primary-DEFAULT' : 'text-primary-DEFAULT';
      borderColor = 'border-primary-200';
      shadow = isHovered ? 'shadow-md' : 'shadow-sm';
    } else if (level === 1) {
      bgColor = isHovered ? 'bg-blue-500' : 'bg-blue-50';
      textColor = isHovered ? 'text-white' : 'text-blue-700';
      borderColor = 'border-blue-200';
      shadow = isHovered ? 'shadow' : 'shadow-sm';
    } else {
      bgColor = isHovered ? 'bg-indigo-500' : 'bg-indigo-50';
      textColor = isHovered ? 'text-white' : 'text-indigo-700';
      borderColor = 'border-indigo-200';
      shadow = 'shadow-sm';
    }
    
    return { bgColor, textColor, borderColor, shadow };
  };

  const renderAmendmentHistory = (amendmentHistory: AmendmentHistory) => {
    if (!amendmentHistory) return null;

    return (
      <motion.div 
        className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300 hover:bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-bold text-lg mb-3 text-primary">Amendment History</h3>
        <p className="mb-2">{amendmentHistory.date} - {amendmentHistory.description}</p>
        <p className="text-sm text-gray-500">Legal Reference: {amendmentHistory.legalReference}</p>
      </motion.div>
    );
  };

  const renderCrossReferences = (references: CrossReference[]) => {
    if (!references || references.length === 0) return null;

    return (
      <motion.div 
        className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-300 hover:bg-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="font-bold text-lg mb-3 text-blue-800">Related Articles</h3>
        <ul className="space-y-2">
          {references.map((ref, index) => (
            <li key={index} className="hover:translate-x-1 transition-transform">
              <a 
                href={`/constitution/chapter/${ref.chapterNumber}/article/${ref.articleNumber}`}
                className="text-blue-600 hover:underline flex items-center"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                <span>Article {ref.articleNumber} (Chapter {ref.chapterNumber})</span>
              </a>
              <p className="text-sm text-gray-600 ml-5">{ref.description}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/constitution", label: "Constitution" },
          { href: `/constitution/chapter/${chapterNum}`, label: `Chapter ${toRomanNumeral(chapterNum)}` },
          { href: "", label: `Article ${articleNum}`, active: true },
        ]}
      />

      <motion.article 
        className="mt-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold font-serif mb-2 text-gray-900"
          variants={itemVariants}
        >
          Article {article.number}{article.title && `: ${article.title}`}
        </motion.h1>

        <motion.div 
          className="text-sm text-gray-500 mb-8"
          variants={itemVariants}
        >
          Chapter {toRomanNumeral(article.chapterNumber)} - {article.chapterTitle}
        </motion.div>
        
        {article.content && Array.isArray(article.content) && (
          <div className="space-y-4 prose-lg max-w-none">
            {article.content.map((paragraph, index) => {
              const paragraphText = typeof paragraph === 'string' ? paragraph : paragraph.text;
              const paragraphNum = typeof paragraph === 'string' ? index + 1 : paragraph.paragraph;
              const { type, level } = getParagraphType(paragraphText);
              const { identifier, content } = parseIdentifier(paragraphText);
              
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
              
              // Determine if this is the first or last item in a subgroup
              const prevType = getAdjacentParagraphType(index, 'prev');
              const nextType = getAdjacentParagraphType(index, 'next');
              
              // Calculate indentation based on level
              const indentClass = level === 0 ? '' : level === 1 ? 'ml-6' : 'ml-12';
              
              // Get badge styles
              const isHovered = hoveredParagraph === paragraphNum;
              const { bgColor, textColor, borderColor, shadow } = getBadgeStyles(level, isHovered);
              
              // Get badge size and shape based on level
              let badgeSize = '';
              let badgeShape = '';
              
              if (level === 0) {
                badgeShape = 'rounded-md';
                badgeSize = 'min-w-[32px] h-7';
              } else if (level === 1) {
                badgeShape = 'rounded-full';
                badgeSize = 'w-7 h-7';
              } else {
                badgeShape = 'rounded-full';
                badgeSize = 'w-6 h-6';
              }
              
              return (
                <motion.div 
                  key={index}
                  className={`paragraph-container relative rounded-md transition-all duration-200 ${bgColorClass} ${level > 0 ? 'p-3' : 'p-0 mb-6'} ${indentClass}`}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredParagraph(paragraphNum)}
                  onMouseLeave={() => setHoveredParagraph(null)}
                >
                  {/* Simplified left border to indicate hierarchy */}
                  {level > 0 && (
                    <div 
                      className={`absolute left-0 top-0 h-full w-1 rounded-l ${
                        hoveredParagraph === paragraphNum 
                          ? 'bg-primary' 
                          : level === 1 ? 'bg-gray-300' : 'bg-gray-400'
                      }`} 
                    />
                  )}
                  
                  <div className="flex items-start pl-3">
                    {identifier && (
                      <motion.div 
                        className={`mr-4 flex-shrink-0 ${badgeShape} ${badgeSize} ${bgColor} ${textColor} ${borderColor} border transition-all duration-200 ${shadow} flex items-center justify-center self-start mt-0.5`}
                        animate={{ 
                          scale: isHovered ? 1.05 : 1,
                        }}
                      >
                        <span className={`font-medium leading-none ${level === 0 ? 'text-sm' : level === 1 ? 'text-sm' : 'text-xs'}`}>
                          {identifier}
                        </span>
                      </motion.div>
                    )}
                    <div className="content flex-1">
                      <span className="text-lg leading-relaxed">{content}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {article.amendmentHistory && renderAmendmentHistory(article.amendmentHistory)}
        {article.crossReferences && renderCrossReferences(article.crossReferences)}
        
        {article.notes && (
          <motion.div 
            className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100 hover:shadow-md transition-shadow duration-300 hover:bg-yellow-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-lg mb-3 text-yellow-800">Notes</h3>
            <p className="text-gray-800">{article.notes}</p>
          </motion.div>
        )}
      </motion.article>
    </>
  );
} 