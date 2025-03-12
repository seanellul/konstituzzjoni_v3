"use client";

import { motion } from 'framer-motion';
import { AmendmentHistory, CrossReference, Paragraph, Section } from '@/types/constitution';

type ArticleContentProps = {
  article: {
    number: number;
    title: string;
    chapterNumber: number;
    chapterTitle: string;
    content?: (string | Paragraph)[];
    sections?: Section[];
    amendmentHistory: AmendmentHistory | null;
    crossReferences?: CrossReference[];
    notes?: string;
    tags?: string[];
  };
};

export default function ArticleContent({ article }: ArticleContentProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div 
        className="article-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="article-title">Article {article.number}: {article.title}</h1>
        <h2 className="chapter-title">Chapter {article.chapterNumber} - {article.chapterTitle}</h2>
      </motion.div>

      <motion.div 
        className="article-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {article.content && Array.isArray(article.content) && (
          <div>
            {article.content.map((paragraph, index) => {
              if (typeof paragraph === 'string') {
                return (
                  <motion.p key={index} className="paragraph" variants={itemVariants}>
                    {paragraph}
                  </motion.p>
                );
              } else {
                const p = paragraph as Paragraph;
                return (
                  <motion.p key={p.paragraph} className="paragraph" variants={itemVariants}>
                    {p.text}
                  </motion.p>
                );
              }
            })}
          </div>
        )}

        {article.sections && article.sections.length > 0 && (
          <div className="mt-8">
            {article.sections.map((section: Section) => (
              <motion.div key={section.identifier} className="section" variants={itemVariants}>
                <div>
                  <span className="section-identifier">{section.identifier}.</span>
                  {section.content.map((content, idx) => (
                    <span key={idx}>{content}</span>
                  ))}
                </div>
                
                {section.subsections.length > 0 && (
                  <div className="mt-2">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.identifier} className="subsection">
                        <span className="subsection-identifier">({subsection.identifier})</span>
                        {subsection.content.map((content, idx) => (
                          <span key={idx}>{content}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {article.amendmentHistory && (
        <motion.div 
          className="mt-8 p-4 bg-gray-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold text-lg mb-2">Amendment History</h3>
          <p>{article.amendmentHistory.date} - {article.amendmentHistory.description}</p>
          <p className="text-sm text-gray-500 mt-1">Legal Reference: {article.amendmentHistory.legalReference}</p>
        </motion.div>
      )}

      {article.crossReferences && article.crossReferences.length > 0 && (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-bold text-lg mb-2">Related Articles</h3>
          <ul className="list-disc pl-5 space-y-1">
            {article.crossReferences.map((ref, index) => (
              <li key={index}>
                <a 
                  href={`/constitution/chapter/${ref.chapterNumber}/article/${ref.articleNumber}`}
                  className="text-primary-DEFAULT hover:underline"
                >
                  Article {ref.articleNumber} - {ref.description}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </>
  );
} 