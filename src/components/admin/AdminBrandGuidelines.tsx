'use client';
import BrandHub from '../BrandHub';
import { Language } from '../../types';

export default function AdminBrandGuidelines({ lang }: { lang: Language }) {
  return (
    <div className="-m-8">
      <BrandHub lang={lang} isOpen={true} onClose={() => {}} variant="embedded" />
    </div>
  );
}
