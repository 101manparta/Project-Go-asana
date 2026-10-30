import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const Contact: React.FC = () => {
  const { showToast } = useStudio();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Inquiries');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your inquiry has been sent to our studio reception.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-neutral-800 text-xs font-medium">
          <span>Connect with Sanctuary</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-neutral-900">
          Get in Touch
        </h1>
        <p className="text-sm text-neutral-600 font-light leading-relaxed">
          Questions regarding private sound healings, corporate wellness, or class recommendations? Our reception hosts are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-black/8 space-y-6">
            <h3 className="font-serif font-medium text-lg text-neutral-900">
              Studio Location &amp; Hours
            </h3>

            <div className="space-y-4 text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-900">Sanctuary Address</span>
                  <span>428 Lotus Way, Zen Garden District</span>
                  <span className="block text-neutral-500">San Francisco, CA 94102</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-900">Opening Hours</span>
                  <span>Monday &ndash; Friday: 6:30 AM &ndash; 9:00 PM</span>
                  <span className="block text-neutral-500">Saturday &ndash; Sunday: 7:30 AM &ndash; 8:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-900">Studio Telephone</span>
                  <span>+1 (415) 555-0198</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-900">Direct Inquiries</span>
                  <span>sanctuary@asanayoga.wellness</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration Button */}
            <div className="pt-4 border-t border-black/5">
              <a
                href="https://wa.me/14155550198?text=Hello%20ASANA-Yoga%2C%20I%20have%20an%20inquiry%20regarding%20classes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>
        </div>

        {/* Inquiry Form Column */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-black/8">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium text-neutral-900">
                  Message Received
                </h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, {name}. A member of our studio team will respond to {email} within 24 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-5 py-2 rounded-full border border-black/10 text-xs font-medium text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif font-medium text-lg text-neutral-900 mb-2">
                  Send a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Arya Sen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-neutral-900 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="arya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-neutral-900 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700">Inquiry Subject</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-neutral-900 bg-white text-neutral-800"
                  >
                    <option value="General Inquiries">General Class Inquiries</option>
                    <option value="Private Healing">Private Sound Healing or 1-on-1</option>
                    <option value="Corporate Wellness">Corporate &amp; Group Retreats</option>
                    <option value="Memberships">Membership Assistance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How may our sanctuary support your practice?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-neutral-900 bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
