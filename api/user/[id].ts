import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = Number(req.query.id);

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({ where: { id }, include: { posts: true } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json(user);
  }

  if (req.method === 'PUT') {
    const { name, email } = req.body;
    try {
      const user = await prisma.user.update({ where: { id }, data: { name, email } });
      return res.json(user);
    } catch {
      return res.status(400).json({ error: 'Erro ao atualizar' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.user.delete({ where: { id } });
      return res.json({ message: 'Usuário deletado' });
    } catch {
      return res.status(400).json({ error: 'Erro ao deletar' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}