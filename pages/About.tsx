
import React, { useEffect } from 'react';
import { Globe, Target, Award, Compass, ArrowRight, ShieldCheck, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

const About: React.FC = () => {
  const { setPageLoading } = useLayout();

  useEffect(() => {
    setPageLoading(false);
  }, [setPageLoading]);

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
    <main className="pt-32 pb-20 px-6 bg-surface min-h-screen">
      <SEO
        title="About Our World Geography Platform"
        description="Learn about the mission of ExploreCapitals: bridging the gap between institutional geographical data and modern interactive education to help you master world capitals and global geography."
        structuredData={structuredData}
      />

      <div className="max-w-5xl mx-auto">
        {/* Main Hero Card */}
        <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden mb-12">
          <div className="p-8 md:p-20">
            <header className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <Compass size={12} className="animate-spin-slow" /> A New Era of Global Literacy
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-text leading-[1.05] mb-8 tracking-tighter">
                Redefining the <span className="text-primary">Digital Atlas.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium">
                ExploreCapitals is more than a reference tool; it is a high-fidelity gateway to understanding our planet. We synthesize institutional geographical data with advanced interface design to foster global mastery.
              </p>
            </header>

            <section className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
                <h2 className="text-2xl font-display font-bold text-text tracking-tight">Our Mission in Geography Education</h2>
                <p>
                  We recognized that most geography learning tools either lacked technical depth or sacrificed user engagement. Our platform bridges this gap, providing a premium environment for mastering <strong>world capitals</strong>, <strong>national demographics</strong>, and <strong>geopolitical contexts</strong>.
                </p>
                <p>
                  By leveraging <strong>high-fidelity interactive maps</strong> and <strong>procedural virtual tours</strong>, we provide a multi-sensory approach to learning that moves beyond simple memorization into true spatial understanding.
                </p>
                <div className="pt-4">
                  <blockquote className="border-l-4 border-primary pl-6 italic text-text/80 text-xl font-display">
                    "Geography is the framework through which we understand our global future."
                  </blockquote>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { 
                    icon: <Target size={24} />, 
                    title: "Data Accuracy", 
                    text: "Curated statistics for 195 nations, ensuring educational authority and precision." 
                  },
                  { 
                    icon: <ShieldCheck size={24} />, 
                    title: "Institutional Quality", 
                    text: "Premium aesthetics that respect the complexity of global information." 
                  },
                  { 
                    icon: <Microscope size={24} />, 
                    title: "Cognitive Design", 
                    text: "Gamified learning loops optimized for long-term knowledge retention." 
                  },
                  { 
                    icon: <Award size={24} />, 
                    title: "Global Standard", 
                    text: "Setting a new benchmark for accessible, high-performance geography platforms." 
                  },
                ].map((item, i) => (
                  <article key={i} className="bg-surface/40 p-6 rounded-3xl border border-secondary/20 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="text-primary mb-4">{item.icon}</div>
                    <h3 className="font-display font-bold text-text text-base mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom Banner - Expedition Call to Action */}
          <section className="bg-primary p-12 md:p-20 text-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]"></div>
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-display font-black mb-10 tracking-tight">Begin Your Path to Global Mastery</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                    <Link to="/map" title="View Interactive World Map" className="flex">
                      <Button variant="secondary" size="lg" className="h-16 px-14 text-xl w-full">
                        Launch Map
                      </Button>
                    </Link>
                    <Link to="/games" title="Play Geography Quizzes" className="flex">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-16 px-14 text-xl !border-white !text-white shadow-[0_4px_0_rgba(255,255,255,0.4)] hover:bg-white/10 active:shadow-none active:translate-y-[4px] w-full"
                      >
                        Start World Quizzes <ArrowRight size={20} className="ml-2" />
                      </Button>
                    </Link>
                </div>
             </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default About;
