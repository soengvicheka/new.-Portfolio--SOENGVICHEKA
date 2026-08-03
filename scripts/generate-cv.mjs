// Generates a minimal, valid placeholder CV PDF at public/cv.pdf
// so the "Download CV" button works out of the box.
// Replace public/cv.pdf with a real resume whenever you're ready.
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const lines = [
  'BT',
  '/F1 22 Tf',
  '72 740 Td',
  '(Vicheka Soeng) Tj',
  '/F1 12 Tf',
  '0 -26 Td',
  '(Frontend Developer, UI/UX & Graphic Designer) Tj',
  '0 -26 Td',
  '(Email: vicheka.soeng@gmail.com) Tj',
  '0 -20 Td',
  '(Phone: +855 12 345 678) Tj',
  '0 -20 Td',
  '(Location: Phnom Penh, Cambodia) Tj',
  '0 -20 Td',
  '(Availability: Open to freelance and full-time roles) Tj',
  '0 -40 Td',
  '(This is a placeholder CV - replace it with your real resume.) Tj',
  'ET',
]
const content = lines.join('\n')

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
]

let pdf = '%PDF-1.4\n'
const offsets = []
for (const obj of objects) {
  offsets.push(Buffer.byteLength(pdf, 'latin1'))
  pdf += `${offsets.length} 0 obj\n${obj}\nendobj\n`
}

const xrefStart = Buffer.byteLength(pdf, 'latin1')
pdf += `xref\n0 ${objects.length + 1}\n`
pdf += '0000000000 65535 f \n'
for (const offset of offsets) {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

const outPath = path.join(process.cwd(), 'public', 'cv.pdf')
writeFileSync(outPath, pdf, 'latin1')
console.log(`Generated ${outPath}`)
