import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer
      className={cn(
        "w-screen -mx-[calc(50vw-50%)] bg-green-950/50 backdrop-blur-sm text-foreground py-8 border-t border-border",
        "dark:bg-blue-950/95 dark:text-foreground"
      )}
    >
      <div className="w-full px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary">Air Clothing Line</h3>
            <p className="mt-2 text-sm text-muted-foreground text-white">
              Discover amazing products and deals with us. Your one-stop shop for
              quality and value.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-bold text-primary">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground text-white">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-primary transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media/Contact */}
          <div>
            <h3 className="text-lg font-bold text-primary">Connect With Us</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground text-white">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-4 text-white">
          &copy; {new Date().getFullYear()} ACL. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
