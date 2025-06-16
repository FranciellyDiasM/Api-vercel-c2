import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = Number(req.query.id);

  if (req.method === 'GET') {
    const post = await prisma.post.findUnique({ where: { id }, include: { author: true } });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    return res.json(post);
  }

  if (req.method === 'PUT') {
    const { title, content } = req.body;
    try {
      const post = await prisma.post.update({ where: { id }, data: { title, content } });
      return res.json(post);
    } catch {
      return res.status(400).json({ error: 'Erro ao atualizar post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.post.delete({ where: { id } });
      return res.json({ message: 'Post deletado' });
    } catch {
      return res.status(400).json({ error: 'Erro ao deletar post' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}