type ReceiptParams = {
  guestName: string;
  hostName: string;
  dateLabel: string;
  weekday: string;
  vibeLabels: string[];
  cravings: string[];
  note: string;
  signatureCanvas: HTMLCanvasElement | null;
  hasSigned: boolean;
};

const INK = "#2D2118";
const INK_SOFT = "#5C4A3A";
const CLAY = "#C65D3A";
const PAPER = "#FFF9EF";
const SAGE = "#7A8B6F";

const HAND = '"Ma Shan Zheng", "Kaiti SC", serif';
const HAND2 = '"Long Cang", "Kaiti SC", serif';
const SERIF = '"Noto Serif SC", serif';
const SANS = '"Noto Sans SC", sans-serif';

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = Array.from(text);
  let line = "";
  let cursorY = y;
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = ch;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

/* 斜纹胶带，和页面 .washi 一致 */
function drawTape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  angle: number,
  base: string,
  stripe: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = base;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(-w / 2, -h / 2, w, h);
  ctx.clip();
  ctx.strokeStyle = stripe;
  ctx.lineWidth = 4;
  for (let i = -h; i < w + h; i += 12) {
    ctx.beginPath();
    ctx.moveTo(-w / 2 + i, -h / 2);
    ctx.lineTo(-w / 2 + i + h, h / 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}

function stampText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  w: number,
  h: number,
  angle: number,
  color: string,
  font: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 6);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 2);
  ctx.restore();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

/* 生成与页面同风格的「回执照」，可直接保存成图片 */
export function exportReceiptAsPNG(p: ReceiptParams): void {
  const W = 840;
  const TALL = 1400;
  const dpr = 2;
  const raw = document.createElement("canvas");
  raw.width = W * dpr;
  raw.height = TALL * dpr;
  const ctx = raw.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const pad = 62;
  const contentW = W - pad * 2;

  /* 纸底 + 轻微纸纹 */
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, TALL);
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = `rgba(45,33,24,${0.012 + Math.random() * 0.028})`;
    ctx.fillRect(Math.random() * W, Math.random() * TALL, 1.2, 1.2);
  }

  /* 抬头 */
  ctx.strokeStyle = "rgba(198,93,58,0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(pad, 92, 72, 22, 3);
  ctx.stroke();
  ctx.fillStyle = CLAY;
  ctx.font = `600 11px ${SANS}`;
  ctx.textAlign = "center";
  ctx.fillText("NO. 001", pad + 36, 107);
  ctx.textAlign = "left";

  ctx.fillStyle = INK_SOFT;
  ctx.font = `600 12px ${SANS}`;
  ctx.fillText("ADMIT ONE · 仅限卜文文", pad + 88, 108);

  ctx.fillStyle = CLAY;
  ctx.textAlign = "right";
  ctx.fillText("2026 · 11 · 24 · 永久有效", W - pad, 108);
  ctx.textAlign = "left";

  /* 标题 */
  ctx.fillStyle = INK;
  ctx.font = `46px ${HAND}`;
  ctx.fillText(`${p.guestName} · 已确认`, pad, 186);

  ctx.fillStyle = INK_SOFT;
  ctx.font = `17px ${SERIF}`;
  ctx.fillText(`${p.dateLabel} · ${p.weekday} · 我家 · 等你推开门`, pad, 222);

  /* 印章（贴纸感，不再是 Second 的细线方框） */
  stampText(ctx, "已盖章 · 盖了章就不能反悔了", W - pad - 152, 170, 306, 46, -0.05, SAGE, `21px ${HAND}`);

  /* 虚线分隔 */
  ctx.save();
  ctx.setLineDash([7, 7]);
  ctx.strokeStyle = "rgba(45,33,24,0.18)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(pad, 258);
  ctx.lineTo(W - pad, 258);
  ctx.stroke();
  ctx.restore();

  /* 两栏：目的地 / 点单预览 */
  const colY = 300;
  const leftX = pad;
  const leftW = 300;
  const rightX = pad + 336;
  const rightW = contentW - 336;

  const label = (text: string, x: number, y: number) => {
    ctx.fillStyle = CLAY;
    ctx.font = `600 11px ${SANS}`;
    ctx.fillText(text, x, y);
  };

  label("DESTINATION · 目的地", leftX, colY);
  ctx.fillStyle = INK;
  ctx.font = `27px ${HAND2}`;
  ctx.fillText("我的小窝", leftX, colY + 36);
  ctx.fillStyle = INK_SOFT;
  ctx.font = `15px ${SERIF}`;
  let leftY = wrapText(ctx, "门锁密码或楼下接应，那天我都会提前在楼下等你。", leftX, colY + 66, leftW, 26);
  leftY += 8;
  ctx.fillStyle = INK_SOFT;
  ctx.font = `14px ${SERIF}`;
  ctx.fillText("带的东西：", leftX, leftY);
  const leadW = ctx.measureText("带的东西：").width;
  ctx.fillStyle = INK;
  ctx.font = `600 14px ${SERIF}`;
  ctx.fillText("你自己就行", leftX + leadW, leftY);

  label("YOUR CALL · 你的点单", rightX, colY);
  ctx.fillStyle = INK;
  ctx.font = `17px ${SERIF}`;
  let rightY = wrapText(
    ctx,
    p.vibeLabels.length > 0 ? p.vibeLabels.join("  ·  ") : "到了再随心所欲决定",
    rightX,
    colY + 32,
    rightW,
    28,
  );
  rightY += 6;
  if (p.cravings.length > 0) {
    ctx.fillStyle = CLAY;
    ctx.font = `14px ${SERIF}`;
    rightY = wrapText(ctx, `已备清单：${p.cravings.join("、")}`, rightX, rightY, rightW, 24);
    rightY += 6;
  }
  if (p.note.trim()) {
    ctx.fillStyle = INK_SOFT;
    ctx.font = `19px ${HAND2}`;
    rightY = wrapText(ctx, `“${p.note.trim()}”`, rightX, rightY, rightW, 26);
  }

  const rowBottom = Math.max(leftY, rightY, colY + 120);

  /* 撕票口 */
  const perfY = rowBottom + 38;
  ctx.save();
  ctx.setLineDash([7, 7]);
  ctx.strokeStyle = "rgba(45,33,24,0.18)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(pad, perfY);
  ctx.lineTo(W - pad, perfY);
  ctx.stroke();
  ctx.restore();

  [18, W - 18].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, perfY, 13, 0, Math.PI * 2);
    ctx.fillStyle = PAPER;
    ctx.fill();
    ctx.strokeStyle = "rgba(45,33,24,0.16)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });

  /* 签名区 */
  const signTop = perfY + 40;
  label("SIGN HERE · 签下你的名字", pad, signTop);

  const boxY = signTop + 16;
  const boxW = 430;
  const boxH = 138;

  ctx.beginPath();
  ctx.roundRect(pad, boxY, boxW, boxH, 8);
  ctx.fillStyle = "#FFFDF7";
  ctx.fill();
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(45,33,24,0.22)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();

  if (p.hasSigned && p.signatureCanvas) {
    const cw = p.signatureCanvas.width;
    const ch = p.signatureCanvas.height;
    const scale = Math.min((boxW - 20) / cw, (boxH - 20) / ch);
    const dw = cw * scale;
    const dh = ch * scale;
    ctx.drawImage(p.signatureCanvas, pad + (boxW - dw) / 2, boxY + (boxH - dh) / 2, dw, dh);
  } else {
    ctx.fillStyle = INK;
    ctx.font = `40px ${HAND}`;
    ctx.fillText(p.guestName, pad + 24, boxY + boxH / 2 + 14);
  }

  /* 11月24日见 印章 */
  stampText(ctx, "11月24日见", pad + boxW + (contentW - boxW) / 2, boxY + boxH / 2, 196, 74, -0.12, CLAY, `27px ${HAND}`);

  /* 手写小尾巴 */
  ctx.fillStyle = INK_SOFT;
  ctx.font = `20px ${HAND2}`;
  ctx.textAlign = "right";
  ctx.fillText("这张回执只此一份，存下来就算数", W - pad, boxY + boxH + 38);
  ctx.textAlign = "left";

  /* 页脚 */
  const footY = boxY + boxH + 88;
  ctx.strokeStyle = "rgba(45,33,24,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, footY - 26);
  ctx.lineTo(W - pad, footY - 26);
  ctx.stroke();

  ctx.fillStyle = INK_SOFT;
  ctx.font = `14px ${SERIF}`;
  ctx.fillText(`发信人：${p.hostName} · 2026年11月24日，我在家里等你。`, pad, footY);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(92,74,58,0.6)";
  ctx.font = `12px ${SERIF}`;
  ctx.fillText("没有模板 · 只有真心", W - pad, footY);
  ctx.textAlign = "left";

  /* 裁到实际高度，绘制圆角描边与胶带 */
  const H = Math.min(TALL, footY + 52);
  const out = document.createElement("canvas");
  out.width = W * dpr;
  out.height = H * dpr;
  const octx = out.getContext("2d");
  if (!octx) return;
  octx.scale(dpr, dpr);
  octx.drawImage(raw, 0, 0, W * dpr, H * dpr, 0, 0, W, H);

  octx.strokeStyle = "rgba(45,33,24,0.18)";
  octx.lineWidth = 1.4;
  octx.beginPath();
  octx.roundRect(14, 14, W - 28, H - 28, 18);
  octx.stroke();

  drawTape(octx, 170, 52, 132, 28, -0.05, "rgba(217,164,65,0.45)", "rgba(255,255,255,0.35)");
  drawTape(octx, W - 170, 52, 118, 28, 0.05, "rgba(232,180,184,0.55)", "rgba(255,255,255,0.4)");

  const link = document.createElement("a");
  link.download = `${p.guestName}_20261124_邀请函回执.png`;
  link.href = out.toDataURL("image/png");
  link.click();
}
