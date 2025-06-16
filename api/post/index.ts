import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({ include: { author: true } });
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const { title, content, authorId } = req.body;
    try {
      const post = await prisma.post.create({ data: { title, content, authorId } });
      return res.status(201).json(post);
    } catch {
      return res.status(400).json({ error: 'Erro ao criar post' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}