// ---------------------------------------------------------------------------
//  Central content file — edit everything about the portfolio right here.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
//  Owner-only CV upload secret
//  -----------------------------
//  Only you should know this key. Visit your site with it in the URL to unlock
//  the CV & photo upload controls:
//      https://your-site.com/?key=YOUR_SECRET
//  Visitors without the key only see a plain "Download CV" button.
//  IMPORTANT: change this to your own secret phrase before deploying, and keep
//  it in sync with the ADMIN_KEY secret on your Supabase project
//  (see CV_UPLOAD_SETUP.md).
// ---------------------------------------------------------------------------
export const adminKey = 'vicheka-cv-2026'

export const profile = {
  name: 'Vicheka Soeng',
  firstName: 'Vicheka',
  title: 'Frontend Developer',
  roles: ['Frontend Developer', 'UI/UX Designer', 'Graphic Designer'],
  tagline:
    'I build fast, accessible and beautiful web experiences — from pixel-perfect interfaces to scalable APIs.',
  shortBio:
    "I'm a Frontend developer based in Phnom Penh with a passion for turning complex problems into simple, elegant products. I love working across the whole stack, from crafting delightful React or Vue.js interfaces to designing robust laravel backends.",
  extendedBio: [
    'My journey started with a curiosity for how the web works, and grew into a career building products used by real people every day. Over the years I have shipped e-commerce platforms, real-time dashboards, booking systems and more — always with a focus on performance, accessibility and clean code.',
    "When I am not coding, you will find me exploring new frameworks, writing about what I learn, or enjoying a good cup of coffee while sketching out my next project. I believe great software comes from great collaboration, so I always keep communication and transparency at the heart of my workflow.",
  ],
  location: 'BP 511, Phum Tropeang Chhuk (Borey Sorla) Sangtak, Street 371, Phnom Penh',
  email: 'soengvicheka775@gmail.com',
  phone: '+855 67 407 884',
  availability: 'Open to freelance & full-time roles',
  image: 'https://i.pravatar.cc/480?img=11',
  cv: '/cv.pdf',
  cvFileName: 'Vicheka-Soeng-CV.pdf',
  yearsExperience: 2,
  projectsCompleted: 6,
  // happyClients: 40,
  // -------------------------------------------------------------------------
  //  Photo lock
  //  ----------
  //  Set photoLocked to true AFTER you have uploaded your photo and are happy
  //  with it. While locked, ALL photo-change buttons (camera, hover overlay,
  //  drag & drop) are hidden and nobody can change the photo from the site.
  //  To change it again later, set this back to false (or ask for help).
  // -------------------------------------------------------------------------
  photoLocked: true,
}

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export const socials = [
  { name: 'LinkedIn', url: 'www.linkedin.com/in/vicheka-soeng-977453399', icon: 'linkedin' },
]


export const hardSkills = [
  { name: 'HTML', level: 90 },
  { name: 'CSS', level: 90 },
  { name: 'JavaScript', level: 70},
  { name: 'Vue.js', level: 70 },
  { name: 'MS Office', level: 90},
  { name: 'Figma', level: 85 },
  { name: 'Laravel', level: 70 },
  { name: 'GitHub', level: 80 },
  { name: 'TypeScript', level: 70},
  { name: 'MySQL', level: 80 },
  { name: 'Postman', level: 78 },
  { name: 'Photoshop (Basic)', level: 55 },
]

export const softSkills = [
  { name: 'Project Management', icon: 'clipboard' },
  { name: 'Teamwork & Collaboration', icon: 'users' },
  { name: 'Problem Solving', icon: 'target' },
  { name: 'Adaptability', icon: 'refresh' },
  { name: 'Communication', icon: 'message' },
  { name: 'Time / Task Management', icon: 'clock' },
]

export const projects = [
  {
    title: 'Student News (Blog Website)',
    description:
      'A blog website for students to share their thoughts, ideas and experiences.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://i.pinimg.com/1200x/48/13/18/481318a95f438aa209368dbd239e74b6.jpg',
    // github: 'https://github.com/vichekas/shoply',
    demo: 'https://students-news.vercel.app/',
  },
  {
    title: 'Weather App System',
    description:
      'A weather app system that provides real-time weather information for any location.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://i.pinimg.com/1200x/da/a9/8e/daa98e981ec6ba70e92a4616ab28243c.jpg',
    // github: 'https://github.com/vichekas/weather',
    demo: 'https://weather-system-group2.vercel.app/',
  },
  {
    title: 'PNC education system',
    description:
      'The PNC Education System is an internal web-based application that helps the Education Team manage the entire student lifecycle in one centralized platform, including enrollment, student profiles, ID card issuance, record management, and self-evaluation.',
    stack: ['Laravel', 'Vue.js', 'MySql'],
    image: 'https://i.pinimg.com/1200x/63/54/0d/63540d3056c21bdb9c62ef085f0e198d.jpg',
    github: 'https://github.com/pnc-education-system/pnc-education-system.git',
    demo: 'http://54.227.112.85/login',
  },
  {
    title: 'The The-Skincare-E-commerce',
    description:
      'The The-Skincare-E-commerce is an online skincare store that offers a wide range of skincare products for all skin types.',
    stack: ['React', 'Tailwind'],
    image: 'https://i.pinimg.com/1200x/f6/c7/30/f6c730f6b018d3cf11900af96f846452.jpg',
    github: 'https://github.com/soengvicheka/The-Skincare-E-commerce.git',
    demo: 'https://the-skincare-e-commerce.vercel.app',
  },
]

export const process = [
  {
    icon: 'sparkle',
    title: 'Discover',
    description:
      'I dig into your goals, audience and requirements to understand exactly what success looks like.',
  },
  {
    icon: 'clipboard',
    title: 'Plan',
    description:
      'Clear roadmap, timelines and tech choices — so everyone knows what happens and when.',
  },
  {
    icon: 'pen',
    title: 'Design',
    description:
      'Wireframes and polished UI that balance brand, usability and delightful micro-interactions.',
  },
  {
    icon: 'code',
    title: 'Develop',
    description:
      'Clean, maintainable code with modern tools, reviews and frequent, visible progress.',
  },
  {
    icon: 'check',
    title: 'Test',
    description:
      'Rigorous testing across devices and browsers to catch issues before anyone else does.',
  },
  {
    icon: 'rocket',
    title: 'Deploy',
    description:
      'Smooth launch with monitoring and support, plus a solid handover so you own everything.',
  },
]
