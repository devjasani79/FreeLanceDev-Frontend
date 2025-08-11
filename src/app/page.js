'use client';

import Link from 'next/link';
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  StarIcon,
  UsersIcon,
  BriefcaseIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Container from '@/components/layout/Container';

export default function Home() {
  const features = [
    {
      icon: BriefcaseIcon,
      title: 'Find Perfect Gigs',
      description: 'Browse thousands of freelance opportunities that match your skills and interests.'
    },
    {
      icon: UsersIcon,
      title: 'Connect with Clients',
      description: 'Build lasting relationships with clients and grow your freelance business.'
    },
    {
      icon: StarIcon,
      title: 'Build Your Reputation',
      description: 'Earn reviews and ratings to establish yourself as a trusted professional.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Scale Your Business',
      description: 'Take on more projects and increase your income with our platform.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Freelancers' },
    { number: '100K+', label: 'Completed Projects' },
    { number: '$10M+', label: 'Total Earnings' },
    { number: '95%', label: 'Client Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-accent py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <Container>
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Find the Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Freelance Opportunity
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed animate-slide-in-left">
              Connect with top clients, showcase your skills, and build a successful freelance career. 
              Whether you're a designer, developer, writer, or marketer, we have opportunities for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in-right">
              <Link 
                href="/auth/register" 
                className="btn btn-accent text-lg px-8 py-4 hover:scale-105 transition-transform"
              >
                Get Started Today
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/gigs" 
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
              >
                Browse Gigs
              </Link>
            </div>
          </div>
        </Container>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose FreelanceDev?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to help freelancers succeed and clients find the perfect match for their projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="card text-center hover-lift group animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <Container>
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Freelance Journey?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of successful freelancers who have found their dream projects on our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register?role=freelancer" 
                className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold"
              >
                Become a Freelancer
              </Link>
              <Link 
                href="/auth/register?role=client" 
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
              >
                Hire a Freelancer
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-neutral-100 dark:bg-neutral-800">
        <Container>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you succeed.
            </p>
            <Link 
              href="/contact" 
              className="btn btn-primary"
            >
              Contact Support
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
