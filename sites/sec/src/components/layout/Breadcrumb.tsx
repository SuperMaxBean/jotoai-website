import React from 'react';
import Link from 'next/link';

export type BreadcrumbItem = { label: string; href?: string };

type Props = { items: BreadcrumbItem[] };

export default function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="breadcrumb" className="container mx-auto px-6 py-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-gray-500">/</span>}
            {item.href != null ? (
              <Link href={item.href} className="hover:text-brand-blue transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
