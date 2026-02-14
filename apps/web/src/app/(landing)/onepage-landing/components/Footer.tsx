import { LuFacebook, LuLinkedin } from "react-icons/lu";

type FooterProps = {
  data?: {
    footerText?: string;
    socialLinks?: {
      linkedin?: string;
      facebook?: string;
    };
  };
};

const Footer = ({ data }: FooterProps) => {
  return (
    <footer className="relative pt-20 pb-12 bg-default-800 dark:bg-default-900 min-h-[200px]">
      <div className="container">

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Texto */}
          <div className="text-default-400 text-sm text-center md:text-left">
            {data?.footerText || "© Borderlink"}
          </div>

          {/* Redes */}
          <div className="flex gap-4">
            {data?.socialLinks?.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 btn border border-default-400/40 bg-transparent rounded-full text-default-400 hover:text-primary flex items-center justify-center"
              >
                <LuLinkedin className="size-4" />
              </a>
            )}

            {data?.socialLinks?.facebook && (
              <a
                href={data.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 btn border border-default-400/40 bg-transparent rounded-full text-default-400 hover:text-primary flex items-center justify-center"
              >
                <LuFacebook className="size-4" />
              </a>
            )}
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
