import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { Identity } from '../models/Identity';

export async function sendContact(req: Request, res: Response): Promise<void> {
  const { name, email, message } = req.body;

  const identity = await Identity.findOne();
  const toEmail = identity?.email ?? process.env.SMTP_FROM ?? '';

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log(`[CONTACT] From: ${name} <${email}> — ${message}`);
    res.json({ message: 'Message received' });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_FROM}>`,
    to: toEmail,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: message,
    html: `<p><strong>${name}</strong> (${email}) says:</p><p>${message}</p>`,
  });

  res.json({ message: 'Message sent' });
}

export async function getIdentity(_req: Request, res: Response): Promise<void> {
  const identity = await Identity.findOne();
  res.json(identity ?? {});
}

export async function updateIdentity(req: Request, res: Response): Promise<void> {
  const identity = await Identity.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
  res.json(identity);
}
