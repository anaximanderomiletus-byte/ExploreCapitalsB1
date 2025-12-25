
import React, { useEffect } from 'react';
import { Target, Award, Compass, ShieldCheck, Microscope, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

const About: React.FC = () => {
  const { setPageLoading } = useLayout();
  const { hash } = useLocation();

  useEffect(() => {
    setPageLoading(false);
    
    if (hash === '#contact') {
      const element = document.getElementById('contact');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [setPageLoading, hash]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ExploreCapitals",
    "url": "https://explorecapitals.com",
    "description": "ExploreCapitals is a premier digital atlas and geography education platform designed to help learners master world capitals, national demographics, and global cartography through interactive high-fidelity mapping.",
    "foundingDate": "2024",
    "knowsAbout": ["Geography", "World Capitals", "Cartography", "Global Education"]
  };

  return (
    <main className="pt-32 pb-20 px-4 md:px-6 bg-surface min-h-screen overflow-x-hidden">
      <SEO
        title="About Our World Geography Platform"
        description="Learn about the mission of ExploreCapitals and connect with our team. We bridge the gap between institutional data and modern interactive education."
        structuredData={structuredData}
      />

      <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
        {/* Mission & Hero Section */}
        <section className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-20">
            <header className="max-w-3xl mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8">
                <Compass size={12} className="animate-spin-slow" /> A New Era of Global Literacy
              </div>
              <h1 className="text-4xl md:text-7xl font-display font-black text-text leading-[1.05] mb-6 md:mb-8 tracking-tighter">
                Redefining the <span className="text-primary">Digital Atlas.</span>
              </h1>
              <p className="text-lg md:text-2xl text-gray-500 leading-relaxed font-medium">
                ExploreCapitals is more than a reference tool; it is a high-fidelity gateway to understanding our planet. We synthesize institutional geographical data with advanced interface design.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start mb-16 md:mb-20">
              <div className="space-y-6 md:space-y-8 text-gray-600 leading-relaxed text-base md:text-lg">
                <h2 className="text-2xl font-display font-bold text-text tracking-tight">Our Mission</h2>
                <p>
                  We recognized that most geography learning tools either lacked technical depth or sacrificed user engagement. Our platform bridges this gap, providing a premium environment for mastering <strong>world capitals</strong> and <strong>geopolitical contexts</strong>.
                </p>
                <p>
                  By leveraging <strong>high-fidelity interactive maps</strong> and <strong>procedural virtual tours</strong>, we provide a multi-sensory approach to learning that moves beyond simple memorization into true spatial understanding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Target size={24} />, title: "Precision", text: "Curated statistics for 195 nations, ensuring educational authority." },
                  { icon: <ShieldCheck size={24} />, title: "Quality", text: "Institutional aesthetics respecting complex global information." },
                  { icon: <Microscope size={24} />, title: "Cognitive", text: "Gamified learning loops optimized for knowledge retention." },
                  { icon: <Award size={24} />, title: "Standard", text: "Setting a new benchmark for high-performance geography platforms." },
                ].map((item, i) => (
                  <article key={i} className="bg-surface/40 p-5 md:p-6 rounded-3xl border border-secondary/20 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="text-primary mb-4">{item.icon}</div>
                    <h3 className="font-display font-bold text-text text-base mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Section Divider */}
            <div className="border-t border-gray-100 my-16 md:my-20"></div>

            {/* Contact Section */}
            <div id="contact" className="scroll-mt-24 md:scroll-mt-32">
              <h2 className="text-3xl md:text-4xl font-display font-black text-text tracking-tight mb-4">Connect With Us</h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                Have questions, institutional inquiries, or technical feedback? Feel free to shoot an email at <a href="mailto:anaximanderomiletus@gmail.com" className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/30 transition-all">anaximanderomiletus@gmail.com</a>.
              </p>

              {/* Institutional Protocols */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <div className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 flex flex-col items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-6 transition-all duration-300">
                    <ShieldCheck size={26} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Privacy Protocol</h4>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">
                      Communication is handled with institutional-grade privacy. Your correspondence data is encrypted and never shared with third parties.
                    </p>
                  </div>
                </div>
                
                <div className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 flex flex-col items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent group-hover:-rotate-6 transition-all duration-300">
                    <Clock size={26} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Response Threshold</h4>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">
                      Our lead architects typically review and respond to institutional inquiries within a strict 24-48 business hour window.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner - Expedition Call to Action */}
          <section className="bg-primary p-10 md:p-20 text-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
             
             <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-5xl font-display font-black mb-8 md:mb-10 tracking-tight">Begin Your Path to Global Mastery</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                    <Link to="/map" title="View Interactive World Map" className="flex">
                      <Button variant="secondary" size="lg" className="h-14 md:h-16 px-8 md:px-14 text-base md:text-xl w-full">
                        Launch Map
                      </Button>
                    </Link>
                    <Link to="/games" title="Play Geography Quizzes" className="flex">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-14 md:h-16 px-6 md:px-14 text-base md:text-xl !border-white !text-white shadow-[0_4px_0_rgba(255,255,255,0.4)] hover:bg-white/10 active:shadow-none active:translate-y-[4px] w-full flex items-center justify-center whitespace-nowrap"
                      >
                        Start World Quizzes <Compass size={20} className="ml-2 shrink-0" />
                      </Button>
                    </Link>
                </div>
             </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default About;
