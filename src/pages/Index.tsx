
import AnimatedSection from '@/components/animations/AnimatedSection';
import StaggeredItems from '@/components/animations/StaggeredItems';
import HeroBanner from '@/components/HeroBanner';
import FeatureCard from '@/components/FeatureCard';
import NewsletterSignup from '@/components/NewsletterSignup';
import { Clock, MapPin, Phone } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Clock,
      title: "Fast Service",
      description: "Quick and efficient service without compromising on quality"
    },
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Conveniently located in the heart of the city"
    },
    {
      icon: Phone,
      title: "Easy Ordering",
      description: "Order online or call us for takeout and delivery"
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroBanner />
      
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <AnimatedSection animation="fadeInUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Choose DistinctGyrro?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We combine traditional recipes with modern techniques to create
                unforgettable dining experiences.
              </p>
            </div>
          </AnimatedSection>

          <StaggeredItems>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </StaggeredItems>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-2xl">
          <AnimatedSection animation="fadeInUp">
            <NewsletterSignup />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
