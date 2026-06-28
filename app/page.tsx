import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRow from "@/components/StatsRow";
import About from "@/components/About";
import Solutions from "@/components/Solutions";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsRow />
        <About />
        <Solutions />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
