import { CTA, Features, Footer, Header, Hero } from "@/landing/components";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
