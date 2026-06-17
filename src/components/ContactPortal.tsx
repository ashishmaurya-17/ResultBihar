import React, { useState } from 'react';

export default function ContactPortal() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactFeedback, setContactFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/mykvogkb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMessage
        })
      });

      if (response.ok) {
        setContactFeedback(`Thank you ${contactName}! We received your message about "${contactSubject}". We will reply back soon.`);
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      } else {
        setContactFeedback("Oops! There was a problem submitting your form. Please try again.");
      }
    } catch (error) {
      setContactFeedback("Oops! There was a network error submitting your form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-none border-2 border-neutral-900 dark:border-zinc-700 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
      <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight font-sans border-b-2 border-neutral-900 dark:border-zinc-700 pb-3">
        CONTACT US
      </div>
      <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed">
        Have any issues checking your results or want to tell us about a problem? Use this form to send us a message, or email us directly at <a href="mailto:workwithashishmaurya@gmail.com" className="text-red-700 dark:text-red-400 font-bold hover:underline">workwithashishmaurya@gmail.com</a>.
      </p>

      <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ashish Kumar"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-zinc-850 border-2 border-neutral-300 dark:border-zinc-700 rounded-none px-3 py-2 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:text-zinc-100"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. ashish@gmail.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-zinc-850 border-2 border-neutral-300 dark:border-zinc-700 rounded-none px-3 py-2 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300">Subject / Category</label>
          <input
            type="text"
            required
            placeholder="e.g. BSEB Matric Result verification fails"
            value={contactSubject}
            onChange={(e) => setContactSubject(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-zinc-850 border-2 border-neutral-300 dark:border-zinc-700 rounded-none px-3 py-2 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:text-zinc-100"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300">Detailed Message</label>
          <textarea
            rows={4}
            required
            placeholder="Details of your query here..."
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-zinc-850 border-2 border-neutral-300 dark:border-zinc-700 rounded-none px-3 py-2 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 dark:text-zinc-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-700 hover:bg-neutral-900 border-2 border-black text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition disabled:opacity-75 disabled:cursor-not-allowed uppercase tracking-wider font-mono cursor-pointer"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {contactFeedback && (
        <div className="bg-emerald-100 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-300 p-4 border-2 border-emerald-400 rounded-none leading-relaxed font-semibold text-xs sm:text-sm">
          {contactFeedback}
        </div>
      )}
    </div>
  );
}
