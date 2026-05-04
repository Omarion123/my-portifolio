import { Schema, model, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readMin: number;
  tag: string;
  published: boolean;
  slug: string;
}

const blogPostSchema = new Schema<IBlogPost>({
  title:     { type: String, required: true },
  excerpt:   { type: String, required: true },
  content:   { type: String, default: '' },
  date:      { type: String, required: true },
  readMin:   { type: Number, default: 5 },
  tag:       { type: String, default: 'General' },
  published: { type: Boolean, default: false },
  slug:      { type: String, unique: true },
}, { timestamps: true });

blogPostSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
});

export const BlogPost = model<IBlogPost>('BlogPost', blogPostSchema);
