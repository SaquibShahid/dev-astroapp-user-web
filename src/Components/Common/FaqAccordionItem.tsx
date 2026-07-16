import { IconChevronRight } from '@tabler/icons-react';
import React, { useState } from 'react';

interface FaqAccordionItemProps {
  faq: { question: string; answer: string };
}

const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-bg">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <IconChevronRight
          size={16}
          className={`text-primary flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
        <span className="text-sm font-semibold text-text-main flex-1">{faq.question}</span>
      </button>
      {isOpen && <p className="px-4 pb-3.5 pl-11 text-sm text-text-muted">{faq.answer}</p>}
    </div>
  );
};

export default FaqAccordionItem;
