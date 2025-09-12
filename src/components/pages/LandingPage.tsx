import React, { useEffect, useState } from 'react'
import { 
  ArrowRight, 
  Zap, 
  Target, 
  Sparkles, 
  Rocket, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  CheckCircle,
  Star,
  Play,
  ChevronDown,
  Globe,
  Briefcase,
  Award,
  Heart,
  Brain,
  Lightbulb,
  Menu,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Github,
  Send,
  ExternalLink,
  FileText,
  HelpCircle,
  MessageCircle,
  Calendar,
  DollarSign,
  UserCheck,
  Settings,
  Bell,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Matching",
      description: "Advanced algorithms match you with the perfect job opportunities",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Applications",
      description: "Automated job applications that adapt to each position",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Apply to hundreds of jobs in minutes, not hours",
      color: "from-emerald-400 to-emerald-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Smart Resume",
      description: "AI-generated resumes tailored for each application",
      color: "from-indigo-400 to-emerald-500"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Real-time Analytics",
      description: "Track your application success and optimize your approach",
      color: "from-red-400 to-emerald-500"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "TechCorp",
      content: "This platform changed my job search completely. I went from 0 interviews to 5 offers in just 2 weeks!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "The AI matching is incredible. It found opportunities I never would have discovered on my own.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "DesignStudio",
      content: "Finally, a tool that understands the modern job market. The automation saves me hours every day.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ]

  const stats = [
    { number: "10,000+", label: "Jobs Applied", icon: <Briefcase className="h-6 w-6" /> },
    { number: "95%", label: "Success Rate", icon: <Award className="h-6 w-6" /> },
    { number: "2.5x", label: "Faster Applications", icon: <Clock className="h-6 w-6" /> },
    { number: "50+", label: "Companies", icon: <Globe className="h-6 w-6" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Particle System */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Mouse Follower */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-r from-emerald-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
          }}
        />
      </div>

      {/* Header Section */}
      <header className="relative z-20 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SwiftApply.ai</h1>
                <p className="text-sm text-gray-300">Automated Job Application</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-white/80 hover:text-white font-medium transition-colors duration-300"
              >
                Features
              </a>
              <a
                href="#services"
                className="text-white/80 hover:text-white font-medium transition-colors duration-300"
              >
                Services
              </a>
              <a
                href="#testimonials"
                className="text-white/80 hover:text-white font-medium transition-colors duration-300"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-white/80 hover:text-white font-medium transition-colors duration-300"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-white/80 hover:text-white font-medium transition-colors duration-300"
              >
                About Us
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                  <button className="text-white/80 hover:text-white font-medium transition-colors duration-300">
                    Sign In
                  </button>
                </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white/80 hover:text-white transition-colors duration-300">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Heading */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-200 bg-clip-text text-transparent animate-pulse">
                Land Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-emerald-300 to-emerald-300 bg-clip-text text-transparent">
                with SwiftApply.ai
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              SwiftApply.ai is the AI-powered job application platform that finds, applies, and lands you the perfect position in record time.
              <span className="block mt-4 text-lg text-emerald-300">
                Stop searching. Start succeeding with SwiftApply.ai.
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/dashboard"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-bold text-lg rounded-full overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25"
              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <button className="group flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm group-hover:text-white transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="h-8 w-8 text-white/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-400 bg-clip-text text-transparent"> SwiftApply.ai</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of job searching with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-900/20 to-emerald-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful job seekers who found their dream careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300 italic">
                  "{testimonial.content}"
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Comprehensive
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-400 bg-clip-text text-transparent"> Services</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              End-to-end job search solutions powered by cutting-edge AI technology. From initial job discovery to final interview success, 
              we provide every tool and service you need to land your dream job.
            </p>
          </div>

          {/* Service Process Flow */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-white text-center mb-12">Our 6-Step Success Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Profile Analysis</h4>
                <p className="text-gray-300 text-sm">AI analyzes your skills, experience, and career goals</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Job Matching</h4>
                <p className="text-gray-300 text-sm">Smart algorithms find perfect job opportunities</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Resume Optimization</h4>
                <p className="text-gray-300 text-sm">Create ATS-optimized resumes for each application</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Auto Application</h4>
                <p className="text-gray-300 text-sm">Automatically apply to hundreds of jobs</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">5</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Interview Prep</h4>
                <p className="text-gray-300 text-sm">Practice with mock interviews and AI coaching</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">6</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Success Tracking</h4>
                <p className="text-gray-300 text-sm">Monitor progress and optimize your strategy</p>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* AI Job Matching */}
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                AI Job Matching
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300 mb-6">
                Our advanced AI analyzes job requirements and matches them with your skills, experience, and preferences for optimal job recommendations.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Core Features</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Smart skill analysis & gap identification
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Personalized job recommendations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Real-time market insights & trends
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Compatibility scoring (0-100%)
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Advanced Capabilities</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li>• Salary range predictions</li>
                    <li>• Company culture matching</li>
                    <li>• Location preference optimization</li>
                    <li>• Career progression mapping</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <p className="text-blue-300 text-sm font-semibold mb-1">Success Rate</p>
                <p className="text-white text-lg font-bold">94% Match Accuracy</p>
              </div>
            </div>

            {/* Automated Applications */}
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                Automated Applications
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300 mb-6">
                Apply to hundreds of jobs automatically with our intelligent application system that adapts to each company's requirements.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Application Features</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Bulk job applications (up to 500/day)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Customized cover letter generation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Intelligent form auto-filling
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Real-time application tracking
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Smart Automation</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li>• ATS-friendly formatting</li>
                    <li>• Keyword optimization per job</li>
                    <li>• Application timing optimization</li>
                    <li>• Duplicate detection & prevention</li>
                  </ul>
                </div>
              </div>

              <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                <p className="text-emerald-300 text-sm font-semibold mb-1">Efficiency</p>
                <p className="text-white text-lg font-bold">10x Faster Applications</p>
              </div>
            </div>

            {/* Smart Resume Builder */}
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                Smart Resume Builder
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300 mb-6">
                Create professional, ATS-optimized resumes tailored to specific job requirements using our AI-powered resume builder.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Resume Features</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      ATS optimization (99% pass rate)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      25+ professional templates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Keyword optimization suggestions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Multiple format exports (PDF, DOCX, TXT)
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Tools</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li>• Content generation & suggestions</li>
                    <li>• Skills gap analysis</li>
                    <li>• Achievement quantification</li>
                    <li>• Industry-specific optimization</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                <p className="text-green-300 text-sm font-semibold mb-1">ATS Score</p>
                <p className="text-white text-lg font-bold">95+ Average Rating</p>
              </div>
            </div>

            {/* Interview Preparation */}
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                Interview Preparation
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300 mb-6">
                Get ready for interviews with our comprehensive preparation tools including mock interviews and question banks.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Practice Tools</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      AI-powered mock interviews
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      10,000+ question database
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Real-time answer suggestions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Confidence building exercises
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Advanced Features</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li>• Industry-specific questions</li>
                    <li>• Behavioral interview prep</li>
                    <li>• Technical skill assessments</li>
                    <li>• Video interview practice</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                <p className="text-orange-300 text-sm font-semibold mb-1">Success Rate</p>
                <p className="text-white text-lg font-bold">87% Interview Pass Rate</p>
              </div>
            </div>

            {/* Career Analytics */}
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                Career Analytics
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300 mb-6">
                Track your job search progress with detailed analytics and insights to optimize your application strategy.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Analytics Dashboard</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Real-time application tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Success metrics & KPIs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Market trend analysis
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Performance insights & recommendations
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Reports & Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li>• Weekly progress reports</li>
                    <li>• Salary benchmarking</li>
                    <li>• Industry comparison</li>
                    <li>• Skill demand analysis</li>
                  </ul>
                </div>
              </div>

              <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
                <p className="text-indigo-300 text-sm font-semibold mb-1">Data Points</p>
                <p className="text-white text-lg font-bold">50+ Metrics Tracked</p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                24/7 Support
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300 mb-6">
                Get help whenever you need it with our dedicated support team and comprehensive knowledge base.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Support Channels</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Live chat support (24/7)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Email assistance (2h response)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Video call consultations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      Community forum & peer support
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Learning Resources</h4>
                  <ul className="space-y-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <li>• 200+ video tutorials</li>
                    <li>• Interactive guides</li>
                    <li>• Best practices library</li>
                    <li>• Career coaching sessions</li>
                  </ul>
                </div>
              </div>

              <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-500/20">
                <p className="text-teal-300 text-sm font-semibold mb-1">Response Time</p>
                <p className="text-white text-lg font-bold">&lt; 2 Minutes</p>
              </div>
            </div>
          </div>

          {/* Service Comparison Table */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-white text-center mb-12">Service Comparison</h3>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white font-semibold py-4 px-4">Service</th>
                    <th className="text-center text-white font-semibold py-4 px-4">Starter</th>
                    <th className="text-center text-white font-semibold py-4 px-4">Professional</th>
                    <th className="text-center text-white font-semibold py-4 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  <tr className="border-b border-white/5">
                    <td className="text-gray-300 py-4 px-4">AI Job Matching</td>
                    <td className="text-center text-green-400 py-4 px-4">✓ Basic</td>
                    <td className="text-center text-green-400 py-4 px-4">✓ Advanced</td>
                    <td className="text-center text-green-400 py-4 px-4">✓ Premium</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="text-gray-300 py-4 px-4">Automated Applications</td>
                    <td className="text-center text-gray-400 py-4 px-4">10/month</td>
                    <td className="text-center text-green-400 py-4 px-4">Unlimited</td>
                    <td className="text-center text-green-400 py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="text-gray-300 py-4 px-4">Resume Templates</td>
                    <td className="text-center text-gray-400 py-4 px-4">3 Basic</td>
                    <td className="text-center text-green-400 py-4 px-4">25+ Premium</td>
                    <td className="text-center text-green-400 py-4 px-4">50+ Custom</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="text-gray-300 py-4 px-4">Interview Prep</td>
                    <td className="text-center text-gray-400 py-4 px-4">Basic</td>
                    <td className="text-center text-green-400 py-4 px-4">Full Access</td>
                    <td className="text-center text-green-400 py-4 px-4">Full + Coaching</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="text-gray-300 py-4 px-4">Analytics Dashboard</td>
                    <td className="text-center text-gray-400 py-4 px-4">Basic</td>
                    <td className="text-center text-green-400 py-4 px-4">Advanced</td>
                    <td className="text-center text-green-400 py-4 px-4">Enterprise</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 py-4 px-4">Support Level</td>
                    <td className="text-center text-gray-400 py-4 px-4">Email (48h)</td>
                    <td className="text-center text-green-400 py-4 px-4">Live Chat (24h)</td>
                    <td className="text-center text-green-400 py-4 px-4">Dedicated Manager</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-full mb-8">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Why Choose Our Services?
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Our comprehensive suite of services is designed to give you the competitive edge in today's job market. 
              From AI-powered matching to personalized support, we're here to accelerate your career success.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">95%</div>
                <div className="text-gray-300">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">10x</div>
                <div className="text-gray-300">Faster Applications</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">50k+</div>
                <div className="text-gray-300">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
                <div className="text-gray-300">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-900/20 to-emerald-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-400 bg-clip-text text-transparent"> SwiftApply.ai</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing the job search process with cutting-edge AI technology and a passion for helping people succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                AI-Powered
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Our advanced AI algorithms analyze job requirements and match them with your skills and preferences for optimal results.
              </p>
            </div>

            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                Community Driven
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Join thousands of successful job seekers who have found their dream careers through our platform.
              </p>
            </div>

            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                Secure & Private
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Your data is protected with enterprise-grade security. We never share your personal information.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-full mb-8">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Our Mission
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To democratize job opportunities by making the application process faster, smarter, and more accessible. 
              We believe everyone deserves to find their perfect career match, and we're here to make that happen.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple, Transparent
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-400 bg-clip-text text-transparent"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Transparent pricing with no hidden fees. Choose the perfect plan for your job search journey. 
              All plans include our core AI-powered features with varying levels of access and support.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-full transition-all duration-300">
                Monthly
              </button>
              <button className="px-6 py-2 text-white/70 font-semibold rounded-full hover:text-white transition-colors duration-300">
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Free Plan */}
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <div className="text-4xl font-bold text-white mb-2">$0</div>
                <p className="text-gray-400 mb-4">Perfect for testing the waters</p>
                <div className="text-sm text-gray-500">No credit card required</div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Job Applications</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Up to 10 applications per month</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Basic job matching algorithm</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Manual application tracking</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Resume Tools</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">3 basic resume templates</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Basic ATS optimization</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">PDF download</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Support</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Email support (48h response)</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Help center access</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button className="w-full py-3 px-6 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="group relative p-8 bg-gradient-to-r from-emerald-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-2xl mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-400 mb-4">For serious job seekers</p>
                <div className="text-sm text-emerald-300">14-day free trial</div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Job Applications</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Unlimited applications</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Advanced AI job matching</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Automated application tracking</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Custom cover letter generation</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Application analytics dashboard</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Resume & Documents</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">15+ premium resume templates</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Advanced ATS optimization</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Keyword optimization suggestions</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Multiple format exports (PDF, DOCX)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Interview & Prep</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Mock interview practice</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Interview question database</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Answer suggestion AI</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Support & Analytics</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Priority email support (24h response)</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Live chat support</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Detailed success analytics</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Market trend insights</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
                Start Pro Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-white">$99</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-400 mb-4">For teams and organizations</p>
                <div className="text-sm text-orange-300">Custom pricing available</div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Everything in Pro +</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Team collaboration tools</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Unlimited team members</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Centralized dashboard</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Custom branding options</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Advanced Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Custom integrations (API access)</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Advanced analytics & reporting</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">White-label solutions</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Custom job board integrations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Premium Support</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Dedicated account manager</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">24/7 phone & chat support</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Priority feature requests</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">Custom training sessions</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button className="w-full py-3 px-6 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
                Contact Sales
              </button>
            </div>
          </div>

          {/* Additional Pricing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h4>
                  <p className="text-gray-300 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h4>
                  <p className="text-gray-300 text-sm">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Is there a money-back guarantee?</h4>
                  <p className="text-gray-300 text-sm">Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment in full.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Special Offers</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-600/20 rounded-lg p-4 border border-emerald-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">Student Discount</h4>
                  <p className="text-gray-300 text-sm mb-2">Get 50% off Pro plan with valid student ID</p>
                  <span className="text-emerald-300 text-sm font-semibold">Valid for 4 years</span>
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-4 border border-green-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">Annual Subscription</h4>
                  <p className="text-gray-300 text-sm mb-2">Save 20% when you pay annually</p>
                  <span className="text-green-300 text-sm font-semibold">Best value option</span>
                </div>
                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-4 border border-orange-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">Referral Program</h4>
                  <p className="text-gray-300 text-sm mb-2">Get 1 month free for each successful referral</p>
                  <span className="text-orange-300 text-sm font-semibold">Unlimited referrals</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-600/10 to-emerald-600/10 rounded-2xl p-8 border border-emerald-400/20">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of successful job seekers who have found their dream careers with SwiftApply.ai. 
                Start your free trial today - no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Start Free Trial
                </Link>
                <button className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
                  Schedule Demo
                </button>
              </div>
            </div>
            
            <div className="mt-12">
              <p className="text-gray-400 mb-4">
                All plans include our core AI-powered features. Cancel anytime with no penalties.
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
                <span>✓ 14-day free trial</span>
                <span>✓ Cancel anytime</span>
                <span>✓ 30-day money back guarantee</span>
                <span>✓ 24/7 support</span>
                <span>✓ Secure payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-slate-900/50 to-emerald-900/30 border-t border-white/10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">SwiftApply.ai</h3>
                  <p className="text-sm text-emerald-300">AI-Powered Job Search</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Revolutionizing job searching with cutting-edge AI technology. 
                We help thousands of professionals land their dream careers faster and smarter.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">support@swiftapply.ai</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/resumeGenerator" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link href="/jobSearch" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Job Search
                  </Link>
                </li>
                <li>
                  <Link href="/applications" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    My Applications
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <FileText className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <MessageCircle className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Community Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <Calendar className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <BookOpen className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 flex items-center group">
                    <UserCheck className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Stay Updated</h4>
              <p className="text-gray-300 text-sm mb-4">
                Get the latest job search tips, industry insights, and platform updates delivered to your inbox.
              </p>
              
              {/* Newsletter Signup */}
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors duration-300"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white rounded-r-lg hover:from-emerald-700 hover:to-emerald-700 transition-all duration-300 flex items-center">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Join 50,000+ job seekers. Unsubscribe anytime.
                </p>
              </div>

              {/* Social Media */}
              <div>
                <h5 className="text-sm font-semibold text-white mb-3">Follow Us</h5>
                <div className="flex space-x-3">
                  <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-300 group">
                    <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-300 group">
                    <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-300 group">
                    <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-300 group">
                    <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-300 group">
                    <Youtube className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Footer Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* Company Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-400" />
                Our Impact
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">50K+</div>
                  <div className="text-xs text-gray-400">Jobs Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">95%</div>
                  <div className="text-xs text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">2.5x</div>
                  <div className="text-xs text-gray-400">Faster Hiring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">24/7</div>
                  <div className="text-xs text-gray-400">AI Support</div>
                </div>
              </div>
            </div>

            {/* Trust & Security */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-400" />
                Trust & Security
              </h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  SOC 2 Type II Certified
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  GDPR Compliant
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  256-bit SSL Encryption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  Privacy-First Design
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-emerald-400" />
                Need Help?
              </h5>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-gray-300 hover:text-emerald-300 transition-colors duration-300">
                  📞 Live Chat Support
                </a>
                <a href="#" className="block text-sm text-gray-300 hover:text-emerald-300 transition-colors duration-300">
                  📧 Email Support
                </a>
                <a href="#" className="block text-sm text-gray-300 hover:text-emerald-300 transition-colors duration-300">
                  📚 Knowledge Base
                </a>
                <a href="#" className="block text-sm text-gray-300 hover:text-emerald-300 transition-colors duration-300">
                  🎥 Video Tutorials
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              
              {/* Copyright */}
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 SwiftApply.ai. All rights reserved. Made with ❤️ for job seekers worldwide.
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Cookie Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Accessibility
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Sitemap
                </a>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <div className="mb-2 md:mb-0">
                  SwiftApply.ai is powered by advanced AI technology and trusted by professionals worldwide.
                </div>
                <div className="flex items-center space-x-4">
                  <span>🌍 Available in 50+ countries</span>
                  <span>🔒 Enterprise-grade security</span>
                  <span>⚡ Lightning-fast performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
