const express = require('express');
const { createCanvas, loadImage } = require('canvas');

const app = express();

app.get('/carta', async (req, res) => {
  try {
    const {
      fondo,
      per,
      titt,
      gol,
      asis,
      drib,
      rob,
      saves,
      partidas,
      estilo
    } = req.query;

    if (!fondo || !per || !titt) {
      return res.status(400).send('Faltan datos obligatorios');
    }

    const fondoImg = await loadImage(fondo);

    const canvas = createCanvas(fondoImg.width, fondoImg.height);
    const ctx = canvas.getContext('2d');

    // Dibujar solo fondo
    ctx.drawImage(fondoImg, 0, 0);

    // ===== TÍTULO =====
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = `bold ${canvas.width / 14}px Arial`;

    const title = `╔═══${titt}═══╗`;
    ctx.strokeText(title, canvas.width / 2, canvas.height * 0.1);
    ctx.fillText(title, canvas.width / 2, canvas.height * 0.1);

    // ===== STATS =====
    ctx.textAlign = 'left';
    ctx.font = `bold ${canvas.width / 20}px Arial`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;

    let y = canvas.height * 0.3;
    const x = canvas.width * 0.1;
    const gap = canvas.height * 0.05;

    const stats = [
      ` GOLES: ${gol || 0}`,
      ` ASISTENCIAS: ${asis || 0}`,
      ` REGATE: ${drib || 0}`,
      ` ROBOS: ${rob || 0}`,
      ` SAVES: ${saves || 0}`,
      ` PARTIDAS: ${partidas || 0}`,
      `Estilo: ${estilo || 'Ninguno'}`
    ];

    for (const stat of stats) {
      ctx.strokeText(stat, x, y);
      ctx.fillText(stat, x, y);
      y += gap;
    }

    res.setHeader('Content-Type', 'image/png');
    res.send(canvas.toBuffer());

  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando carta');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Carta API lista en http://localhost:${port}`));
