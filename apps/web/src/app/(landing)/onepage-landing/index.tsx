import { useEffect, useState } from "react";
import PageMeta from "@/components/PageMeta";
import About from "./components/About";
import Contact from "./components/Contact";
import Feature from "./components/Feature";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

import { getLanding } from "./api.js"; // 👈 importante

type LandingType = {
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  features?: { title: string; description: string }[];
  contactTitle?: string;
  contactSubtitle?: string;
  privacyText?: string;
  footerText?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
  };
};

const Index = () => {
  const [landing, setLanding] = useState<LandingType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanding = async () => {
      try {
        const data = await getLanding();
        setLanding(data);
      } catch (err) {
        console.error("Error cargando landing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanding();
  }, []);

  if (loading) return null;
  if (!landing) return null;

  return (
    <>
      <PageMeta title="Borderlink" />
      <Navbar />
      <Hero data={landing} />
      <Feature data={landing} />
      <About data={landing} />
      <Contact data={landing} />
      <Footer data={landing} />
    </>
  );
};

export default Index;