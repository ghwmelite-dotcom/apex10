import { Github, Twitter, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border-default bg-bg-secondary/50"
      style={{
        // Prevent layout shift from font loading
        contain: "layout style",
        // Reserve minimum height to prevent CLS
        minHeight: "280px",
      }}
    >
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-xrp-cyan to-xrp-teal flex items-center justify-center">
                <span className="text-bg-primary font-bold text-sm">A10</span>
              </div>
              <span className="font-bold text-xl text-text-primary">Apex10</span>
            </div>
            <p className="text-text-muted text-sm max-w-md">
              Deep XRP analytics and intelligence for serious holders.
              Plus coverage of 9 essential cryptocurrencies with security-first education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/xrp" className="text-xrp-cyan hover:text-xrp-teal transition-colors text-sm font-medium">
                  XRP Hub
                </a>
              </li>
              <li>
                <a href="/rankings" className="text-text-muted hover:text-accent-primary transition-colors text-sm">
                  Top 10 Rankings
                </a>
              </li>
              <li>
                <a href="/security" className="text-text-muted hover:text-accent-primary transition-colors text-sm">
                  Security Hub
                </a>
              </li>
              <li>
                <a href="/learn" className="text-text-muted hover:text-accent-primary transition-colors text-sm">
                  Learn Center
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="/security#checklist" className="text-text-muted hover:text-accent-primary transition-colors text-sm">
                  Security Checklist
                </a>
              </li>
              <li>
                <a href="/learn#wallets" className="text-text-muted hover:text-accent-primary transition-colors text-sm">
                  Wallet Guide
                </a>
              </li>
              <li>
                <a href="/" className="text-text-muted hover:text-accent-primary transition-colors text-sm">
                  Methodology
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border-default flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            &copy; {currentYear} Apex10. For educational purposes only. Not financial advice.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="Discord"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
