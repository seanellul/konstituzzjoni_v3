"use client";

import Link from 'next/link';
import { Article } from '@/types/constitution';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <div className="article-card">
      <h3 className="text-xl font-bold text-primary-DEFAULT">
        <Link 
          href={`/constitution/chapter/${article.chapterNumber}/article/${article.number}`}
          className="hover:underline"
        >
          Article {article.number}: {article.title}
        </Link>
      </h3>
      <p className="text-gray-600 mt-2">
        {article.notes || 'Part of the Constitution of Malta'}
      </p>
      {article.tags && article.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleCard; 