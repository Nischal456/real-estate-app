import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        {/* We will add more sections like "Why Choose Us" here later */}
      </main>
      <Footer />
    </div>
  );
}
