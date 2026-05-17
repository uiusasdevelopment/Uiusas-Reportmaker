// UIUSAS Report Maker — app.js

let currentTheme = 'teal';
let methodStepCount = 0;
let resultCount = 0;

// ── THEME ──────────────────────────────────────────────────────────────
const themeAccents = {
  teal:    { accent: '#0d9488', accent2: '#0891b2' },
  indigo:  { accent: '#4f46e5', accent2: '#7c3aed' },
  crimson: { accent: '#dc2626', accent2: '#b91c1c' },
  amber:   { accent: '#d97706', accent2: '#b45309' },
  emerald: { accent: '#059669', accent2: '#047857' },
  slate:   { accent: '#475569', accent2: '#334155' },
  sinais:  { accent: '#059669', accent2: '#022c22' },
  nier:    { accent: '#4a4a4a', accent2: '#2a2a2a' },
};

function applyTheme(name) {
  currentTheme = name;
  document.documentElement.setAttribute('data-theme', name);
  document.querySelectorAll('.theme-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === name);
  });
  updatePreview();
}

document.getElementById('theme-picker').addEventListener('click', e => {
  const swatch = e.target.closest('.theme-swatch');
  if (swatch) applyTheme(swatch.dataset.theme);
});

// ── METHODOLOGY STEPS ──────────────────────────────────────────────────
function addMethodStep(title = '', body = '') {
  methodStepCount++;
  const id = methodStepCount;
  const container = document.getElementById('method-steps-container');
  const div = document.createElement('div');
  div.className = 'method-step';
  div.dataset.stepId = id;
  div.innerHTML = `
    <div class="method-step-header">
      <input type="text" class="step-title" placeholder="Ex: 4.${id}. Preparo dos Materiais" value="${esc(title)}">
      <button class="btn-remove-step" onclick="removeStep(this,'method-steps-container')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <textarea class="step-body" rows="3" placeholder="Descreva os procedimentos desta etapa...">${esc(body)}</textarea>
  `;
  container.appendChild(div);
  div.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', updatePreview));
  updatePreview();
}

function addResult(title = '', body = '') {
  resultCount++;
  const container = document.getElementById('results-container');
  const div = document.createElement('div');
  div.className = 'result-item';
  div.innerHTML = `
    <div class="result-item-header">
      <input type="text" class="result-title" placeholder="Ex: Ágar Manitol Salgado" value="${esc(title)}">
      <button class="btn-remove-step" onclick="removeStep(this,'results-container')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <textarea class="result-body" rows="2" placeholder="Descreva o resultado ou avaliação esperada...">${esc(body)}</textarea>
  `;
  container.appendChild(div);
  div.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', updatePreview));
  updatePreview();
}

function removeStep(btn, containerId) {
  btn.closest('.method-step, .result-item').remove();
  updatePreview();
}

document.getElementById('btn-add-step').addEventListener('click', () => addMethodStep());
document.getElementById('btn-add-result').addEventListener('click', () => addResult());

// ── INPUT LISTENERS ─────────────────────────────────────────────────────
document.querySelectorAll('input[type="text"], textarea').forEach(el => {
  el.addEventListener('input', updatePreview);
});
document.getElementById('f-show-brand').addEventListener('change', updatePreview);

// ── COLLECT DATA ─────────────────────────────────────────────────────────
function collectData() {
  const steps = [];
  document.querySelectorAll('.method-step').forEach(s => {
    steps.push({
      title: s.querySelector('.step-title').value.trim(),
      body: s.querySelector('.step-body').value.trim(),
    });
  });

  const results = [];
  document.querySelectorAll('.result-item').forEach(r => {
    results.push({
      title: r.querySelector('.result-title').value.trim(),
      body: r.querySelector('.result-body').value.trim(),
    });
  });

  return {
    title: v('f-title'),
    theme: v('f-theme'),
    date: v('f-date'),
    discipline: v('f-discipline'),
    student: v('f-student'),
    professor: v('f-professor'),
    institution: v('f-institution'),
    classGroup: v('f-class'),
    intro: v('f-intro'),
    objectives: v('f-objectives'),
    materials: v('f-materials'),
    methodSteps: steps,
    results,
    discussion: v('f-discussion'),
    conclusion: v('f-conclusion'),
    references: v('f-references'),
    colorTheme: currentTheme,
    showBrand: document.getElementById('f-show-brand').checked,
  };
}

function v(id) { return document.getElementById(id).value.trim(); }
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── BUILD LIST HTML ───────────────────────────────────────────────────────
function buildList(text) {
  if (!text) return '';
  return text.split('\n').filter(l => l.trim()).map(l => `
    <li><span class="list-bullet"></span><span>${esc(l.trim())}</span></li>
  `).join('');
}

function buildRefs(text) {
  if (!text) return '';
  return text.split('\n').filter(l => l.trim()).map((l, i) => `
    <li><span class="ref-num">[${i+1}]</span><span>${esc(l.trim())}</span></li>
  `).join('');
}

// ── RENDER REPORT ─────────────────────────────────────────────────────────
function renderReport(d) {
  const { accent, accent2 } = themeAccents[d.colorTheme] || themeAccents.teal;
  const isNier = d.colorTheme === 'nier';
  const isSinais = d.colorTheme === 'sinais';
  const showBrand = d.showBrand !== false; // defaults to true

  const studentLines = d.student ? d.student.split('\n').map(s=>s.trim()).filter(Boolean) : [];
  const studentVal = studentLines.map(esc).join('<br>');
  const studentLabel = studentLines.length > 1 ? 'Alunos' : 'Aluno(a)';

  const metaItems = [
    { label: 'Data da Prática', value: esc(d.date) },
    { label: 'Disciplina', value: esc(d.discipline) },
    { label: studentLabel, value: studentVal, isRaw: true },
    { label: 'Professor(a)', value: esc(d.professor) },
    { label: 'Instituição', value: esc(d.institution) },
    { label: 'Turma / Período', value: esc(d.classGroup) },
  ].filter(m => m.value);

  const metaHtml = metaItems.map(m => `
    <div class="report-meta-item">
      <div class="report-meta-label">${esc(m.label)}</div>
      <div class="report-meta-value">${m.isRaw ? m.value : esc(m.value)}</div>
    </div>
  `).join('');

  const stepsHtml = d.methodSteps.filter(s => s.title || s.body).map(s => `
    <div class="method-step-card">
      <div class="method-step-card-title">${esc(s.title)}</div>
      <div class="method-step-card-body">${esc(s.body)}</div>
    </div>
  `).join('');

  const resultsHtml = d.results.filter(r => r.title || r.body).map(r => `
    <div class="result-card">
      <div class="result-card-header">
        <div class="result-card-dot"></div>
        <div class="result-card-title">${esc(r.title)}</div>
      </div>
      <div class="result-card-body">${esc(r.body)}</div>
    </div>
  `).join('');

  const sectionTitle = (num, label) => `
    <h2 class="report-section-title">
      <span class="section-number-badge">${num}</span>${esc(label)}
    </h2>
  `;

  let sections = '';

  if (d.intro) sections += `
    <div class="report-section">
      ${sectionTitle('1', 'Introdução')}
      <p class="report-text">${esc(d.intro)}</p>
    </div>`;

  if (d.objectives) sections += `
    <div class="report-section">
      ${sectionTitle('2', 'Objetivos')}
      <ul class="report-list">${buildList(d.objectives)}</ul>
    </div>`;

  if (d.materials) sections += `
    <div class="report-section">
      ${sectionTitle('3', 'Materiais e Equipamentos')}
      <ul class="report-list">${buildList(d.materials)}</ul>
    </div>`;

  if (stepsHtml) sections += `
    <div class="report-section">
      ${sectionTitle('4', 'Metodologia')}
      <div class="method-steps">${stepsHtml}</div>
    </div>`;

  if (resultsHtml) sections += `
    <div class="report-section">
      ${sectionTitle('5', 'Resultados Esperados / Avaliações Subsequentes')}
      <div class="results-grid">${resultsHtml}</div>
    </div>`;

  if (d.discussion) sections += `
    <div class="report-section">
      ${sectionTitle('6', 'Discussão')}
      <p class="report-text">${esc(d.discussion)}</p>
    </div>`;

  if (d.conclusion) sections += `
    <div class="report-section">
      ${sectionTitle('7', 'Conclusão')}
      <p class="report-text">${esc(d.conclusion)}</p>
    </div>`;

  if (d.references) sections += `
    <div class="report-section">
      ${sectionTitle('8', 'Referências Bibliográficas')}
      <ul class="references-list">${buildRefs(d.references)}</ul>
    </div>`;

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });

  const footerHtml = showBrand ? `
  <div class="report-footer">
    <div class="footer-brand">Formatado por <span>UIUSAS</span> Report Maker · ${dateStr}</div>
    <div class="footer-line"></div>
  </div>` : `
  <div class="report-footer" style="justify-content: flex-end;">
    <div class="footer-brand">${dateStr}</div>
  </div>`;

  let extraCss = '';
  if (isNier) {
    extraCss = `
      body, #report-output { background: #dad4bb; color: #444; font-family: 'Arial', sans-serif; border-radius: 0; min-height: 100vh; }
      .report-cover { background: #d0c9ad; border-bottom: 2px solid #a39e86; }
      .report-cover::before { display: none; }
      .report-cover-title { color: #333; font-family: 'Arial', sans-serif; text-transform: uppercase; letter-spacing: 2px; }
      .report-cover-theme { color: #555; }
      .report-meta-item { background: transparent; border: 1px solid #a39e86; border-radius: 0; color: #444; }
      .report-meta-label { color: #666; }
      .report-meta-value { color: #333; }
      .report-section-title { color: #333; border-image: none; border-bottom: 2px solid #a39e86; }
      .section-number-badge { background: #444; color: #dad4bb; border-radius: 0; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #444; }
      .method-step-card { border: 1px solid #a39e86; border-radius: 0; border-left-width: 4px; border-left-color: #444; background: #e0dcca; }
      .method-step-card-title { background: #d0c9ad; color: #333; }
      .result-card { border: 1px solid #a39e86; border-radius: 0; background: #e0dcca; }
      .result-card-header { background: #a39e86; }
      .result-card-title { color: #fff; }
      .report-footer { background: #d0c9ad; border-top: 2px solid #a39e86; }
      .report-badge { background: #444; color: #dad4bb; border: none; border-radius: 0; }
      .list-bullet { background: #444; border-radius: 0; }
      .report-cover::after { color: rgba(0,0,0,0.03); font-family: 'Arial', sans-serif; font-weight: 900; }
    `;
  } else if (isSinais) {
    extraCss = `
      body, #report-output { background: #050505; color: #e0e0e0; min-height: 100vh; }
      .report-cover { background: radial-gradient(circle at 50% 150%, #022c22, #000); border-bottom: 1px solid #064e3b; }
      .report-cover-title { color: #fff; text-shadow: 0 0 10px rgba(5,150,105,0.5); font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; }
      .report-cover-theme { color: #a7f3d0; }
      .report-meta-item { background: rgba(5,150,105,0.05); border: 1px solid rgba(5,150,105,0.3); }
      .report-meta-label { color: #6ee7b7; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #fff; border-image: linear-gradient(90deg, #059669, transparent) 1; }
      .section-number-badge { background: #059669; color: #fff; box-shadow: 0 0 8px rgba(5,150,105,0.5); }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #d1d5db; }
      .method-step-card { border: 1px solid #1f2937; border-left-color: #059669; background: #0f172a; }
      .method-step-card-title { background: rgba(5,150,105,0.1); color: #fff; }
      .result-card { border: 1px solid #1f2937; background: #0f172a; }
      .result-card-header { background: #059669; }
      .result-card-title { color: #fff; }
      .report-footer { background: #000; border-top: 1px solid #1f2937; }
      .report-badge { background: rgba(5,150,105,0.2); border: 1px solid rgba(5,150,105,0.4); color: #a7f3d0; }
      .list-bullet { background: #10b981; }
      .ref-num { color: #10b981; }
      .report-list li { border-bottom-color: #1f2937; }
      .references-list li { border-bottom-color: #1f2937; }
    `;
  }

  return `
  <style>
    #report-output { --accent:${accent}; --accent2:${accent2}; }
    .report-cover  { background: linear-gradient(160deg, ${accent} 0%, ${accent2} 100%); }
    .section-number-badge { background: linear-gradient(135deg, ${accent}, ${accent2}); }
    .report-section-title { border-image: linear-gradient(90deg, ${accent}, transparent) 1; }
    .result-card-header { background: linear-gradient(90deg, ${accent}, ${accent2}); }
    .method-step-card { border-left-color: ${accent}; }
    .method-step-card-title { background: linear-gradient(90deg, rgba(${hexToRgb(accent)},0.07), transparent); }
    .list-bullet { background: ${accent}; }
    .ref-num { color: ${accent}; }
    .footer-line { background: linear-gradient(90deg, ${accent}, ${accent2}); }
    .footer-brand span { color: ${accent}; }
    .report-badge { background: rgba(255,255,255,0.15); }
    ${extraCss}
  </style>

  <div class="report-cover">
    <div class="report-badge">📋 Relatório de Aula Prática</div>
    <h1 class="report-cover-title">${esc(d.title || 'Relatório de Laboratório')}</h1>
    ${d.theme ? `<p class="report-cover-theme">Tema: ${esc(d.theme)}</p>` : ''}
    ${metaHtml ? `<div class="report-meta-grid">${metaHtml}</div>` : ''}
  </div>

  <div class="report-body">${sections || '<p style="color:#9ca3af;text-align:center;padding:40px 0">Preencha os campos ao lado para gerar o relatório.</p>'}</div>

  ${footerHtml}`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── UPDATE PREVIEW ────────────────────────────────────────────────────────
function updatePreview() {
  const data = collectData();
  document.getElementById('report-output').innerHTML = renderReport(data);
}

// ── EXPORT PDF ────────────────────────────────────────────────────────────
document.getElementById('btn-export').addEventListener('click', () => {
  const data = collectData();
  const reportHtml = renderReport(data);
  const title = data.title || 'Relatório de Laboratório';

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
#report-output{max-width:210mm;margin:0 auto;background:#fff;font-family:'Inter',sans-serif;color:#1a1a2a;line-height:1.7;}
.report-cover{padding:52px 48px 40px;position:relative;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.report-cover::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;}
.report-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.9);font-size:0.68rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:20px;font-family:'JetBrains Mono',monospace;}
.report-cover-title{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;color:#ffffff;line-height:1.25;margin-bottom:10px;position:relative;}
.report-cover-theme{font-size:0.92rem;color:rgba(255,255,255,0.75);font-style:italic;margin-bottom:28px;position:relative;}
.report-meta-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;position:relative;}
.report-meta-item{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px 14px;}
.report-meta-label{font-size:0.62rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);margin-bottom:3px;font-family:'JetBrains Mono',monospace;}
.report-meta-value{font-size:0.82rem;font-weight:500;color:#ffffff;}
.report-body{padding:40px 48px;}
.report-section{margin-bottom:36px;}
.report-section-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#1a1a2a;padding-bottom:10px;border-bottom:2px solid;margin-bottom:18px;display:flex;align-items:center;gap:10px;}
.section-number-badge{color:white;font-size:0.68rem;font-weight:700;font-family:'JetBrains Mono',monospace;padding:2px 8px;border-radius:4px;letter-spacing:0.05em;}
.report-text{font-size:0.9rem;line-height:1.8;color:#374151;text-align:justify;}
.report-list{list-style:none;padding:0;margin:0;}
.report-list li{display:flex;align-items:flex-start;gap:10px;padding:8px 0;font-size:0.9rem;color:#374151;border-bottom:1px solid #f3f4f6;}
.report-list li:last-child{border-bottom:none;}
.list-bullet{width:6px;height:6px;border-radius:50%;margin-top:8px;flex-shrink:0;}
.method-steps{display:flex;flex-direction:column;gap:16px;}
.method-step-card{border:1px solid #e5e7eb;border-left-width:4px;border-radius:8px;overflow:hidden;}
.method-step-card-title{padding:10px 16px;font-weight:700;font-size:0.85rem;color:#1a1a2a;}
.method-step-card-body{padding:12px 16px;font-size:0.88rem;color:#374151;line-height:1.7;}
.results-grid{display:flex;flex-direction:column;gap:12px;}
.result-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;}
.result-card-header{display:flex;align-items:center;gap:10px;padding:10px 16px;}
.result-card-dot{width:8px;height:8px;background:rgba(255,255,255,0.7);border-radius:50%;flex-shrink:0;}
.result-card-title{font-size:0.82rem;font-weight:700;color:#fff;}
.result-card-body{padding:12px 16px;font-size:0.88rem;color:#374151;line-height:1.7;}
.references-list{list-style:none;padding:0;}
.references-list li{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:0.84rem;color:#374151;line-height:1.6;}
.references-list li:last-child{border-bottom:none;}
.ref-num{font-family:'JetBrains Mono',monospace;font-size:0.72rem;font-weight:700;min-width:24px;padding-top:2px;}
.report-footer{background:#f8fafc;border-top:1px solid #e5e7eb;padding:16px 48px;display:flex;align-items:center;justify-content:space-between;}
.footer-brand{font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:#9ca3af;letter-spacing:0.1em;}
.footer-line{height:3px;width:60px;border-radius:2px;}
@page{size:A4;margin:0;}
@media print{
  html,body{width:210mm;}
  .report-section-title { page-break-after: avoid; break-after: avoid; }
  .method-step-card, .result-card { page-break-inside: avoid; break-inside: avoid; }
  .report-list li, .references-list li { page-break-inside: avoid; break-inside: avoid; }
  .report-meta-grid { page-break-inside: avoid; break-inside: avoid; }
  p, li { orphans: 3; widows: 3; }
}
</style>
</head>
<body>
<div id="report-output">${reportHtml}</div>
<script>
window.onload = function() {
  setTimeout(function() { window.print(); }, 800);
};
<\/script>
</body>
</html>`);
  win.document.close();
  showToast('✅ Janela de impressão aberta — escolha "Salvar como PDF"!', 'success');
});

// ── SAVE JSON ─────────────────────────────────────────────────────────────
document.getElementById('btn-save').addEventListener('click', () => {
  const data = collectData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('💾 Relatório salvo como JSON!', 'success');
});

// ── LOAD JSON ─────────────────────────────────────────────────────────────
document.getElementById('btn-load').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      loadData(data);
      showToast('📂 Relatório carregado com sucesso!', 'success');
    } catch {
      showToast('❌ Arquivo inválido.', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

function loadData(d) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('f-title', d.title);
  set('f-theme', d.theme);
  set('f-date', d.date);
  set('f-discipline', d.discipline);
  set('f-student', d.student);
  set('f-professor', d.professor);
  set('f-institution', d.institution);
  set('f-class', d.classGroup);
  set('f-intro', d.intro);
  set('f-objectives', d.objectives);
  set('f-materials', d.materials);
  set('f-discussion', d.discussion);
  set('f-conclusion', d.conclusion);
  set('f-references', d.references);

  const showBrandEl = document.getElementById('f-show-brand');
  if (showBrandEl) showBrandEl.checked = d.showBrand !== false;

  document.getElementById('method-steps-container').innerHTML = '';
  methodStepCount = 0;
  (d.methodSteps || []).forEach(s => addMethodStep(s.title, s.body));

  document.getElementById('results-container').innerHTML = '';
  resultCount = 0;
  (d.results || []).forEach(r => addResult(r.title, r.body));

  if (d.colorTheme) applyTheme(d.colorTheme);
  else updatePreview();
}

// ── PREVIEW TOGGLE (mobile) ───────────────────────────────────────────────
document.getElementById('btn-preview').addEventListener('click', () => {
  document.getElementById('editor-panel').style.display =
    document.getElementById('editor-panel').style.display === 'none' ? '' : 'none';
});

// ── TOAST ─────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = ''; }, 3500);
}

// ── INIT ──────────────────────────────────────────────────────────────────
(function init() {
  // Pre-fill with the example report
  document.getElementById('f-title').value = 'Relatório de Aula Prática de Microbiologia';
  document.getElementById('f-theme').value = 'Normas de Biossegurança, Esterilização de Materiais e Isolamento de Microbiota Nasal';
  document.getElementById('f-date').value = '11.05.2025';
  document.getElementById('f-discipline').value = 'Microbiologia Clínica';

  document.getElementById('f-intro').value =
    'A prática microbiológica exige o cumprimento rigoroso das normas de biossegurança (uso de jaleco, touca, calçado fechado e calças compridas) para prevenir contaminações cruzadas. A fidedignidade dos ensaios depende da esterilização prévia dos materiais, realizada por calor seco (estufa a 150°C/2h) ou úmido (autoclave a 121°C/15min).\n\nO foco clínico desta prática é o estudo da microbiota autóctone e o isolamento de Staphylococcus aureus da mucosa nasal. Cerca de 50% da população mundial atua como "portadora sã" deste patógeno, sem apresentar sintomas. Trata-se de um coco Gram-positivo, piogênico, halotolerante e fortemente produtor da enzima catalase.';

  document.getElementById('f-objectives').value =
    'Aplicar protocolos de biossegurança e assepsia.\nCompreender os processos de preparo, acondicionamento e esterilização de materiais.\nExecutar a técnica de colheita de exsudato nasal para isolamento da microbiota.\nInocular a amostra assepticamente em meio líquido enriquecido (Caldo BHI).';

  document.getElementById('f-materials').value =
    'EPIs completos (jaleco, touca, sapatos, calça).\nÁlcool a 70% e álcool iodado.\nPapel craft e papel madeira; fita adesiva e caneta.\nZaragatoa (swab) estéril.\nTubo de ensaio com Caldo BHI (Brain Heart Infusion).\nTesoura esterilizada e bico de Bunsen.\nEstufa de incubação (35°C) e equipamentos de esterilização.';

  addMethodStep('4.1. Processamento e Preparação',
    'Os materiais foram previamente embalados em papel craft (padrão clínico) ou papel madeira (padrão acadêmico), selados, rotulados e esterilizados. Na bancada, após acomodação dos pertences, realizou-se a desinfecção do espaço e das mãos com álcool 70% e iodado.');

  addMethodStep('4.2. Colheita Nasal',
    'Com o indivíduo amostrado mantendo a cabeça reclinada, o operador introduziu o swab estéril superficialmente nas narinas (alas e septo) em movimentos circulares. O silêncio foi mantido para evitar contaminação por perdigotos.');

  addMethodStep('4.3. Inoculação Asséptica',
    'No raio de segurança (20 cm) da chama do bico de Bunsen, o tubo com Caldo BHI foi destapado e sua embocadura flambada. O swab foi inserido, a haste excedente foi cortada com tesoura esterilizada, e o tubo foi novamente flambado e selado.');

  addMethodStep('4.4. Incubação',
    'O tubo foi rotulado com as iniciais do aluno, a indicação "N" (Nasal) e a data, sendo então incubado na estufa a 35°C por 18 a 24 horas.');

  addResult('Caldo BHI', 'O crescimento microbiano será evidenciado pelo surgimento de turbidez.');
  addResult('Ágar Manitol Salgado', 'Meio seletivo (alto teor de NaCl) e diferencial. Se houver S. aureus, ele fermentará o manitol, tornando o meio amarelo.');
  addResult('Prova da Catalase', 'A adição de H₂O₂ gerará efervescência caso o microrganismo possua a enzima, diferenciando Staphylococcus (+) de Streptococcus (-).');
  addResult('Ágar Sangue', 'Avaliará a produção de hemolisinas, evidenciada pela formação de halos (hemólise) em redor das colônias.');

  updatePreview();
})();
