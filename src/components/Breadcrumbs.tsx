"use client";

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="flex flex-wrap">
        <li>
          <Link href="/" className="breadcrumb-item">
            Home
          </Link>
          <span className="breadcrumb-separator" aria-hidden="true">
            /
          </span>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            {index !== items.length - 1 ? (
              <>
                <Link href={item.href} className="breadcrumb-item">
                  {item.label}
                </Link>
                <span className="breadcrumb-separator" aria-hidden="true">
                  /
                </span>
              </>
            ) : (
              <span className="text-gray-800 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 