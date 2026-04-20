import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { FAQ } from '@/types';

interface FAQSectionProps {
  faqs: FAQ[];
  storeName: string;
}

export function FAQSection({ faqs, storeName }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-black mb-2">שאלות נפוצות על קופונים ב-{storeName}</h2>
      <p className="text-muted-foreground text-sm mb-6">תשובות לשאלות הנפוצות ביותר</p>

      <div className="bg-card rounded-2xl border p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.id} value={`faq-${i}`}>
              <AccordionTrigger className="text-right text-sm font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
