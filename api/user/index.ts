import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany({ include: { posts: true } });
    return res.status(200).json(users);
  }

  if (req.method === 'POST') {
    const { name, email } = req.body;
    try {
      const user = await prisma.user.create({ data: { name, email } });
      return res.status(201).json(user);
    } catch {
      return res.status(400).json({ error: 'Erro ao criar usuário' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}