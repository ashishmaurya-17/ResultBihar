import React, { useState } from 'react';

export default function ContactPortal() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactFeedback, setContactFeedback] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactFeedback(`Thank you ${contactName}! Your ticket regarding "${contactSubject}" has been registered successfully. Our Bihar Desk administrative officers will review details and reply back within 24 working hours.`);
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
  };

  return (
    <div className="bg-white rounded-2xl border p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
      <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-sans border-b pb-3">
        CONTACT OFFICIAL HELP DESK
      </h1>
      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
        Have any issues checking your Class 10th BSEB Matric result? Want to submit an advertisement objection or inform about a server slow performance? Use this official help desk to log your query:
      </p>

      <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ashish Kumar"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full bg-neutral-50 border rounded-lg px-3 py-2 outline-none focus:border-red-655 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-700">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. ashish@gmail.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-neutral-50 border rounded-lg px-3 py-2 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-700">Subject / Category</label>
          <input
            type="text"
            required
            placeholder="e.g. BSEB Matric Result verification fails"
            value={contactSubject}
            onChange={(e) => setContactSubject(e.target.value)}
            className="w-full bg-neutral-50 border rounded-lg px-3 py-2 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-700">Detailed Message</label>
          <textarea
            rows={4}
            required
            placeholder="Details of your query here..."
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            className="w-full bg-neutral-50 border rounded-lg px-3 py-2 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
          />
        </div>

        <button
          type="submit"
          className="bg-red-700 hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition"
        >
          Send Message
        </button>
      </form>

      {contactFeedback && (
        <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-xl leading-relaxed font-semibold text-xs sm:text-sm">
          {contactFeedback}
        </div>
      )}
    </div>
  );
}
