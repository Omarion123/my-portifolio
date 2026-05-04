import { User } from '../models/User';
import { Identity } from '../models/Identity';
import { Project } from '../models/Project';
import { SkillGroup } from '../models/SkillGroup';
import { Experience } from '../models/Experience';
import { Education } from '../models/Education';
import { Certification } from '../models/Certification';
import { BlogPost } from '../models/BlogPost';

export async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  console.log('Empty database detected — seeding initial data…');

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@portfolio.dev';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234!';
  await User.create({ email: adminEmail, password: adminPassword });
  console.log(`Admin created → email: ${adminEmail}  password: ${adminPassword}`);

  await Identity.create({
    name: 'Omar Karake',
    title: 'Full-Stack Software Engineer',
    location: 'Accra, GH',
    tagline: 'I design and build fast, accessible web products — from the database up to the pixel.',
    email: 'omar.karake@amalitech.com',
    github: 'github.com/omar-karake',
    linkedin: 'linkedin.com/in/omar-karake',
    available: true,
    aboutParagraphs: [
      'Engineer passionate about building production-grade systems that scale. I care about durable architecture, honest UX, and code the next person can actually read.',
      'Currently focused on full-stack web development with Angular and Node.js, and modern cloud-native architectures.',
    ],
    aboutFocus: ['Full-stack development', 'Cloud architecture', 'Developer experience'],
    aboutStats: [
      { k: 'Projects shipped', v: '20+' },
      { k: 'Technologies', v: '15+' },
      { k: 'Coffee cups', v: '∞' },
      { k: 'Production incidents', v: '0' },
    ],
  });

  await Project.insertMany([
    { idx: '01', title: 'Portfolio Platform', blurb: 'Full-stack portfolio + admin dashboard built with Angular 21 and Node.js.', role: 'Solo', year: '2026', stack: ['Angular', 'Node.js', 'MongoDB', 'Tailwind CSS'], category: 'Product', featured: true, live: '', repo: '', status: 'In Progress', order: 0 },
    { idx: '02', title: 'E-Commerce Dashboard', blurb: 'Merchant analytics dashboard with real-time data and custom reporting.', role: 'Lead', year: '2025', stack: ['React', 'Express', 'PostgreSQL', 'Chart.js'], category: 'Product', featured: true, live: '', repo: '', status: 'Live', order: 1 },
    { idx: '03', title: 'API Gateway Service', blurb: 'Rate-limited API gateway with JWT auth, route proxying and observability hooks.', role: 'Solo', year: '2024', stack: ['Node.js', 'Redis', 'Docker', 'Prometheus'], category: 'Infrastructure', featured: false, live: '', repo: '', status: 'Open source', order: 2 },
  ]);

  await SkillGroup.insertMany([
    { group: 'Frontend', items: [{ name: 'Angular', level: 90 }, { name: 'TypeScript', level: 88 }, { name: 'Tailwind CSS', level: 85 }, { name: 'React', level: 78 }], order: 0 },
    { group: 'Backend',  items: [{ name: 'Node.js', level: 85 }, { name: 'Express', level: 82 }, { name: 'Python', level: 75 }, { name: 'REST APIs', level: 90 }], order: 1 },
    { group: 'Databases',items: [{ name: 'MongoDB', level: 80 }, { name: 'PostgreSQL', level: 78 }, { name: 'Redis', level: 70 }], order: 2 },
    { group: 'Tools',    items: [{ name: 'Docker', level: 78 }, { name: 'Git', level: 92 }, { name: 'Linux', level: 85 }, { name: 'AWS', level: 72 }], order: 3 },
  ]);

  await Experience.insertMany([
    { role: 'Software Engineer', org: 'AmaliTech gGmbH', from: '2024', to: 'Present', where: 'Accra, GH', summary: 'Building enterprise web applications and internal tools for clients across various industries.', bullets: ['Delivered multiple production-ready Angular applications.', 'Mentored junior developers on best practices.', 'Implemented CI/CD pipelines with GitHub Actions.'], order: 0 },
  ]);

  await Education.insertMany([
    { degree: 'B.Sc. Computer Science', org: 'University of Ghana', from: '2020', to: '2024', note: 'Graduated with First Class Honours.', order: 0 },
  ]);

  await Certification.insertMany([
    { name: 'AWS Cloud Practitioner', org: 'Amazon Web Services', year: '2024', order: 0 },
    { name: 'MongoDB Associate Developer', org: 'MongoDB University', year: '2024', order: 1 },
  ]);

  await BlogPost.insertMany([
    { title: 'Getting started with Angular 21', excerpt: 'A tour of the most exciting features in Angular 21 — signals, view transitions, and the new control flow.', date: 'May 1, 2026', readMin: 5, tag: 'Frontend', published: true },
    { title: 'Building a REST API with Express 5 and MongoDB', excerpt: 'A step-by-step walkthrough of a production-ready REST API with Express 5 and Mongoose.', date: 'Apr 15, 2026', readMin: 8, tag: 'Backend', published: true },
  ]);

  console.log('Seed complete.');
}
