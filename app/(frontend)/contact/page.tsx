"use client";

import React, { useState } from "react";
import { Send, Check, Sparkles, BookOpen } from "lucide-react";
import { Button } from "../_components/ui/Button";
import { Input } from "../_components/ui/Input";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark-bg transition-colors pb-20 select-none">
      
      {/* Banner */}
      <section className="border-b-3 border-black dark:border-cream bg-yellow py-12 lg:py-16 text-black relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-black" />
            <h1 className="text-display text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase">
              GET IN TOUCH
            </h1>
          </div>
          <p className="font-extrabold text-sm sm:text-base max-w-xl mt-3 text-black/75">
            Have a project idea, question, or want to say hello? Drop a line in our mailbox. We reply to all non-spam messages in 24 hours.
          </p>
        </div>
      </section>

      {/* Main Grid Contact details + Form */}
      <section className="mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Info panel (5cols) */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="border-2 border-black bg-cream-dark p-6 rounded-md shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors">
                <h3 className="text-display text-xl uppercase text-black dark:text-cream mb-4 font-black">
                  Our Office
                </h3>
                <p className="font-bold text-sm text-black/75 dark:text-cream/75 leading-relaxed">
                  Chronica Editorial Rooms, Suite 404 <br />
                  10 Athens Philosophical Street <br />
                  Boston, MA 02108
                </p>
              </div>

              <div className="border-2 border-black bg-white p-6 rounded-md shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors">
                <h3 className="text-display text-xl uppercase text-black dark:text-cream mb-4 font-black">
                  Direct Emails
                </h3>
                <div className="flex flex-col gap-2 font-mono text-xs sm:text-sm font-bold">
                  <div>
                    <span className="text-black/50 dark:text-cream/50">GENERAL: </span>
                    <a href="mailto:hello@chronica.org" className="text-electric-blue hover:underline">
                      hello@chronica.org
                    </a>
                  </div>
                  <div>
                    <span className="text-black/50 dark:text-cream/50">EDITORS: </span>
                    <a href="mailto:editorial@chronica.org" className="text-electric-blue hover:underline">
                      editorial@chronica.org
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form panel (7cols) */}
            <div className="md:col-span-7">
              <div className="border-3 border-black bg-white p-6 sm:p-8 rounded-md shadow-[6px_6px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[6px_6px_0px_#FFFBF0] transition-colors">
                {!success ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                      <label className="block font-mono text-xs font-black uppercase text-black/50 dark:text-cream/50 mb-2">
                        Your Full Name
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-black uppercase text-black/50 dark:text-cream/50 mb-2">
                        Your Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-black uppercase text-black/50 dark:text-cream/50 mb-2">
                        Subject Title
                      </label>
                      <Input
                        type="text"
                        placeholder="Collaboration idea, sponsorship..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-black uppercase text-black/50 dark:text-cream/50 mb-2">
                        Your Message Details
                      </label>
                      <textarea
                        placeholder="Type your questions or details here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-white text-black font-semibold border-2 border-black rounded-md shadow-[2px_2px_0px_#0A0A0A] placeholder-black/50 transition-all focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_#0A0A0A] dark:bg-dark-surface-2 dark:text-cream dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] dark:placeholder-cream/50 dark:focus:shadow-[4px_4px_0px_#FFFBF0] text-sm"
                      />
                    </div>

                    <Button type="submit" variant="neon" size="lg" className="w-full flex items-center justify-center gap-2 mt-2">
                      <span>Send Message</span>
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center border-2 border-black bg-neon-green text-black shadow-[3px_3px_0px_#0A0A0A] rounded-full mb-6">
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="text-display text-2xl uppercase text-black dark:text-cream">
                      Message Sent!
                    </h3>
                    <p className="font-bold text-black/60 dark:text-cream/60 text-sm max-w-xs mx-auto mt-2 leading-relaxed">
                      Thank you <span className="text-electric-blue">{name}</span>. We successfully received your message and will reply soon.
                    </p>
                    <div className="flex items-center gap-1 mt-6 text-xs font-mono font-black text-black/40">
                      <Sparkles className="h-4 w-4 text-yellow animate-spin-slow" />
                      <span>SECURE PROTOCOL TRANSMISSION ACTIVE</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
