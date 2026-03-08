import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements AfterViewInit, OnDestroy {
  activeSection = signal('home');
  typedText = signal('');
  showCursor = signal(true);
  navOpen = signal(false);
  navScrolled = signal(false);
  scrollProgress = signal(0);
  mouseX = signal(0);
  mouseY = signal(0);
  loadingComplete = signal(false);
  loadingPercent = signal(0);

  private titles = ['Java Full Stack Developer', 'FinTech Backend Developer', 'Spring Boot Expert', 'Microservices Architect'];
  private titleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;
  private cursorInterval: ReturnType<typeof setInterval> | null = null;
  private observer: IntersectionObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private mouseHandler: ((e: MouseEvent) => void) | null = null;
  private loadingInterval: ReturnType<typeof setInterval> | null = null;

  techStack = [
    { name: 'Java 8', category: 'backend' },
    { name: 'Spring Boot', category: 'backend' },
    { name: 'Hibernate', category: 'backend' },
    { name: 'Spring Security', category: 'backend' },
    { name: 'Microservices', category: 'backend' },
    { name: 'REST APIs', category: 'backend' },
    { name: 'MySQL', category: 'database' },
    { name: 'MongoDB', category: 'database' },
    { name: 'Angular', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'HTML/CSS', category: 'frontend' },
    { name: 'Docker', category: 'devops' },
    { name: 'Kubernetes', category: 'devops' },
    { name: 'Jenkins', category: 'devops' },
    { name: 'AWS EC2', category: 'devops' },
    { name: 'AWS S3', category: 'devops' },
    { name: 'Git', category: 'devops' },
    { name: 'Maven', category: 'devops' },
    { name: 'JIRA', category: 'devops' },
    { name: 'Swagger', category: 'devops' },
  ];

  stats = [
    { value: '4+', label: 'Years Experience' },
    { value: '3', label: 'Major Projects' },
    { value: '10+', label: 'Modules Built' },
    { value: '3', label: 'Banking Clients' },
  ];

  projects = [
    {
      title: 'LendPerfect',
      subtitle: 'FinTech Loan Management Platform',
      duration: 'Current',
      description: 'Enterprise loan management platform for banks. Served Canara Bank, Union Bank of India, and Ujjivan Small Finance Bank.',
      tags: ['Java 8', 'Spring Boot', 'Spring Security', 'Hibernate', 'MySQL', 'CBS API'],
      icon: 'bank',
      highlight: true,
    },
    {
      title: 'Expedia',
      subtitle: 'Hotel Booking System',
      duration: '3.2 years',
      description: 'Hotel booking platform with property management, room booking, advanced search, reviews, and multi-channel notifications.',
      tags: ['Java', 'Spring Boot', 'MySQL', 'AWS S3', 'Angular 15'],
      icon: 'hotel',
      highlight: false,
    },
    {
      title: 'Bus Reservation',
      subtitle: 'Ticket Booking System',
      description: 'Bus reservation platform with real-time schedules, seat selection, route management, and fare calculations.',
      tags: ['Java', 'Spring Boot', 'Hibernate', 'REST API'],
      icon: 'bus',
      highlight: false,
    },
    {
      title: 'Car Rental',
      subtitle: 'Vehicle Rental Service',
      description: 'Car rental service with booking, availability management, dynamic pricing, and favorites.',
      tags: ['Java', 'Spring Boot', 'Microservices'],
      icon: 'car',
      highlight: false,
    },
  ];

  experiences = [
    {
      role: 'Java Backend Developer',
      company: 'Sysarc Informatix',
      project: 'LendPerfect - Loan Management Platform',
      duration: '4+ Years (Onsite ~1.3 Months)',
      current: true,
      subModules: [
        {
          name: 'Agriculture Loan Module',
          points: [
            'Developed end-to-end backend services for agriculture loan processing used by major banking institutions',
            'Implemented farmer onboarding workflows including KYC verification, Aadhaar validation, and document upload',
            'Built land details verification module with geo-tagging support and land record cross-referencing',
            'Designed loan eligibility engine with configurable rules based on crop type, land area, and farmer history',
            'Created multi-level approval workflows with role-based routing for branch, regional, and head office approvals',
            'Developed APIs for agriculture loan application tracking, document verification status, and disbursement management',
            'Integrated CBS APIs for real-time account validation, balance checks, and loan account creation in core banking',
            'Implemented seasonal loan cycle management for Kharif and Rabi crop lending with auto-renewal features',
            'Built reporting APIs for loan portfolio analysis, NPA tracking, and subsidy reconciliation',
            'Handled UAT coordination with bank testing teams, managed defect resolution, and ensured sign-off for production releases',
          ],
        },
        {
          name: 'Retail Loan Module',
          points: [
            'Built comprehensive retail loan module supporting personal loans, small business loans, and consumer durable loans',
            'Implemented loan application processing with credit score integration, income verification, and risk assessment',
            'Developed EMI calculation engine with support for flat-rate, reducing balance, and flexible repayment options',
            'Created repayment schedule generation with pre-closure, part-payment, and restructuring capabilities',
            'Built loan status tracking dashboard APIs with real-time updates across origination, approval, and disbursement stages',
            'Developed customer onboarding APIs with de-duplication logic, PAN verification, and address validation',
            'Implemented loan approval workflows with configurable delegation of authority and auto-approval rules',
            'Integrated CBS APIs for disbursement posting, repayment collection, and account statement generation',
            'Built notification triggers for EMI reminders, overdue alerts, and loan milestone communications',
            'Designed REST APIs for loan restructuring, top-up loans, and balance transfer from other institutions',
          ],
        },
        {
          name: 'Client Handling, Onsite & Production Support',
          points: [
            'Provided onsite implementation and support at Canara Bank, Union Bank of India, and Ujjivan Small Finance Bank',
            'Conducted regular client meetings to gather requirements, understand banking workflows, and translate them into technical specifications',
            'Managed complete UAT cycles - coordinating test scenarios with banking teams, tracking defects, and ensuring timely sign-offs',
            'Handled production deployments across multiple banking environments with zero-downtime release strategies',
            'Monitored production systems health, resolved critical P1/P2 issues, and performed root cause analysis',
            'Acted as single point of contact for client escalations, managing stakeholder expectations and delivery timelines',
            'Coordinated with CBS teams for API integration testing, data mapping, and reconciliation between LendPerfect and core banking',
            'Conducted requirement workshops and demo sessions with bank product owners and business analysts',
            'Managed environment-specific configurations and deployments across development, staging, UAT, and production',
            'Prepared release notes, deployment checklists, and post-deployment validation reports for banking clients',
          ],
        },
      ],
      highlights: [],
    },
    {
      role: 'Java Developer',
      company: 'Cris Tech Systems Pvt Ltd',
      project: 'Expedia - Hotel Booking & Travel Platform',
      duration: '3.2 Years',
      current: false,
      highlights: [
        'Built secure authentication using JWT with role-based access control (RBAC)',
        'Developed property management module with AWS S3 for image storage',
        'Implemented advanced search with comprehensive filtering and sorting',
        'Created car rental, favorites, and package deals modules',
        'Built email & SMS notification systems for booking confirmations',
        'Developed centralized ApiService in Angular for HTTP operations',
        'Wrote JPQL queries for search, seat availability, and hotel filtering',
        'Implemented Spring validation and exception handling across systems',
      ],
    },
  ];

  ngAfterViewInit() {
    // Loading screen
    let count = 0;
    this.loadingInterval = setInterval(() => {
      count += Math.random() * 15;
      if (count >= 100) {
        count = 100;
        this.loadingPercent.set(100);
        clearInterval(this.loadingInterval!);
        setTimeout(() => {
          this.loadingComplete.set(true);
          this.startTyping();
          this.setupScrollObserver();
        }, 400);
      } else {
        this.loadingPercent.set(Math.floor(count));
      }
    }, 80);

    this.cursorInterval = setInterval(() => {
      this.showCursor.update(v => !v);
    }, 530);

    this.scrollHandler = () => {
      this.navScrolled.set(window.scrollY > 50);

      // Scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress.set(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);

      // Active section detection
      const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          this.activeSection.set(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });

    this.mouseHandler = (e: MouseEvent) => {
      this.mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      this.mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener('mousemove', this.mouseHandler, { passive: true });
  }

  ngOnDestroy() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    if (this.cursorInterval) clearInterval(this.cursorInterval);
    if (this.loadingInterval) clearInterval(this.loadingInterval);
    this.observer?.disconnect();
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
    if (this.mouseHandler) window.removeEventListener('mousemove', this.mouseHandler);
  }

  private startTyping() {
    const currentTitle = this.titles[this.titleIndex];
    const speed = this.isDeleting ? 30 : 65;

    if (!this.isDeleting) {
      this.typedText.set(currentTitle.substring(0, this.charIndex + 1));
      this.charIndex++;
      if (this.charIndex === currentTitle.length) {
        this.isDeleting = true;
        this.typingTimeout = setTimeout(() => this.startTyping(), 2200);
        return;
      }
    } else {
      this.typedText.set(currentTitle.substring(0, this.charIndex - 1));
      this.charIndex--;
      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.titleIndex = (this.titleIndex + 1) % this.titles.length;
      }
    }
    this.typingTimeout = setTimeout(() => this.startTyping(), speed);
  }

  private setupScrollObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        this.observer!.observe(el);
      });
    }, 200);
  }

  scrollTo(sectionId: string) {
    this.activeSection.set(sectionId);
    this.navOpen.set(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleNav() {
    this.navOpen.update(v => !v);
  }
}
