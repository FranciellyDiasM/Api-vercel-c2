import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ Libera CORS para o frontend hospedado
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend-api-c3.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Lida com pré-requisição (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ Rotas da API
  if (req.method === 'GET') {
    const users = await prisma.user.findMany({ include: { posts: true } });
    return res.status(200).json(users);
  }

  if (req.method === 'POST') {
    const { name, email } = req.body;
    try {
      const user = await prisma.user.create({ data: { name, email } });
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ error: 'Erro ao criar usuário', details: err });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
