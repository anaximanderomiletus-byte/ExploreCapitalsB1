import React from 'react';
import Button from '../components/Button';
import SEO from '../components/SEO';

const About: React.FC = () => {
  // Structured Data (JSON-LD) for Organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ExploreCapitals",
    "url": "https://explorecapitals.com",
    "description": "A premium, gamified geography education platform.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/explorecapitals",
      "https://instagram.com/explorecapitals"
    ]
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-surface min-h-screen">
      <SEO
        title="About Us"
        description="ExploreCapitals is the premier geography education platform combining high-fidelity interactive maps, gamified learning, and curated cultural insights."
        structuredData={structuredData}
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-12 rounded-3xl shadow-premium border border-gray-100">
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-display font-bold text-text">About Us</h1>
            </header>
            
            <section className="prose prose-lg text-gray-600 mb-12">
              <p className="mb-6">
                ExploreCapitals began with a simple mission: to make geography education as compelling as the world it describes. In an era of digital noise, we believe that learning should be an experience of clarity, beauty, and discovery.
              </p>
              <p className="mb-6">
                Our platform synthesizes high-fidelity cartography with cognitive science principles. We don't just list facts; we build context. By using a premium design language, we signal to our learners—students and professionals alike—that their educational journey is valuable.
              </p>
              <p>
                Founded in 2024, we are dedicated to mapping the world for the next generation of global citizens.
              </p>
            </section>

            <hr className="border-gray-100 my-10" />

            <section>
              <h2 className="text-2xl font-display font-bold text-text mb-6">Press & Media</h2>
              <p className="text-gray-500 mb-8">
                Writing a story about the future of EdTech? We'd love to help. Download our brand assets and fact sheet below.
              </p>
              
              <div className="flex gap-4">
                <Button variant="outline" className="hover:translate-y-0 active:translate-y-0">Download Media Kit</Button>
                <Button variant="primary">Contact Press Team</Button>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
};

export default About;