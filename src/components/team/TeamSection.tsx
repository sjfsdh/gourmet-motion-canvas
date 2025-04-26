
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import StaggeredItems from '@/components/animations/StaggeredItems';
import TeamMemberCard from './TeamMemberCard';

// Team members data
const teamMembers = [
  {
    id: 1,
    name: 'Emily Chen',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'With over 15 years of experience in fine dining, Emily brings creative vision and technical excellence to our menu.'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Restaurant Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Marcus ensures that every guest receives exceptional service and leaves with unforgettable memories.'
  },
  {
    id: 3,
    name: 'Sophia Patel',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Sophia\'s innovative desserts combine traditional techniques with modern flavors for a perfect finale to every meal.'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    role: 'Sommelier',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'David\'s expertise in wine pairing elevates our dining experience with perfect complementary selections.'
  }
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <AnimatedSection animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-restaurant-terracotta mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our talented team brings together diverse culinary backgrounds and a shared passion 
              for creating extraordinary dining experiences.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StaggeredItems animation="fadeIn">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} {...member} />
            ))}
          </StaggeredItems>
        </div>
        
        <AnimatedSection animation="fadeIn" delay={0.6}>
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Team</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              We're always looking for talented individuals who are passionate about food and 
              hospitality to join our growing team.
            </p>
            <motion.a
              href="/careers"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-restaurant-green text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Open Positions
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TeamSection;
