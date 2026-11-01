import type { Author } from "@/lib/types";
import { Github, Linkedin, Twitter } from "./ui/Icons";

interface SocialLink {
  label: string;
  href: string;
  Icon: typeof Github;
  bg: string;
}

export function getSocialLinks(social: Author["social"] = {}): SocialLink[] {
  const links: SocialLink[] = [];
  if (social.github) {
    links.push({ label: "GitHub", href: `https://github.com/${social.github}`, Icon: Github, bg: "bg-neon-green text-black" });
  }
  if (social.twitter) {
    links.push({ label: "Twitter", href: `https://twitter.com/${social.twitter}`, Icon: Twitter, bg: "bg-electric-blue text-white" });
  }
  if (social.linkedin) {
    links.push({ label: "LinkedIn", href: `https://linkedin.com/in/${social.linkedin}`, Icon: Linkedin, bg: "bg-coral text-white" });
  }
  return links;
}

/** Icon buttons linking to the author's real profiles; renders nothing when none are set. */
export function SocialLinks({ social }: { social?: Author["social"] }) {
  const links = getSocialLinks(social);
  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {links.map(({ label, href, Icon, bg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`flex h-10 w-10 items-center justify-center border-2 border-black ${bg} hover:-translate-y-1 shadow-[2px_2px_0px_#000] transition-all`}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
