
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Users } from 'lucide-react';
import AnimatedSection from '@/components/animations/AnimatedSection';
import StaggeredItems from '@/components/animations/StaggeredItems';

// Team members data
const teamMembers = [
  {
    id: 1,
    name: 'Emily Chen',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: "With over 15 years of experience in fine dining, Emily brings creative vision and technical excellence to our menu."
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Restaurant Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: "Marcus ensures that every guest receives exceptional service and leaves with unforgettable memories."
  },
  {
    id: 3,
    name: 'Sophia Patel',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: "Sophia's innovative desserts combine traditional techniques with modern flavors for a perfect finale to every meal."
  },
  {
    id: 4,
    name: 'David Rodriguez',
    role: 'Sommelier',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: "David's expertise in wine pairing elevates our dining experience with perfect complementary selections."
  }
];

// Gallery images
const galleryImages = [
  'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
];

// Awards & Recognitions
const awards = [
  {
    id: 1,
    title: 'Best Fine Dining',
    organization: 'City Culinary Awards',
    year: '2023'
  },
  {
    id: 2,
    title: 'Michelin Star',
    organization: 'Michelin Guide',
    year: '2022-2023'
  },
  {
    id: 3,
    title: 'Sustainable Restaurant',
    organization: 'Green Dining Association',
    year: '2023'
  },
  {
    id: 4,
    title: 'Chef of the Year',
    organization: 'National Culinary Excellence',
    year: '2022'
  }
];

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="container-custom relative z-10 text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Our Story
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="h-1 w-24 bg-restaurant-terracotta my-4"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto"
          >
            From humble beginnings to culinary excellence
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slideInLeft">
              <img 
                src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Restaurant founding"
                className="rounded-lg shadow-lg"
              />
            </AnimatedSection>

            <AnimatedSection animation="slideInRight">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Journey</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2010 by award-winning chef Emily Chen, GourmetTable began as a small, intimate dining space with a vision to transform the local culinary scene. Emily's passion for seasonal ingredients and innovative cooking techniques quickly earned the restaurant recognition.
                </p>
                <p>
                  Over the years, we've grown from a team of just five passionate food enthusiasts to a full staff of culinary professionals dedicated to creating memorable dining experiences. Our commitment to quality, sustainability, and exceptional service has remained unwavering.
                </p>
                <p>
                  Today, GourmetTable stands as a testament to culinary excellence, bringing together the finest ingredients, expert craftsmanship, and warm hospitality to every guest who walks through our doors.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section-padding bg-restaurant-cream">
        <div className="container-custom">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Philosophy</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full">
                <div className="w-16 h-16 bg-restaurant-green/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Heart className="text-restaurant-green" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Our Mission</h3>
                <p className="text-gray-700 text-center">
                  To create exceptional dining experiences that celebrate seasonal ingredients and culinary craftsmanship while fostering meaningful connections around the table.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.4}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full">
                <div className="w-16 h-16 bg-restaurant-green/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="text-restaurant-green" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z" fill="currentColor" />
                    <path d="M19 12C15.13 12 12 15.13 12 19H5C5 15.13 8.13 12 12 12C15.87 12 19 8.87 19 5H12C12 8.87 8.87 12 5 12C8.87 12 12 15.13 12 19C12 15.13 15.13 12 19 12Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Our Vision</h3>
                <p className="text-gray-700 text-center">
                  To be a beacon of culinary innovation and hospitality excellence, inspiring a deeper appreciation for thoughtfully prepared food and creating lasting memories for our guests.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.6}>
              <div className="bg-white rounded-lg shadow-md p-8 h-full">
                <div className="w-16 h-16 bg-restaurant-green/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="text-restaurant-green" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">Our Values</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center"><span className="w-2 h-2 bg-restaurant-terracotta rounded-full mr-2"></span> Quality &amp; Excellence</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-restaurant-terracotta rounded-full mr-2"></span> Sustainability &amp; Responsibility</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-restaurant-terracotta rounded-full mr-2"></span> Creativity &amp; Innovation</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-restaurant-terracotta rounded-full mr-2"></span> Community &amp; Collaboration</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-restaurant-terracotta rounded-full mr-2"></span> Warm, Inclusive Hospitality</li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Meet Our Team</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Our talented team brings together diverse culinary backgrounds and a shared passion for creating extraordinary dining experiences.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StaggeredItems animation="fadeIn">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-restaurant-terracotta mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </StaggeredItems>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="section-padding bg-restaurant-green text-white">
        <div className="container-custom">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Awards & Recognition</h2>
            <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
              We're honored to be recognized for our commitment to culinary excellence and exceptional dining experiences.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award) => (
              <AnimatedSection key={award.id} animation="fadeIn" delay={award.id * 0.1}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col">
                  <div className="mb-4 text-restaurant-terracotta">
                    <Award size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                  <p className="text-white/80 mb-1">{award.organization}</p>
                  <p className="text-white/70 text-sm">{award.year}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Gallery</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Experience the ambiance, artistry, and culinary delights of GourmetTable.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <AnimatedSection key={index} animation="fadeIn" delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="rounded-lg overflow-hidden shadow-md aspect-[4/3]"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
