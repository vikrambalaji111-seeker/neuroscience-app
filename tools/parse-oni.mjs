import fs from 'node:fs'

const SRC = process.argv[2] || '/path/to/Open Neuroscience Initiative.txt'
const raw = fs.readFileSync(SRC, 'utf8')
const lines = raw.split('\n')

// Section numbers we actually need (mirrors the book's chapter ToC).
const NEEDED = new Set([
  '1.1','1.2','1.3','1.4','1.5','2.1','2.2','2.3','3.1','3.2','3.3',
  '4.1','4.2','4.3','4.4','4.5','5.1','5.2','5.3','5.4','6.1','6.2','6.3','6.4',
  '7.1','7.2','7.3','7.4','8.1','8.2','8.3','9.1','9.2','9.3',
  '10.1','10.2','10.3','10.4','11.1','11.2','11.3','11.4','11.5','11.6',
  '12.1','12.2','12.3','12.4','12.5','12.6','13.1','13.2','13.3','13.4','13.5',
  '14.1','14.2','15.1','15.2','15.3','16.1','16.2','16.3','16.4',
])

const headerRe = /^(\d{1,2}\.\d{1,2})\s+(.+)$/
const isCreditLike = (s) =>
  /https?:\/\/|File:|\[CC|CC BY|commons\.wikimedia|modified by|Public domain|Pixabay|Image by|Reprinted|Own work|\bet al\b|\(20\d\d\)|Data from/i.test(s)
const looksLikeRealHeader = (line) => {
  const m = line.trim().match(headerRe)
  if (!m) return null
  const [, num, title] = m
  const [ch, sec] = num.split('.').map(Number)
  if (ch < 1 || ch > 16 || sec < 1 || sec > 40) return null   // valid range
  if (!/^[A-Z]/.test(title)) return null                       // real titles start uppercase (kills "cm apart", "mEq/L")
  if (isCreditLike(title)) return null                         // figure credit / citation
  return { num, title: title.trim() }
}
const isAnyHeaderToken = (line) => headerRe.test(line.trim())
const nextNonEmptyIdx = (i) => { let j = i + 1; while (j < lines.length && lines[j].trim() === '') j++; return j }

// Accept a header only if its next non-empty line is prose (not another header).
const accepted = []
for (let i = 0; i < lines.length; i++) {
  const hp = looksLikeRealHeader(lines[i])
  if (!hp) continue
  const j = nextNonEmptyIdx(i)
  if (j < lines.length && !isAnyHeaderToken(lines[j]) && !isCreditLike(lines[j])) {
    accepted.push({ ...hp, line: i })
  }
}

const dropLine = (l) => {
  const t = l.trim()
  if (!t) return true
  if (/^\d{1,4}$/.test(t)) return true
  if (/^Chapter \d+:/.test(t)) return true
  if (isAnyHeaderToken(t)) return true
  if (/^Figure \d/.test(t)) return true
  if (isCreditLike(t)) return true
  if (/^(Editor|Austin Lim)\b/.test(t)) return true
  return false
}
function sectionText(startLine, endLine) {
  const kept = []
  for (let i = startLine + 1; i < endLine; i++) if (!dropLine(lines[i])) kept.push(lines[i].trim())
  return kept.join(' ').replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim()
}
function leadExcerpt(text, max = 1400) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.” '), cut.lastIndexOf('.) '))
  return stop > max * 0.5 ? cut.slice(0, stop + 1) : cut.trimEnd() + '…'
}

// Build, keeping for each num the candidate that yields the most text.
const byNum = {}
for (let k = 0; k < accepted.length; k++) {
  const h = accepted[k]
  const end = k + 1 < accepted.length ? accepted[k + 1].line : lines.length
  const full = sectionText(h.line, end)
  if (!byNum[h.num] || full.length > byNum[h.num]._full) {
    byNum[h.num] = { num: h.num, title: h.title, _full: full.length, excerpt: leadExcerpt(full) }
  }
}

const missing = [...NEEDED].filter((n) => !byNum[n])
const short = [...NEEDED].filter((n) => byNum[n] && byNum[n]._full < 400)
console.log('Accepted headers:', accepted.length, '| needed present:', [...NEEDED].filter(n=>byNum[n]).length, '/', NEEDED.size)
console.log('MISSING:', missing.join(', ') || 'none')
console.log('SHORT (<400c):', short.map(n=>`${n}(${byNum[n]._full})`).join(', ') || 'none')
console.log('\nNeeded section char counts:')
console.log([...NEEDED].map(n=>byNum[n]?`${n}:${byNum[n]._full}`:`${n}:MISSING`).join('  '))

const out = {}
for (const n of NEEDED) if (byNum[n]) out[n] = { num: n, title: byNum[n].title, excerpt: byNum[n].excerpt }

// Write the app data module directly.
const header = `// ---------------------------------------------------------------------------
// PRIMARY CONTENT for Neuroscience 101 — verbatim excerpts from the open-access
// textbook "Open Neuroscience Initiative" by Austin Lim (DePaul University,
// 2021), licensed CC BY-NC 4.0. Nothing here is generated; each excerpt is the
// lead of that book section, reflowed from the source PDF. Full free book:
// https://via.library.depaul.edu/cshtextbooks/2
//
// Regenerate:  node tools/parse-oni.mjs "/path/to/Open Neuroscience Initiative.txt"
// Keyed by the book's section number; see taxonomy.js for the topic→section map.
// ---------------------------------------------------------------------------

export const ONI_BOOK = {
  title: 'Open Neuroscience Initiative',
  author: 'Austin Lim',
  publisher: 'DePaul University',
  year: 2021,
  license: 'CC BY-NC 4.0',
  url: 'https://via.library.depaul.edu/cshtextbooks/2',
}

export const ONI_CONTENT = `
const dest = new URL('../src/data/oniContent.js', import.meta.url)
fs.writeFileSync(dest, header + JSON.stringify(out, null, 2) + '\n')
console.log('Accepted headers:', accepted.length, '| needed present:', Object.keys(out).length, '/', NEEDED.size)
console.log('MISSING:', missing.join(', ') || 'none', '| SHORT:', short.join(', ') || 'none')
console.log('Wrote', Object.keys(out).length, 'sections to src/data/oniContent.js')
