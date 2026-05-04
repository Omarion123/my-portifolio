import 'dotenv/config';
import { connectDB } from './database';
import { User } from '../models/User';
import { Identity } from '../models/Identity';
import { Project } from '../models/Project';
import { SkillGroup } from '../models/SkillGroup';
import { Experience } from '../models/Experience';
import { Education } from '../models/Education';
import { Certification } from '../models/Certification';
import { BlogPost } from '../models/BlogPost';

async function seed() {
  await connectDB();

  // Admin user
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    await User.create({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    console.log(`Admin created: ${process.env.ADMIN_EMAIL}`);
  }

  // Identity / About
  await Identity.findOneAndUpdate({}, {
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
  }, { upsert: true });

  // Projects
  await Project.deleteMany({});
  await Project.insertMany([
    { idx: '01', title: 'Portfolio Platform', blurb: 'Full-stack portfolio + admin dashboard built with Angular 21 and Node.js.', role: 'Solo', year: '2026', stack: ['Angular', 'Node.js', 'MongoDB', 'Tailwind CSS'], category: 'Product', featured: true, live: '', repo: '', status: 'In Progress', order: 0 },
    { idx: '02', title: 'E-Commerce Dashboard', blurb: 'Merchant analytics dashboard with real-time data and custom reporting.', role: 'Lead', year: '2025', stack: ['React', 'Express', 'PostgreSQL', 'Chart.js'], category: 'Product', featured: true, live: '', repo: '', status: 'Live', order: 1 },
  ]);

  // Skills
  await SkillGroup.deleteMany({});
  await SkillGroup.insertMany([
    { group: 'Frontend', items: [{ name: 'Angular', level: 90 }, { name: 'TypeScript', level: 88 }, { name: 'Tailwind CSS', level: 85 }, { name: 'React', level: 78 }], order: 0 },
    { group: 'Backend', items: [{ name: 'Node.js', level: 85 }, { name: 'Express', level: 82 }, { name: 'Python', level: 75 }, { name: 'REST APIs', level: 90 }], order: 1 },
    { group: 'Databases', items: [{ name: 'MongoDB', level: 80 }, { name: 'PostgreSQL', level: 78 }, { name: 'Redis', level: 70 }, { name: 'Mongoose', level: 82 }], order: 2 },
    { group: 'Tools', items: [{ name: 'Docker', level: 78 }, { name: 'Git', level: 90 }, { name: 'Linux', level: 85 }, { name: 'AWS', level: 72 }], order: 3 },
  ]);

  // Experience
  await Experience.deleteMany({});
  await Experience.insertMany([
    { role: 'Software Engineer', org: 'AmaliTech gGmbH', from: '2024', to: 'Present', where: 'Accra, GH', summary: 'Building enterprise web applications and internal tools for clients across various industries.', bullets: ['Delivered multiple production-ready Angular applications.', 'Mentored junior developers on best practices.', 'Implemented CI/CD pipelines with GitHub Actions.'], order: 0 },
  ]);

  // Education
  await Education.deleteMany({});
  await Education.insertMany([
    { degree: 'B.Sc. Computer Science', org: 'University of Ghana', from: '2020', to: '2024', note: 'Graduated with First Class Honours.', order: 0 },
  ]);

  // Certifications
  await Certification.deleteMany({});
  await Certification.insertMany([
    { name: 'AWS Cloud Practitioner', org: 'Amazon Web Services', year: '2024', order: 0 },
    { name: 'MongoDB Associate Developer', org: 'MongoDB University', year: '2024', order: 1 },
  ]);

  // Blog posts
  await BlogPost.deleteMany({});
  await BlogPost.insertMany([
    { title: 'Getting started with Angular 21', excerpt: 'A tour of the most exciting features in Angular 21 — signals, view transitions, and the new control flow.', date: 'May 1, 2026', readMin: 5, tag: 'Frontend', published: true },
    { title: 'Building a REST API with Express 5 and MongoDB', excerpt: 'A step-by-step walkthrough of building a production-ready REST API with the latest Express and Mongoose.', date: 'Apr 15, 2026', readMin: 8, tag: 'Backend', published: true },
  ]);

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
