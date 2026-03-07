import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-surface border-border border-t px-6 py-16 lg:px-24">
    <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row">
      <div>
        <span className="font-display text-primary text-2xl tracking-widest">
          ⚡ BOB FITNESS
        </span>
        <p className="mt-3 max-w-xs text-sm text-gray-600">
          Premium fitness facility built for those who refuse to settle.
        </p>
      </div>

      <div className="flex gap-16">
        <div>
          <p className="font-display mb-4 text-sm tracking-widest text-white">
            NAVIGATE
          </p>
          <div className="flex flex-col gap-2">
            {[
              ["/", "Home"],
              ["/membership", "Membership"],
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

    <div className="border-border mx-auto mt-12 flex max-w-6xl items-center justify-between border-t pt-8">
      <p className="text-xs text-gray-600">
        © {new Date().getFullYear()} GymApp. All rights reserved.
      </p>
      <p className="text-xs text-gray-600">Built with MERN Stack</p>
    </div>
  </footer>
);

export default Footer;
