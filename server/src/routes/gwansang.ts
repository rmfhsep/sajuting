import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { analyzeGwansang } from '../services/gwansang.service';

const router = Router();
const prisma = new PrismaClient();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다 (jpeg, jpg, png, webp)'));
    }
  },
});

router.use(authMiddleware);

router.post('/analyze', upload.single('image'), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: '이미지를 업로드해주세요' });
    return;
  }

  try {
    const result = await analyzeGwansang(req.file.path);
    const imageUrl = `/uploads/${req.file.filename}`;

    const reading = await prisma.gwansangReading.create({
      data: {
        userId: req.userId!,
        imageUrl,
        result,
      },
    });

    res.json({ id: reading.id, result });
  } catch (err) {
    console.error('Gwansang analysis error:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: '분석 중 오류가 발생했습니다' });
  }
});

router.get('/history', async (req: AuthRequest, res: Response) => {
  const readings = await prisma.gwansangReading.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ readings });
});

export default router;
