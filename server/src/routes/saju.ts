import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { analyzeSaju } from '../services/saju.service';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.post('/analyze', async (req: AuthRequest, res: Response) => {
  const { birthDate, birthTime, gender } = req.body;

  if (!birthDate || !gender) {
    res.status(400).json({ message: '생년월일과 성별을 입력해주세요' });
    return;
  }

  if (!/^\d{8}$/.test(birthDate)) {
    res.status(400).json({ message: 'YYYYMMDD 형식으로 입력해주세요' });
    return;
  }

  try {
    const result = await analyzeSaju(birthDate, birthTime || '모름', gender);

    const reading = await prisma.sajuReading.create({
      data: {
        userId: req.userId!,
        birthDate,
        birthTime: birthTime || '모름',
        gender,
        result,
      },
    });

    res.json({ id: reading.id, result });
  } catch (err) {
    console.error('Saju analysis error:', err);
    res.status(500).json({ message: '분석 중 오류가 발생했습니다' });
  }
});

router.get('/history', async (req: AuthRequest, res: Response) => {
  const readings = await prisma.sajuReading.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ readings });
});

export default router;
