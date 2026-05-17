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

// ── UPDATE PREVIEW ────────────────────────────────────────────────────────
let previewTimeout;
function updatePreview() {
  clearTimeout(previewTimeout);
  previewTimeout = setTimeout(() => {
    const data = collectData();
    renderPaginated(data);
  }, 150);
}

// ── RENDER PAGINATED ──────────────────────────────────────────────────────
function renderPaginated(d) {
  const { accent, accent2 } = themeAccents[d.colorTheme] || themeAccents.teal;
  const isNier = d.colorTheme === 'nier';
  const isSinais = d.colorTheme === 'sinais';
  const showBrand = d.showBrand !== false; 

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
      <div class="report-meta-value">${m.isRaw ? m.value : m.value}</div>
    </div>
  `).join('');

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });

  // Array of HTML blocks
  const blocks = [];

  blocks.push(`
  <div class="report-cover">
    <div class="report-badge">📋 Relatório de Aula Prática</div>
    <h1 class="report-cover-title">${esc(d.title || 'Relatório de Laboratório')}</h1>
    ${d.theme ? `<p class="report-cover-theme">Tema: ${esc(d.theme)}</p>` : ''}
    ${metaHtml ? `<div class="report-meta-grid">${metaHtml}</div>` : ''}
  </div>`);

  const sectionTitle = (num, label) => `
    <h2 class="report-section-title" style="margin-top: 24px; margin-bottom: 16px;">
      <span class="section-number-badge">${num}</span>${esc(label)}
    </h2>
  `;

  if (d.intro) {
    blocks.push(sectionTitle('1', 'Introdução'));
    d.intro.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.objectives) {
    blocks.push(sectionTitle('2', 'Objetivos'));
    blocks.push(`<ul class="report-list" style="margin-bottom: 24px;">${buildList(d.objectives)}</ul>`);
  }

  if (d.materials) {
    blocks.push(sectionTitle('3', 'Materiais e Equipamentos'));
    blocks.push(`<ul class="report-list" style="margin-bottom: 24px;">${buildList(d.materials)}</ul>`);
  }

  if (d.methodSteps && d.methodSteps.length > 0) {
    blocks.push(sectionTitle('4', 'Metodologia'));
    d.methodSteps.forEach(s => {
      if(s.title || s.body) {
        blocks.push(`
        <div class="method-step-card" style="margin-bottom: 16px;">
          <div class="method-step-card-title">${esc(s.title)}</div>
          <div class="method-step-card-body">${esc(s.body)}</div>
        </div>`);
      }
    });
  }

  if (d.results && d.results.length > 0) {
    blocks.push(sectionTitle('5', 'Resultados / Avaliações'));
    d.results.forEach(r => {
      if(r.title || r.body) {
        blocks.push(`
        <div class="result-card" style="margin-bottom: 12px;">
          <div class="result-card-header">
            <div class="result-card-dot"></div>
            <div class="result-card-title">${esc(r.title)}</div>
          </div>
          <div class="result-card-body">${esc(r.body)}</div>
        </div>`);
      }
    });
  }

  if (d.discussion) {
    blocks.push(sectionTitle('6', 'Discussão'));
    d.discussion.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.conclusion) {
    blocks.push(sectionTitle('7', 'Conclusão'));
    d.conclusion.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.references) {
    blocks.push(sectionTitle('8', 'Referências'));
    blocks.push(`<ul class="references-list" style="margin-bottom: 24px;">${buildRefs(d.references)}</ul>`);
  }

  // --- Theme Overrides ---
  let pageBg = '#ffffff';
  let pageText = '#1a1a2a';
  let extraCss = '';

  if (isNier) {
    pageBg = '#dad4bb'; pageText = '#444';
    extraCss = `
      body, .a4-page { background: #dad4bb !important; color: #444; font-family: 'Arial', sans-serif; border-radius: 0; }
      .report-cover { background: #d0c9ad; border-bottom: 2px solid #a39e86; }
      .report-cover::before { display: none; }
      .report-cover-title { color: #333; font-family: 'Arial', sans-serif; text-transform: uppercase; letter-spacing: 2px; }
      .report-cover-theme { color: #555; }
      .report-meta-item { background: transparent; border: 1px solid #a39e86; border-radius: 0; color: #444; }
      .report-meta-label { color: #666; }
      .report-meta-value { color: #333; }
      .report-section-title { color: #333; border-image: none !important; border-bottom: 2px solid #a39e86; }
      .section-number-badge { background: #444 !important; color: #dad4bb; border-radius: 0; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #444; }
      .method-step-card { border: 1px solid #a39e86; border-radius: 0; border-left-width: 4px; border-left-color: #444 !important; background: #e0dcca; }
      .method-step-card-title { background: #d0c9ad !important; color: #333; }
      .result-card { border: 1px solid #a39e86; border-radius: 0; background: #e0dcca; }
      .result-card-header { background: #a39e86 !important; }
      .result-card-title { color: #fff; }
      .report-footer { background: #d0c9ad; border-top: 2px solid #a39e86; }
      .report-badge { background: #444 !important; color: #dad4bb; border: none; border-radius: 0; }
      .list-bullet { background: #444 !important; border-radius: 0; }
      .ref-num { color: #444 !important; }
    `;
  } else if (isSinais) {
    pageBg = '#050505'; pageText = '#e0e0e0';
    extraCss = `
      body, .a4-page { background: #050505 !important; color: #e0e0e0; }
      .report-cover { background: radial-gradient(circle at 50% 150%, #022c22, #000); border-bottom: 1px solid #064e3b; }
      .report-cover-title { color: #fff; text-shadow: 0 0 10px rgba(5,150,105,0.5); font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; }
      .report-cover-theme { color: #a7f3d0; }
      .report-meta-item { background: rgba(5,150,105,0.05); border: 1px solid rgba(5,150,105,0.3); }
      .report-meta-label { color: #6ee7b7; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #fff; }
      .section-number-badge { box-shadow: 0 0 8px rgba(5,150,105,0.5); }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #d1d5db; }
      .method-step-card { border: 1px solid #1f2937; background: #0f172a; }
      .method-step-card-title { color: #fff; }
      .result-card { border: 1px solid #1f2937; background: #0f172a; }
      .result-card-title { color: #fff; }
      .report-footer { background: #000; border-top: 1px solid #1f2937; }
      .report-badge { border: 1px solid rgba(5,150,105,0.4); color: #a7f3d0; }
      .report-list li { border-bottom-color: #1f2937; }
      .references-list li { border-bottom-color: #1f2937; }
    `;
  }

  const baseCss = `
    .a4-page { --accent:${accent}; --accent2:${accent2}; }
    .report-cover { background: linear-gradient(160deg, ${accent} 0%, ${accent2} 100%); }
    .section-number-badge { background: linear-gradient(135deg, ${accent}, ${accent2}); color: #fff; font-size: 0.68rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.05em; margin-right: 10px; }
    .report-section-title { border-bottom: 2px solid; border-image: linear-gradient(90deg, ${accent}, transparent) 1; padding-bottom: 10px; font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; color: #1a1a2a; display: flex; align-items: center; }
    .result-card-header { background: linear-gradient(90deg, ${accent}, ${accent2}); display: flex; align-items: center; gap: 10px; padding: 10px 16px; }
    .method-step-card { border: 1px solid #e5e7eb; border-left: 4px solid ${accent}; border-radius: 8px; overflow: hidden; }
    .method-step-card-title { background: linear-gradient(90deg, rgba(${hexToRgb(accent)},0.07), transparent); padding: 10px 16px; font-weight: 700; font-size: 0.85rem; color: #1a1a2a; }
    .list-bullet { background: ${accent}; width: 6px; height: 6px; border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
    .ref-num { color: ${accent}; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; min-width: 24px; padding-top: 2px; }
    .footer-line { background: linear-gradient(90deg, ${accent}, ${accent2}); height: 3px; width: 60px; border-radius: 2px; }
    .footer-brand span { color: ${accent}; }
    .report-badge { background: rgba(255,255,255,0.15); display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.9); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; font-family: 'JetBrains Mono', monospace; }
    ${extraCss}
  `;

  // Update global styles for the preview
  let styleEl = document.getElementById('dynamic-theme');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-theme';
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = baseCss;

  // --- Pagination Logic ---
  const measureBox = document.getElementById('measure-box');
  measureBox.innerHTML = blocks.join('');
  
  const output = document.getElementById('report-output');
  output.innerHTML = '';

  const createPage = () => {
    const p = document.createElement('div');
    p.className = 'a4-page';
    p.style.setProperty('--page-bg', pageBg);
    p.style.setProperty('--page-text', pageText);
    
    const content = document.createElement('div');
    content.className = 'page-content';
    p.appendChild(content);

    // Footer
    const footerHtml = showBrand ? `
      <div class="report-footer" style="background: transparent; padding: 16px 48px; display: flex; align-items: center; justify-content: space-between; position: absolute; bottom: 0; left: 0; right: 0; border-top: 1px solid rgba(150,150,150,0.2);">
        <div class="footer-brand" style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #9ca3af; letter-spacing: 0.1em;">Formatado por <span>UIUSAS</span> Report Maker · ${dateStr}</div>
        <div class="footer-line"></div>
      </div>` : `
      <div class="report-footer" style="background: transparent; padding: 16px 48px; display: flex; align-items: center; justify-content: flex-end; position: absolute; bottom: 0; left: 0; right: 0; border-top: 1px solid rgba(150,150,150,0.2);">
        <div class="footer-brand" style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #9ca3af; letter-spacing: 0.1em;">${dateStr}</div>
      </div>`;
    
    p.insertAdjacentHTML('beforeend', footerHtml);
    return p;
  };

  let currentPage = createPage();
  output.appendChild(currentPage);
  let contentArea = currentPage.querySelector('.page-content');

  // Move elements one by one, checking for overflow
  const children = Array.from(measureBox.children);
  for (let el of children) {
    contentArea.appendChild(el);
    
    // Check overflow. We leave some margin for the footer (~60px)
    if (contentArea.scrollHeight > contentArea.clientHeight - 60) {
      contentArea.removeChild(el); // Too big for this page
      
      currentPage = createPage();
      output.appendChild(currentPage);
      contentArea = currentPage.querySelector('.page-content');
      
      contentArea.appendChild(el); // Add to new page
    }
  }
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
  const title = document.getElementById('f-title').value.trim() || 'Relatório de Laboratório';
  
  // Pegamos o HTML já paginado na tela!
  const reportHtml = document.getElementById('report-output').innerHTML;
  const styleHtml = document.getElementById('dynamic-theme') ? document.getElementById('dynamic-theme').innerHTML : '';

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:transparent;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.report-list{list-style:none;padding:0;margin:0;}
.report-list li{display:flex;align-items:flex-start;gap:10px;padding:8px 0;font-size:0.9rem;color:#374151;border-bottom:1px solid rgba(150,150,150,0.1);}
.report-list li:last-child{border-bottom:none;}
.references-list{list-style:none;padding:0;}
.references-list li{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid rgba(150,150,150,0.1);font-size:0.84rem;color:#374151;line-height:1.6;}
.references-list li:last-child{border-bottom:none;}
.report-meta-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;position:relative;}
.report-meta-item{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px 14px;}
.report-meta-label{font-size:0.62rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);margin-bottom:3px;font-family:'JetBrains Mono',monospace;}
.report-meta-value{font-size:0.82rem;font-weight:500;color:#ffffff;}
.report-text{font-size:0.9rem;line-height:1.8;color:#374151;text-align:justify;white-space:pre-wrap;}
.report-cover::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;}

${styleHtml}

@page{size:A4;margin:0;}
@media print{
  html,body{width:210mm; background:transparent !important;}
  .a4-page { box-shadow: none !important; margin: 0 !important; page-break-after: always; break-after: page; width: 210mm; height: 297mm; overflow: hidden; position: relative; }
  .page-content { padding: 40px 48px; }
  .report-cover { margin: -40px -48px 36px -48px; padding: 52px 48px 40px; position: relative; }
}
</style>
</head>
<body>
${reportHtml}
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
