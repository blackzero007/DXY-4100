import type { DrawnCard } from '@/types';
import { formatDate, getTodayString } from './date';

const CANVAS_WIDTH = 750;
const CANVAS_HEIGHT = 1200;
const PADDING = 50;
const BORDER_WIDTH = 6;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = text.split('');
  let line = '';
  let currentY = y;

  for (let n = 0; n < chars.length; n++) {
    const testLine = line + chars[n];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = chars[n];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
}

function drawDecorativeCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotation: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.lineTo(0, 0);
  ctx.lineTo(40, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 25);
  ctx.lineTo(0, 0);
  ctx.lineTo(25, 0);
  ctx.stroke();
  ctx.restore();
}

export async function generateShareImage(card: DrawnCard): Promise<string> {
  const { isReversed } = card;
  const meaning = isReversed ? card.reversedMeaning : card.meaning;
  const loveFortune = isReversed ? card.reversedLoveFortune : card.loveFortune;
  const careerFortune = isReversed ? card.reversedCareerFortune : card.careerFortune;
  const wealthFortune = isReversed ? card.reversedWealthFortune : card.wealthFortune;
  const healthFortune = isReversed ? card.reversedHealthFortune : card.healthFortune;
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建Canvas上下文');

  const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gradient.addColorStop(0, '#1e1b4b');
  gradient.addColorStop(0.5, '#312e81');
  gradient.addColorStop(1, '#0f0a2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * CANVAS_WIDTH;
    const y = Math.random() * CANVAS_HEIGHT;
    const r = Math.random() * 3 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const borderGradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  borderGradient.addColorStop(0, '#fbbf24');
  borderGradient.addColorStop(0.5, '#f59e0b');
  borderGradient.addColorStop(1, '#fbbf24');
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeRect(
    PADDING,
    PADDING,
    CANVAS_WIDTH - PADDING * 2,
    CANVAS_HEIGHT - PADDING * 2
  );

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(
    PADDING + 12,
    PADDING + 12,
    CANVAS_WIDTH - (PADDING + 12) * 2,
    CANVAS_HEIGHT - (PADDING + 12) * 2
  );

  drawDecorativeCorner(ctx, PADDING + 12, PADDING + 12, 0);
  drawDecorativeCorner(ctx, CANVAS_WIDTH - PADDING - 12, PADDING + 12, Math.PI / 2);
  drawDecorativeCorner(ctx, CANVAS_WIDTH - PADDING - 12, CANVAS_HEIGHT - PADDING - 12, Math.PI);
  drawDecorativeCorner(ctx, PADDING + 12, CANVAS_HEIGHT - PADDING - 12, -Math.PI / 2);

  let currentY = PADDING + 60;

  ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 1;
  const titleY = currentY - 20;
  const titleH = 50;
  ctx.fillRect(CANVAS_WIDTH / 2 - 140, titleY, 280, titleH);
  ctx.strokeRect(CANVAS_WIDTH / 2 - 140, titleY, 280, titleH);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 28px "Noto Serif SC", "Songti SC", "SimSun", serif';
  ctx.fillText('✦ 每日运势 ✦', CANVAS_WIDTH / 2, currentY + 15);
  currentY += 70;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '20px "Noto Serif SC", serif';
  const dateStr = formatDate(getTodayString());
  ctx.fillText(dateStr, CANVAS_WIDTH / 2, currentY);
  currentY += 50;

  const contentWidth = CANVAS_WIDTH - (PADDING + 30) * 2;
  const cardStartY = currentY;
  const cardHeight = 380;

  const cardColors = card.color.split(' ');
  const c1 = cardColors[0]?.replace('from-', '') || 'purple-700';
  const c2 = cardColors[1]?.replace('via-', '') || 'indigo-700';
  const c3 = cardColors[2]?.replace('to-', '') || 'purple-800';

  const colorMap: Record<string, string> = {
    'purple-900': '#4c1d95',
    'purple-800': '#6b21a8',
    'purple-700': '#7c3aed',
    'purple-600': '#9333ea',
    'indigo-900': '#312e81',
    'indigo-800': '#3730a3',
    'indigo-700': '#4338ca',
    'indigo-600': '#4f46e5',
    'violet-900': '#4c1d95',
    'violet-800': '#5b21b6',
    'violet-700': '#6d28d9',
    'fuchsia-900': '#701a75',
    'fuchsia-800': '#86198f',
    'fuchsia-700': '#a21caf',
    'rose-900': '#881337',
    'rose-800': '#9f1239',
    'rose-700': '#be123c',
    'amber-900': '#78350f',
    'amber-800': '#92400e',
    'amber-700': '#b45309',
    'emerald-900': '#064e3b',
    'emerald-800': '#065f46',
    'emerald-700': '#047857',
    'sky-900': '#0c4a6e',
    'sky-800': '#075985',
    'sky-700': '#0369a1',
    'slate-900': '#0f172a',
    'slate-800': '#1e293b',
    'slate-700': '#334155',
  };

  const cardGradient = ctx.createLinearGradient(
    PADDING + 30,
    cardStartY,
    CANVAS_WIDTH - PADDING - 30,
    cardStartY + cardHeight
  );
  cardGradient.addColorStop(0, colorMap[c1] || '#4c1d95');
  cardGradient.addColorStop(0.5, colorMap[c2] || '#312e81');
  cardGradient.addColorStop(1, colorMap[c3] || '#4c1d95');

  ctx.fillStyle = cardGradient;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;

  const cardRadius = 20;
  const cardX = PADDING + 30;
  const cardY = cardStartY;
  const cardW = contentWidth;
  ctx.beginPath();
  ctx.moveTo(cardX + cardRadius, cardY);
  ctx.lineTo(cardX + cardW - cardRadius, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + cardRadius);
  ctx.lineTo(cardX + cardW, cardY + cardHeight - cardRadius);
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardHeight, cardX + cardW - cardRadius, cardY + cardHeight);
  ctx.lineTo(cardX + cardRadius, cardY + cardHeight);
  ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - cardRadius);
  ctx.lineTo(cardX, cardY + cardRadius);
  ctx.quadraticCurveTo(cardX, cardY, cardX + cardRadius, cardY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(cardX, cardY, cardW, cardHeight);

  ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.font = '14px serif';
  ctx.textAlign = 'left';
  ctx.fillText(card.nameEn, cardX + 25, cardY + 35);
  ctx.textAlign = 'right';
  ctx.fillText(card.nameEn, cardX + cardW - 25, cardY + 35);

  ctx.textAlign = 'center';
  ctx.font = '120px serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 20;
  if (isReversed) {
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, cardStartY + 170);
    ctx.rotate(Math.PI);
    ctx.fillText(card.symbol, 0, 0);
    ctx.restore();
  } else {
    ctx.fillText(card.symbol, CANVAS_WIDTH / 2, cardStartY + 170);
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Noto Serif SC", "Songti SC", serif';
  ctx.fillText(card.name, CANVAS_WIDTH / 2, cardStartY + 250);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = 'italic 22px "Georgia", serif';
  ctx.fillText(card.nameEn, CANVAS_WIDTH / 2, cardStartY + 290);

  ctx.save();
  ctx.translate(cardX + 25, cardY + cardHeight - 25);
  ctx.rotate(Math.PI);
  ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.font = '14px serif';
  ctx.textAlign = 'left';
  ctx.fillText(card.nameEn, 0, 0);
  ctx.textAlign = 'right';
  ctx.fillText(card.nameEn, cardW - 50, 0);
  ctx.restore();

  currentY = cardStartY + cardHeight + 50;

  ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
  ctx.font = 'bold 22px "Noto Serif SC", serif';
  ctx.textAlign = 'left';
  ctx.fillText('✦ 综合运势', PADDING + 30, currentY);
  ctx.textAlign = 'right';
  ctx.fillStyle = isReversed ? '#f87171' : '#4ade80';
  ctx.font = 'bold 18px "Noto Serif SC", serif';
  ctx.fillText(isReversed ? '逆位' : '正位', CANVAS_WIDTH - PADDING - 30, currentY);
  currentY += 20;

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING + 30, currentY);
  ctx.lineTo(CANVAS_WIDTH - PADDING - 30, currentY);
  ctx.stroke();
  currentY += 30;

  ctx.fillStyle = '#e5e7eb';
  ctx.font = '22px "Noto Serif SC", "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'left';
  currentY = wrapText(
    ctx,
    meaning,
    PADDING + 30,
    currentY,
    contentWidth,
    38
  );

  currentY += 50;

  const sectionW = (contentWidth - 20) / 2;
  const sectionH = 130;
  const sections = [
    { label: '感情', color: '#f472b6', icon: '♥', text: loveFortune },
    { label: '事业', color: '#60a5fa', icon: '◆', text: careerFortune },
    { label: '财运', color: '#fbbf24', icon: '●', text: wealthFortune },
    { label: '健康', color: '#34d399', icon: '▲', text: healthFortune },
  ];

  sections.forEach((sec, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const sx = PADDING + 30 + col * (sectionW + 20);
    const sy = currentY + row * (sectionH + 15);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.strokeStyle = `${sec.color}40`;
    ctx.lineWidth = 1;
    const r = 12;
    ctx.beginPath();
    ctx.moveTo(sx + r, sy);
    ctx.lineTo(sx + sectionW - r, sy);
    ctx.quadraticCurveTo(sx + sectionW, sy, sx + sectionW, sy + r);
    ctx.lineTo(sx + sectionW, sy + sectionH - r);
    ctx.quadraticCurveTo(sx + sectionW, sy + sectionH, sx + sectionW - r, sy + sectionH);
    ctx.lineTo(sx + r, sy + sectionH);
    ctx.quadraticCurveTo(sx, sy + sectionH, sx, sy + sectionH - r);
    ctx.lineTo(sx, sy + r);
    ctx.quadraticCurveTo(sx, sy, sx + r, sy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = sec.color;
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(sec.icon, sx + 18, sy + 32);
    ctx.fillStyle = sec.color;
    ctx.font = 'bold 18px "Noto Serif SC", serif';
    ctx.fillText(`${sec.label}运势`, sx + 45, sy + 32);

    ctx.fillStyle = '#d1d5db';
    ctx.font = '15px "PingFang SC", "Microsoft YaHei", sans-serif';
    wrapText(ctx, sec.text, sx + 18, sy + 58, sectionW - 36, 24);
  });

  currentY += 2 * (sectionH + 15) + 40;

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.font = '16px "Noto Serif SC", serif';
  const lineW = 100;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 - lineW, currentY);
  ctx.lineTo(CANVAS_WIDTH / 2 - 30, currentY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 + 30, currentY);
  ctx.lineTo(CANVAS_WIDTH / 2 + lineW, currentY);
  ctx.stroke();
  ctx.fillText('✧', CANVAS_WIDTH / 2, currentY + 5);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '14px "PingFang SC", sans-serif';
  ctx.fillText('长按保存图片 · 分享今日运势', CANVAS_WIDTH / 2, currentY + 35);

  return canvas.toDataURL('image/png', 1.0);
}
