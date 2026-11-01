import React from "react";
import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { getSiteAuthor } from "@/lib/posts";
import { getSocialLinks, SocialLinks } from "../_components/SocialLinks";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message to the editor of Chronica.",
};

export default async function ContactPage() {
  const author = await getSiteAuthor();

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <section className="border-b-3 border-black bg-yellow py-12 lg:py-16 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-black" aria-hidden="true" />
            <h1 className="text-display text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase">Get in Touch</h1>
          </div>
          <p className="font-extrabold text-sm sm:text-base max-w-xl mt-3 text-black/75">
            Have a question, a correction, or an idea for a story? Send a message and it goes straight to the editor.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="border-2 border-black bg-cream-dark p-6 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
                <h2 className="text-display text-xl uppercase text-black mb-4 font-black">How it works</h2>
                <p className="font-bold text-sm text-black/75 leading-relaxed">
                  Messages are stored securely and read by {author?.name ?? "the editor"}. Please include an email address you can be reached at.
                </p>
              </div>

              {getSocialLinks(author?.social).length > 0 && (
                <div className="border-2 border-black bg-white p-6 rounded-md shadow-[4px_4px_0px_#0A0A0A]">
                  <h2 className="text-display text-xl uppercase text-black mb-4 font-black">Elsewhere</h2>
                  <SocialLinks social={author?.social} />
                </div>
              )}
            </div>

            <div className="md:col-span-7">
              <div className="border-3 border-black bg-white p-6 sm:p-8 rounded-md shadow-[6px_6px_0px_#0A0A0A]">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
