import { Component, signal, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

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
  private scrollHandler: (() => void) | null = null;
  private mouseHandler: ((e: MouseEvent) => void) | null = null;
  private loadingInterval: ReturnType<typeof setInterval> | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private animationId: number | null = null;
  private threeMouseX = 0;
  private threeMouseY = 0;

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
          this.initThreeJS();
          this.initGSAP();
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
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress.set(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
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
      this.threeMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.threeMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', this.mouseHandler, { passive: true });
  }

  ngOnDestroy() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    if (this.cursorInterval) clearInterval(this.cursorInterval);
    if (this.loadingInterval) clearInterval(this.loadingInterval);
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
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

  // ====== THREE.JS - Floating Particles + Torus ======
  private initThreeJS() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      // Purple/blue/pink tones
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.39; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.95; // indigo
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.66; colors[i * 3 + 1] = 0.33; colors[i * 3 + 2] = 0.97; // purple
      } else {
        colors[i * 3] = 0.93; colors[i * 3 + 1] = 0.28; colors[i * 3 + 2] = 0.6; // pink
      }

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Wireframe Torus Knot
    const torusGeometry = new THREE.TorusKnotGeometry(8, 2.5, 100, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // Floating ring
    const ringGeometry = new THREE.TorusGeometry(12, 0.08, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Connection lines between nearby particles
    const linePositions = new Float32Array(300 * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.04,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const clock = new THREE.Clock();

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate particles
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.01;

      // Twinkle: modify particle sizes
      const sizeAttr = particleGeometry.getAttribute('size') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        sizeAttr.array[i] = (Math.sin(elapsed * 2 + i * 0.5) * 0.5 + 1) * (sizes[i]);
      }
      sizeAttr.needsUpdate = true;

      // Torus animation
      torus.rotation.x = elapsed * 0.1;
      torus.rotation.y = elapsed * 0.15;

      // Ring float
      ring.rotation.z = elapsed * 0.05;
      ring.position.y = Math.sin(elapsed * 0.5) * 2;

      // Mouse-follow camera
      camera.position.x += (this.threeMouseX * 5 - camera.position.x) * 0.02;
      camera.position.y += (this.threeMouseY * 5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // Update connection lines
      const posArr = particleGeometry.getAttribute('position').array as Float32Array;
      let lineIdx = 0;
      for (let i = 0; i < Math.min(particleCount, 80); i++) {
        for (let j = i + 1; j < Math.min(particleCount, 80); j++) {
          if (lineIdx >= 300) break;
          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 15) {
            linePositions[lineIdx * 6] = posArr[i * 3];
            linePositions[lineIdx * 6 + 1] = posArr[i * 3 + 1];
            linePositions[lineIdx * 6 + 2] = posArr[i * 3 + 2];
            linePositions[lineIdx * 6 + 3] = posArr[j * 3];
            linePositions[lineIdx * 6 + 4] = posArr[j * 3 + 1];
            linePositions[lineIdx * 6 + 5] = posArr[j * 3 + 2];
            lineIdx++;
          }
        }
      }
      (lineGeometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;

      this.renderer!.render(scene, camera);
    };

    animate();

    // Scroll-driven torus scale
    gsap.to(torus.scale, {
      x: 0.3, y: 0.3, z: 0.3,
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Resize handler
    const onResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      this.renderer!.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
  }

  // ====== GSAP ScrollTrigger Animations ======
  private initGSAP() {
    // Section titles slide in
    gsap.utils.toArray<HTMLElement>('.sect-title').forEach(el => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });

    // Section tags slide from left
    gsap.utils.toArray<HTMLElement>('.sect-tag').forEach(el => {
      gsap.from(el, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    // Stat cards stagger
    gsap.from('.stat-box', {
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.stats-wrap', start: 'top 80%' },
    });

    // Project cards stagger slide up
    gsap.from('.proj-card', {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.proj-grid', start: 'top 80%' },
    });

    // Experience blocks
    gsap.from('.exp-block', {
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.3,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.exp-block', start: 'top 85%' },
    });

    // Module cards slide from left with stagger
    gsap.from('.mod-block', {
      x: -60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.mod-block', start: 'top 85%' },
    });

    // Skills section fade in
    gsap.from('.marquee-wrap', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.marquee-wrap', start: 'top 85%' },
    });

    // Contact cards slide in from right
    gsap.from('.c-card', {
      x: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-info', start: 'top 80%' },
    });

    // Contact form slide up
    gsap.from('.c-form', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.c-form', start: 'top 85%' },
    });

    // Parallax glows on scroll
    gsap.to('.glow-1', {
      y: -200,
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 2 },
    });
    gsap.to('.glow-2', {
      y: -150,
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 2 },
    });

    // Terminal slide in
    gsap.from('.terminal', {
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.8,
    });

    // Info grid items stagger
    gsap.from('.info-item', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.info-grid', start: 'top 85%' },
    });
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
