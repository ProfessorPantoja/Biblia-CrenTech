// Gera um card de versículo em PNG (1080x1920, formato story) via canvas,
// com a identidade visual do app (fundo escuro + dourado). Sem dependências.

export interface VerseCardData {
    text: string;
    reference: string;
    version?: string;
}

const W = 1080;
const H = 1920;

const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
};

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (ctx.measureText(candidate).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = candidate;
        }
    }
    if (line) lines.push(line);
    return lines;
};

export const generateVerseCard = ({ text, reference, version }: VerseCardData): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return Promise.reject(new Error('Canvas não suportado'));

    // Fundo em degradê escuro
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#111827');
    bg.addColorStop(0.5, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Brilhos dourados suaves (canto superior e inferior)
    const glowTop = ctx.createRadialGradient(W * 0.18, H * 0.1, 0, W * 0.18, H * 0.1, 620);
    glowTop.addColorStop(0, 'rgba(251, 191, 36, 0.14)');
    glowTop.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glowTop;
    ctx.fillRect(0, 0, W, H);

    const glowBottom = ctx.createRadialGradient(W * 0.85, H * 0.92, 0, W * 0.85, H * 0.92, 700);
    glowBottom.addColorStop(0, 'rgba(251, 191, 36, 0.10)');
    glowBottom.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glowBottom;
    ctx.fillRect(0, 0, W, H);

    // Moldura
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 56, 56, W - 112, H - 112, 44);
    ctx.stroke();

    // Aspas decorativas
    ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
    ctx.font = '220px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'left';
    ctx.fillText('“', 110, 400);

    // Texto do versículo: fonte diminui até caber na área central
    const quoted = `${text.trim()}`;
    const maxWidth = W - 260;
    const maxTextHeight = 1010;
    let fontSize = 66;
    let lines: string[] = [];
    ctx.textAlign = 'center';
    do {
        ctx.font = `${fontSize}px Georgia, "Times New Roman", serif`;
        lines = wrapText(ctx, quoted, maxWidth);
        if (lines.length * fontSize * 1.5 <= maxTextHeight) break;
        fontSize -= 4;
    } while (fontSize > 34);

    const lineHeight = fontSize * 1.5;
    const blockHeight = lines.length * lineHeight;
    let y = (H - blockHeight) / 2 - 40 + fontSize * 0.8;
    ctx.fillStyle = '#f8fafc';
    for (const line of lines) {
        ctx.fillText(line, W / 2, y);
        y += lineHeight;
    }

    // Divisor dourado
    const dividerY = y + 24;
    const divider = ctx.createLinearGradient(W / 2 - 160, 0, W / 2 + 160, 0);
    divider.addColorStop(0, 'rgba(251, 191, 36, 0)');
    divider.addColorStop(0.5, 'rgba(251, 191, 36, 0.9)');
    divider.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = divider;
    ctx.fillRect(W / 2 - 160, dividerY, 320, 3);

    // Referência
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic 48px Georgia, "Times New Roman", serif';
    const refLabel = version ? `${reference} · ${version}` : reference;
    ctx.fillText(refLabel, W / 2, dividerY + 108);

    // Rodapé (marca)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillText('B Í B L I A   C R E N T E C H', W / 2, H - 190);
    ctx.fillStyle = 'rgba(248, 250, 252, 0.45)';
    ctx.font = '28px system-ui, sans-serif';
    ctx.fillText('biblia-crentech.vercel.app', W / 2, H - 136);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => (blob ? resolve(blob) : reject(new Error('Falha ao gerar a imagem'))),
            'image/png'
        );
    });
};
