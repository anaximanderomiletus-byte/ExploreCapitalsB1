
import React, { useEffect } from 'react';
import { MessageSquare, Globe, Compass } from 'lucide-react';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

const Contact: React.FC = () => {
  const { setPageLoading } = useLayout();

  useEffect(() => {
    setPageLoading(false);
  }, [setPageLoading]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact ExploreCapitals",
    "description": "Get in touch with the team behind ExploreCapitals for technical feedback, institutional inquiries, or collaboration.",
    "url": "https://explorecapitals.com/contact"
  };

  return (
    <main className="pt-32 pb-20 px-6 bg-surface min-h-screen overflow-x-hidden">
      <SEO
        title="Contact Us"
        description="Have questions or feedback? Connect with the ExploreCapitals team. We welcome institutional inquiries and collaboration from the global geography community."
        structuredData={structuredData}
      />

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <MessageSquare size={12} /> Communication Hub
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-black text-text tracking-tighter mb-6">
             Get in <span className="text-primary">Touch.</span>
           </h1>
           <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
             Our architecture team is dedicated to building the most precise geography platform on the web. We value your feedback and inquiries.
           </p>
        </header>

        <section className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-premium border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
           <h2 className="text-2xl md:text-3xl font-display font-bold text-text mb-6 tracking-tight">Direct Outreach</h2>
           <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
             We'd love to hear from you. Feel free to shoot an email at <a href="mailto:anaximanderomiletus@gmail.com" className="text-primary font-bold whitespace-nowrap hover:underline underline-offset-4 transition-all text-[min(4.2vw,1.25rem)] sm:text-xl md:text-2xl">anaximanderomiletus@gmail.com</a>
           </p>
        </section>

        {/* Categories Section */}
        <section className="mt-16 grid sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
           {[
             { title: "Collaborations", icon: <Globe size={20} />, text: "Educational institutions seeking integration." },
             { title: "Technical Support", icon: <Compass size={20} />, text: "Reporting interface anomalies or map errors." },
             { title: "Media & Press", icon: <MessageSquare size={20} />, text: "Interviews or project feature requests." },
           ].map((cat, i) => (
             <div key={i} className="p-6 bg-white/40 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 group">
                <div className="text-primary mb-3 group-hover:scale-110 transition-transform origin-left">{cat.icon}</div>
                <h4 className="font-display font-bold text-text mb-2 text-sm">{cat.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{cat.text}</p>
             </div>
           ))}
        </section>
      </div>
    </main>
  );
};

export default Contact;
