import { Link } from "react-router-dom";
import { Instagram, Youtube, Github } from "lucide-react";

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <Instagram size={18} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: <Youtube size={18} />,
  },
    {
    label: "Github",
    href: "https://github.com/sayordebbarma",
    icon: <Github size={18} />,
  }
];

const Footer = () => (
  <footer className="bg-surface border-border border-t px-6 py-16 lg:px-24">
    <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row">
      {/* Brand */}
      <div>
        <span className="font-display text-primary text-2xl tracking-widest">
          ⚡ BOB FITNESS
        </span>
        <p className="mt-3 max-w-xs text-sm text-gray-600">
          Premium fitness facility built for those who refuse to settle.
        </p>

        {/* Social icons */}
        <div className="mt-6 flex gap-3">
          {socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="border-border hover:border-primary hover:text-primary flex h-9 w-9 items-center justify-center border text-gray-500 transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* Nav links */}
      <div className="flex gap-16">
        <div>
          <p className="font-display mb-4 text-sm tracking-widest text-white">
            NAVIGATE
          </p>
          <div className="flex flex-col gap-2">
            {[
              ["/", "Home"],
              ["/membership", "Membership"],
              ["/leaderboard", "Leaderboard"],
              ["/contact", "Contact"],
              ["/login", "Login"],
              ["/register", "Join Now"],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="hover:text-primary text-sm text-gray-500 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-border mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
      <p className="text-xs text-gray-600">
        © {new Date().getFullYear()} Bob Fitness. All rights reserved.
      </p>
      <p className="text-xs text-gray-600">
        Design & Built by{" "}
        <a
          href="https://github.com/sayordebbarma"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary transition-colors hover:underline"
        >
          Sayor Debbarma
        </a>
      </p>
    </div>
  </footer>
);

export default Footer;
