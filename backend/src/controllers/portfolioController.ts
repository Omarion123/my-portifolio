import { Request, Response } from 'express';
import { Identity } from '../models/Identity';
import { Project } from '../models/Project';
import { SkillGroup } from '../models/SkillGroup';
import { Experience } from '../models/Experience';
import { Education } from '../models/Education';
import { Certification } from '../models/Certification';
import { BlogPost } from '../models/BlogPost';

export async function getPortfolio(_req: Request, res: Response): Promise<void> {
  const [identity, projects, skills, experience, education, certifications, posts] = await Promise.all([
    Identity.findOne(),
    Project.find().sort('order'),
    SkillGroup.find().sort('order'),
    Experience.find().sort('order'),
    Education.find().sort('order'),
    Certification.find().sort('order'),
    BlogPost.find({ published: true }).sort('-createdAt'),
  ]);

  res.json({
    identity: identity ? {
      name: identity.name, title: identity.title, location: identity.location,
      tagline: identity.tagline, email: identity.email, github: identity.github,
      linkedin: identity.linkedin, available: identity.available,
      profileImage: identity.profileImage,
    } : {},
    about: identity ? {
      paragraphs: identity.aboutParagraphs,
      focus: identity.aboutFocus,
      stats: identity.aboutStats,
    } : {},
    projects, skills, experience, education, certifications, posts,
  });
}
