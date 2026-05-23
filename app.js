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
  caderno: { accent: '#2563eb', accent2: '#1d4ed8' },
  moderno: { accent: '#3b82f6', accent2: '#2563eb' },
  'belle-epoque': { accent: '#8b6b4a', accent2: '#5c432d' },
  cyberpunk: { accent: '#00f0ff', accent2: '#00b3cc' },
  minimalista: { accent: '#1a1a1a', accent2: '#000000' },
  'resident-evil': { accent: '#ffffff', accent2: '#cccccc' },
  'clair-obscur': { accent: '#b78f61', accent2: '#8b6842' },
  pokemon: { accent: '#00ffaa', accent2: '#00cc88' },
  'pokemon-sword': { accent: '#e03a5f', accent2: '#b02a48' },
  silksong: { accent: '#dbb258', accent2: '#a8863f' },
  hexatombe: { accent: '#ff2a2a', accent2: '#cc2222' },
  sinais:  { accent: '#00ffaa', accent2: '#00cc88' },
  nier:    { accent: '#4a4a4a', accent2: '#2a2a2a' },
  'vintage-med': { accent: '#c0392b', accent2: '#8b0000' },
  netter:  { accent: '#8b6b4a', accent2: '#2a221b' },
  hitech:  { accent: '#00f0ff', accent2: '#0088ff' },
  pipboy:  { accent: '#4aff4a', accent2: '#2ecc2e' },
  bloodborne: { accent: '#5e0000', accent2: '#8b0000' },
  tlou:    { accent: '#788a63', accent2: '#4a5d23' },
  genshin: { accent: '#8b7355', accent2: '#d4a351' },
  grimorio: { accent: '#8b0000', accent2: '#f4c430' },
  taverna: { accent: '#8b4513', accent2: '#b8860b' },
  vaporwave: { accent: '#00ffff', accent2: '#ff00ff' },
  steampunk: { accent: '#d2691e', accent2: '#cd853f' }
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

function addResult(title = '', body = '', base64Img = '') {
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
    <div class="result-image-uploader" style="margin-top: 8px;">
      <input type="file" accept="image/*" class="result-img-input" style="display:none">
      <input type="hidden" class="result-img-base64" value="${base64Img}">
      <button class="btn-ghost btn-upload-img" style="font-size: 0.8rem; padding: 4px 8px;">📎 Adicionar Imagem</button>
      <div class="img-preview-box" style="margin-top: 8px; position: relative; display: ${base64Img ? 'inline-block' : 'none'};">
        <img class="img-preview-el" src="${base64Img}" style="max-width: 100%; max-height: 150px; border-radius: 4px; border: 1px solid rgba(150,150,150,0.2);">
        <button class="btn-remove-img" style="position: absolute; top: -8px; right: -8px; background: #dc2626; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; padding: 0;">X</button>
      </div>
    </div>
  `;
  container.appendChild(div);

  const fileInput = div.querySelector('.result-img-input');
  const base64Input = div.querySelector('.result-img-base64');
  const btnUpload = div.querySelector('.btn-upload-img');
  const btnRemove = div.querySelector('.btn-remove-img');
  const imgPreviewBox = div.querySelector('.img-preview-box');
  const imgPreviewEl = div.querySelector('.img-preview-el');

  btnUpload.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const b64 = evt.target.result;
        base64Input.value = b64;
        imgPreviewEl.src = b64;
        imgPreviewBox.style.display = 'inline-block';
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  btnRemove.addEventListener('click', () => {
    base64Input.value = '';
    imgPreviewEl.src = '';
    imgPreviewBox.style.display = 'none';
    fileInput.value = '';
    updatePreview();
  });

  div.querySelectorAll('input[type="text"],textarea').forEach(el => el.addEventListener('input', updatePreview));
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
      image: r.querySelector('.result-img-base64').value
    });
  });

  return {
    docType: v('f-doc-type'),
    title: v('f-title'),
    theme: v('f-theme'),
    date: v('f-date'),
    discipline: v('f-discipline'),
    student: v('f-student'),
    professor: v('f-professor'),
    institution: v('f-institution'),
    classGroup: v('f-class'),
    intro: v('f-intro'),
    introTitle: v('f-intro-title'),
    objectives: v('f-objectives'),
    objTitle: v('f-obj-title'),
    materials: v('f-materials'),
    matTitle: v('f-mat-title'),
    methodSteps: steps,
    methTitle: v('f-meth-title'),
    results,
    resTitle: v('f-res-title'),
    discussion: v('f-discussion'),
    discTitle: v('f-disc-title'),
    conclusion: v('f-conclusion'),
    concTitle: v('f-conc-title'),
    references: v('f-references'),
    refTitle: v('f-ref-title'),
    colorTheme: currentTheme,
    showBrand: document.getElementById('f-show-brand').checked,
  };
}

function v(id) { 
  const el = document.getElementById(id); 
  return el ? el.value.trim() : ''; 
}
function esc(s) { return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

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
    <div class="report-badge">📋 ${esc(d.docType || 'RELATÓRIO DE AULA PRÁTICA')}</div>
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
    blocks.push(sectionTitle('1', d.introTitle || 'Introdução'));
    d.intro.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.objectives) {
    blocks.push(sectionTitle('2', d.objTitle || 'Objetivos'));
    blocks.push(`<ul class="report-list" style="margin-bottom: 24px;">${buildList(d.objectives)}</ul>`);
  }

  if (d.materials) {
    blocks.push(sectionTitle('3', d.matTitle || 'Materiais e Equipamentos'));
    blocks.push(`<ul class="report-list" style="margin-bottom: 24px;">${buildList(d.materials)}</ul>`);
  }

  if (d.methodSteps && d.methodSteps.length > 0) {
    blocks.push(sectionTitle('4', d.methTitle || 'Metodologia'));
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
    blocks.push(sectionTitle('5', d.resTitle || 'Resultados / Avaliações'));
    d.results.forEach(r => {
      if(r.title || r.body || r.image) {
        blocks.push(`
        <div class="result-card" style="margin-bottom: 16px;">
          <div class="result-card-header">
            <div class="result-card-dot"></div>
            <div class="result-card-title">${esc(r.title)}</div>
          </div>
          ${r.body ? `<div class="result-card-body">${esc(r.body)}</div>` : ''}
          ${r.image ? `<div class="result-card-image" style="margin-top: 12px; text-align: center;"><img src="${r.image}" style="max-width: 100%; max-height: 350px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid rgba(150,150,150,0.1);"></div>` : ''}
        </div>`);
      }
    });
  }

  if (d.discussion) {
    blocks.push(sectionTitle('6', d.discTitle || 'Discussão'));
    d.discussion.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.conclusion) {
    blocks.push(sectionTitle('7', d.concTitle || 'Conclusão'));
    d.conclusion.split('\n\n').forEach(p => {
      if(p.trim()) blocks.push(`<p class="report-text" style="margin-bottom: 12px;">${esc(p)}</p>`);
    });
  }

  if (d.references) {
    blocks.push(sectionTitle('8', d.refTitle || 'Referências Bibliográficas'));
    blocks.push(`<ul class="references-list" style="margin-bottom: 24px;">${buildRefs(d.references)}</ul>`);
  }

  // --- Theme Overrides ---
  let pageBg = '#ffffff';
  let pageText = '#1a1a2a';
  let extraCss = '';

  const theme = d.colorTheme;

  if (theme === 'nier') {
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
  } else if (theme === 'sinais') {
    pageBg = '#031109'; pageText = '#d4e8d9';
    extraCss = `
      body, .a4-page { background-color: #031109 !important; background: url('assets/bg-sinais.png') center/cover no-repeat; color: #d4e8d9; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; box-shadow: inset 0 0 160px rgba(0, 5, 2, 0.95); pointer-events:none; z-index:0; }
      .report-cover { background: transparent; border-bottom: none; position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; }
      .report-badge { border: 1px solid rgba(45, 226, 123, 0.3); color: #2de27b; background: rgba(3, 17, 9, 0.7); border-radius: 5px; }
      .report-cover-title { color: #ffffff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(45, 226, 123, 0.9), 0 0 50px rgba(45, 226, 123, 0.6); font-family: 'Adobe Hebrew', 'Times New Roman', serif; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; font-size: 2.2rem; }
      .report-cover-theme { color: #a3e0bd; font-family: 'Inter', sans-serif; font-weight: 300; letter-spacing: 5px; text-transform: uppercase; background: rgba(3, 17, 9, 0.5); padding: 5px 15px; border-radius: 8px; display: inline-block; }
      .report-meta-grid { width: 100%; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
      .report-meta-item { background: rgba(3, 17, 9, 0.7); border: 1px solid rgba(45, 226, 123, 0.3); border-radius: 8px; backdrop-filter: blur(4px); box-shadow: 0 0 20px rgba(0, 0, 0, 0.9); width: 100%; text-align: center; }
      .report-meta-label { color: #2de27b; }
      .report-meta-value { color: #ffffff; }
      .report-section-title { color: #ffffff; font-family: 'Adobe Hebrew', 'Times New Roman', serif; border-image: none !important; border-bottom: 1px solid rgba(45, 226, 123, 0.3); position: relative; z-index: 1; }
      .section-number-badge { box-shadow: 0 0 15px rgba(45, 226, 123, 0.5); background: #2de27b !important; color: #030805; }
      .method-step-card, .result-card { background: rgba(5, 15, 10, 0.85); border: 1px solid rgba(45, 226, 123, 0.3); position: relative; z-index: 1; border-radius: 8px; }
      .method-step-card-title { color: #2de27b; background: rgba(3, 17, 9, 0.9) !important; font-family: 'Inter', sans-serif; }
      .result-card-header { background: rgba(3, 17, 9, 0.9) !important; border-bottom: 1px solid rgba(45, 226, 123, 0.2); }
      .result-card-title { color: #2de27b; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #d4e8d9; position: relative; z-index: 1; border-bottom-color: rgba(45, 226, 123, 0.1); }
      .report-footer { background: rgba(3, 17, 9, 0.9); border-top: 1px solid rgba(45, 226, 123, 0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'vintage-med') {
    pageBg = '#f5f0e6'; pageText = '#2c3e50';
    extraCss = `
      body, .a4-page { background-color: #f5f0e6 !important; background-image: repeating-linear-gradient(transparent, transparent 31px, #a0d8ef 31px, #a0d8ef 32px); background-size: 100% 32px; color: #2c3e50; font-family: 'Special Elite', monospace; }
      .report-cover { border-bottom: 2px solid #2980b9; text-align: center; }
      .report-badge { border: 2px solid #2980b9; color: #c0392b; border-radius: 5px; }
      .report-cover-title { color: #8b0000; font-family: 'Special Elite', monospace; text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-size: 2.2rem; }
      .report-cover-theme { color: #c0392b; font-family: 'Special Elite', monospace; font-weight: 600; }
      .report-meta-item { background: rgba(255, 255, 255, 0.5); border: 1px solid #2980b9; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; text-align: center; }
      .report-meta-label { color: #c0392b; }
      .report-meta-value { color: #2c3e50; }
      .report-section-title { color: #8b0000; font-family: 'Special Elite', monospace; border-bottom: 2px solid #2980b9; }
      .section-number-badge { box-shadow: 0 4px 6px rgba(0,0,0,0.1); background: #c0392b !important; color: #fff; }
      .method-step-card, .result-card { background: rgba(255, 255, 255, 0.7); border: 1px solid #2980b9; border-radius: 5px; }
      .method-step-card-title, .result-card-header { background: rgba(255, 255, 255, 0.9) !important; color: #c0392b; border-bottom: 1px solid #2980b9; font-family: 'Special Elite', monospace; }
      .result-card-title { color: #c0392b; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #2c3e50; border-bottom-color: #a0d8ef; }
      .report-footer { background: #f5f0e6; border-top: 2px solid #2980b9; }
    `;
  } else if (theme === 'netter') {
    pageBg = '#f9f6f0'; pageText = '#3e3832';
    extraCss = `
      body, .a4-page { background-color: #f9f6f0 !important; background-image: radial-gradient(#d4c5b3 1px, transparent 1px); background-size: 20px 20px; color: #3e3832; font-family: 'Inter', sans-serif; }
      .report-cover { border-bottom: 2px solid #8b6b4a; text-align: center; }
      .report-badge { border: 2px solid #d4c5b3; color: #8b6b4a; border-radius: 5px; }
      .report-cover-title { color: #2a221b; font-family: 'Playfair Display', serif; font-size: 2.2rem; }
      .report-cover-theme { color: #8b6b4a; font-family: 'Inter', sans-serif; }
      .report-meta-item { background: rgba(255, 255, 255, 0.5); border: 1px solid #d4c5b3; border-radius: 5px; width: 100%; text-align: center; }
      .report-meta-label { color: #8b6b4a; }
      .report-meta-value { color: #3e3832; }
      .report-section-title { color: #2a221b; font-family: 'Playfair Display', serif; border-bottom: 2px solid #d4c5b3; }
      .section-number-badge { background: #8b6b4a !important; color: #fff; }
      .method-step-card, .result-card { background: rgba(255, 255, 255, 0.7); border: 1px solid #d4c5b3; border-radius: 5px; }
      .method-step-card-title, .result-card-header { background: rgba(255, 255, 255, 0.9) !important; color: #8b6b4a; border-bottom: 1px solid #d4c5b3; }
      .result-card-title { color: #8b6b4a; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #3e3832; border-bottom-color: #d4c5b3; }
      .report-footer { background: #f9f6f0; border-top: 2px solid #d4c5b3; }
    `;
  } else if (theme === 'hitech') {
    pageBg = '#0a1128'; pageText = '#e0e7ff';
    extraCss = `
      body, .a4-page { background-color: #0a1128 !important; background-image: linear-gradient(0deg, transparent 24%, rgba(0, 240, 255, 0.1) 25%, rgba(0, 240, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.1) 75%, rgba(0, 240, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 240, 255, 0.1) 25%, rgba(0, 240, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.1) 75%, rgba(0, 240, 255, 0.1) 76%, transparent 77%, transparent); background-size: 40px 40px; color: #e0e7ff; font-family: 'Inter', sans-serif; }
      .report-cover { border-bottom: 2px solid #0088ff; text-align: center; }
      .report-badge { border: 2px solid #0088ff; color: #00f0ff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 240, 255, 0.3); }
      .report-cover-title { color: #00f0ff; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 10px rgba(0, 240, 255, 0.5); font-size: 2.2rem; }
      .report-cover-theme { color: #00f0ff; font-family: 'Inter', sans-serif; }
      .report-meta-item { background: rgba(10, 17, 40, 0.8); border: 1px solid #0088ff; border-radius: 5px; width: 100%; text-align: center; box-shadow: 0 0 10px rgba(0, 136, 255, 0.2); }
      .report-meta-label { color: #00f0ff; }
      .report-meta-value { color: #e0e7ff; }
      .report-section-title { color: #00f0ff; font-family: 'Orbitron', sans-serif; border-bottom: 2px solid #0088ff; text-shadow: 0 0 5px rgba(0, 240, 255, 0.3); }
      .section-number-badge { background: #0088ff !important; color: #fff; box-shadow: 0 0 10px rgba(0, 136, 255, 0.5); }
      .method-step-card, .result-card { background: rgba(10, 17, 40, 0.8); border: 1px solid #0088ff; border-radius: 5px; }
      .method-step-card-title, .result-card-header { background: rgba(0, 136, 255, 0.2) !important; color: #00f0ff; border-bottom: 1px solid #0088ff; font-family: 'Orbitron', sans-serif; }
      .result-card-title { color: #00f0ff; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #e0e7ff; border-bottom-color: rgba(0, 136, 255, 0.3); }
      .report-footer { background: #0a1128; border-top: 2px solid #0088ff; }
    `;
  } else if (theme === 'pipboy') {
    pageBg = '#051405'; pageText = '#4aff4a';
    extraCss = `
      body, .a4-page { background-color: #051405 !important; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74, 255, 74, 0.05) 2px, rgba(74, 255, 74, 0.05) 4px); background-size: 100% 4px; color: #4aff4a; font-family: 'Courier New', monospace; text-shadow: 0 0 2px #4aff4a; }
      .report-cover { border-bottom: 2px solid #4aff4a; text-align: center; }
      .report-badge { border: 2px solid #4aff4a; color: #4aff4a; border-radius: 0; box-shadow: 0 0 5px #4aff4a; background: #051405; }
      .report-cover-title { color: #4aff4a; font-family: 'Courier New', monospace; text-shadow: 0 0 8px #4aff4a; font-size: 2.2rem; }
      .report-cover-theme { color: #4aff4a; font-family: 'Courier New', monospace; }
      .report-meta-item { background: #051405; border: 1px solid #4aff4a; border-radius: 0; width: 100%; text-align: center; box-shadow: 0 0 5px #4aff4a; }
      .report-meta-label { color: #4aff4a; font-weight: bold; }
      .report-meta-value { color: #4aff4a; }
      .report-section-title { color: #4aff4a; font-family: 'Courier New', monospace; border-bottom: 2px solid #4aff4a; text-shadow: 0 0 5px #4aff4a; }
      .section-number-badge { background: #4aff4a !important; color: #051405; box-shadow: 0 0 5px #4aff4a; border-radius: 0; }
      .method-step-card, .result-card { background: #051405; border: 1px solid #4aff4a; border-radius: 0; box-shadow: 0 0 5px rgba(74, 255, 74, 0.2); }
      .method-step-card-title, .result-card-header { background: rgba(74, 255, 74, 0.1) !important; color: #4aff4a; border-bottom: 1px solid #4aff4a; font-family: 'Courier New', monospace; }
      .result-card-title { color: #4aff4a; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #4aff4a; border-bottom-color: rgba(74, 255, 74, 0.3); }
      .report-footer { background: #051405; border-top: 2px solid #4aff4a; }
    `;
  } else if (theme === 'bloodborne') {
    pageBg = '#1a1515'; pageText = '#c0b0a0';
    extraCss = `
      body, .a4-page { background-color: #1a1515 !important; color: #c0b0a0; font-family: 'Playfair Display', serif; }
      .report-cover { border-bottom: 2px solid #5e0000; text-align: center; }
      .report-badge { border: 2px solid #5e0000; color: #8b0000; border-radius: 0; background: transparent; }
      .report-cover-title { color: #8b0000; font-family: 'Cinzel', serif; font-size: 2.2rem; }
      .report-cover-theme { color: #5e0000; font-family: 'Playfair Display', serif; }
      .report-meta-item { background: #1a1515; border: 1px solid #5e0000; border-radius: 0; width: 100%; text-align: center; }
      .report-meta-label { color: #8b0000; }
      .report-meta-value { color: #c0b0a0; }
      .report-section-title { color: #8b0000; font-family: 'Cinzel', serif; border-bottom: 2px solid #5e0000; }
      .section-number-badge { background: #5e0000 !important; color: #c0b0a0; border-radius: 0; }
      .method-step-card, .result-card { background: #1a1515; border: 1px solid #5e0000; border-radius: 0; }
      .method-step-card-title, .result-card-header { background: #261b1b !important; color: #8b0000; border-bottom: 1px solid #5e0000; font-family: 'Cinzel', serif; }
      .result-card-title { color: #8b0000; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #c0b0a0; border-bottom-color: #5e0000; }
      .report-footer { background: #1a1515; border-top: 2px solid #5e0000; }
    `;
  } else if (theme === 'tlou') {
    pageBg = '#2a2d24'; pageText = '#b0c4b1';
    extraCss = `
      body, .a4-page { background-color: #2a2d24 !important; background-image: radial-gradient(circle, #1f221a 0%, transparent 60%); color: #b0c4b1; font-family: 'Inter', sans-serif; }
      .report-cover { border-bottom: 2px solid #4a5d23; text-align: center; }
      .report-badge { border: 2px solid #4a5d23; color: #d4e09b; border-radius: 5px; background: rgba(31, 34, 26, 0.8); }
      .report-cover-title { color: #d4e09b; font-family: 'Impact', sans-serif; font-size: 2.5rem; letter-spacing: 2px; }
      .report-cover-theme { color: #788a63; font-family: 'Inter', sans-serif; }
      .report-meta-item { background: rgba(31, 34, 26, 0.8); border: 1px solid #4a5d23; border-radius: 5px; width: 100%; text-align: center; }
      .report-meta-label { color: #d4e09b; }
      .report-meta-value { color: #b0c4b1; }
      .report-section-title { color: #d4e09b; font-family: 'Impact', sans-serif; border-bottom: 2px solid #4a5d23; letter-spacing: 1px; }
      .section-number-badge { background: #4a5d23 !important; color: #fff; }
      .method-step-card, .result-card { background: rgba(31, 34, 26, 0.8); border: 1px solid #4a5d23; border-radius: 5px; }
      .method-step-card-title, .result-card-header { background: rgba(74, 93, 35, 0.2) !important; color: #d4e09b; border-bottom: 1px solid #4a5d23; }
      .result-card-title { color: #d4e09b; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #b0c4b1; border-bottom-color: rgba(74, 93, 35, 0.3); }
      .report-footer { background: #2a2d24; border-top: 2px solid #4a5d23; }
    `;
  } else if (theme === 'genshin') {
    pageBg = '#faf5eb'; pageText = '#595349';
    extraCss = `
      body, .a4-page { background-color: #faf5eb !important; background-image: radial-gradient(circle, #d4a351 1px, transparent 1px); background-size: 30px 30px; color: #595349; font-family: 'Inter', sans-serif; }
      .report-cover { border-bottom: 2px solid #d4a351; text-align: center; }
      .report-badge { border: 2px solid #d4a351; color: #8b7355; border-radius: 20px; background: #fff; }
      .report-cover-title { color: #d4a351; font-family: 'Cinzel', serif; font-size: 2.2rem; }
      .report-cover-theme { color: #8b7355; font-family: 'Inter', sans-serif; }
      .report-meta-item { background: rgba(255, 255, 255, 0.8); border: 1px solid #d4a351; border-radius: 10px; width: 100%; text-align: center; box-shadow: 0 0 10px rgba(212, 163, 81, 0.1); }
      .report-meta-label { color: #d4a351; }
      .report-meta-value { color: #595349; }
      .report-section-title { color: #d4a351; font-family: 'Cinzel', serif; border-bottom: 2px solid #d4a351; }
      .section-number-badge { background: #d4a351 !important; color: #fff; border-radius: 50%; }
      .method-step-card, .result-card { background: rgba(255, 255, 255, 0.8); border: 1px solid #d4a351; border-radius: 10px; }
      .method-step-card-title, .result-card-header { background: rgba(212, 163, 81, 0.1) !important; color: #8b7355; border-bottom: 1px solid #d4a351; font-family: 'Cinzel', serif; }
      .result-card-title { color: #8b7355; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #595349; border-bottom-color: rgba(212, 163, 81, 0.2); }
      .report-footer { background: #faf5eb; border-top: 2px solid #d4a351; }
    `;
  } else if (theme === 'grimorio') {
    pageBg = '#4a3b2c'; pageText = '#e8dcc4';
    extraCss = `
      body, .a4-page { background-color: #4a3b2c !important; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px); color: #e8dcc4; font-family: 'Playfair Display', serif; }
      .report-cover { border-bottom: 2px solid #8b0000; text-align: center; }
      .report-badge { border: 2px solid #8b0000; color: #f4c430; border-radius: 0; background: #3a2b1c; }
      .report-cover-title { color: #f4c430; font-family: 'Metal Mania', cursive; font-size: 2.8rem; letter-spacing: 2px; }
      .report-cover-theme { color: #8b0000; font-family: 'Playfair Display', serif; }
      .report-meta-item { background: #3a2b1c; border: 1px solid #8b0000; border-radius: 0; width: 100%; text-align: center; box-shadow: 0 0 10px rgba(244, 196, 48, 0.2); }
      .report-meta-label { color: #f4c430; }
      .report-meta-value { color: #e8dcc4; }
      .report-section-title { color: #f4c430; font-family: 'Metal Mania', cursive; border-bottom: 2px solid #8b0000; }
      .section-number-badge { background: #8b0000 !important; color: #f4c430; border-radius: 0; }
      .method-step-card, .result-card { background: #3a2b1c; border: 1px solid #8b0000; border-radius: 0; }
      .method-step-card-title, .result-card-header { background: rgba(139, 0, 0, 0.2) !important; color: #f4c430; border-bottom: 1px solid #8b0000; font-family: 'Metal Mania', cursive; }
      .result-card-title { color: #f4c430; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #e8dcc4; border-bottom-color: rgba(139, 0, 0, 0.3); }
      .report-footer { background: #4a3b2c; border-top: 2px solid #8b0000; }
    `;
  } else if (theme === 'taverna') {
    pageBg = '#5c4033'; pageText = '#f0e6d2';
    extraCss = `
      body, .a4-page { background-color: #5c4033 !important; color: #f0e6d2; font-family: 'Inter', sans-serif; }
      .report-cover { border-bottom: 2px solid #8b4513; text-align: center; }
      .report-badge { border: 2px solid #8b4513; color: #b8860b; border-radius: 5px; background: #4a332a; }
      .report-cover-title { color: #b8860b; font-family: 'Oswald', sans-serif; font-size: 2.5rem; text-transform: uppercase; }
      .report-cover-theme { color: #8b4513; font-family: 'Inter', sans-serif; }
      .report-meta-item { background: #4a332a; border: 2px solid #8b4513; border-radius: 5px; width: 100%; text-align: center; }
      .report-meta-label { color: #b8860b; }
      .report-meta-value { color: #f0e6d2; }
      .report-section-title { color: #b8860b; font-family: 'Oswald', sans-serif; border-bottom: 2px solid #8b4513; text-transform: uppercase; }
      .section-number-badge { background: #8b4513 !important; color: #f0e6d2; }
      .method-step-card, .result-card { background: #4a332a; border: 2px solid #8b4513; border-radius: 5px; }
      .method-step-card-title, .result-card-header { background: rgba(139, 69, 19, 0.3) !important; color: #b8860b; border-bottom: 2px solid #8b4513; font-family: 'Oswald', sans-serif; text-transform: uppercase; }
      .result-card-title { color: #b8860b; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #f0e6d2; border-bottom-color: #8b4513; }
      .report-footer { background: #5c4033; border-top: 2px solid #8b4513; }
    `;
  } else if (theme === 'vaporwave') {
    pageBg = '#2a0845'; pageText = '#00ffff';
    extraCss = `
      body, .a4-page { background-color: #2a0845 !important; background-image: linear-gradient(0deg, transparent 24%, rgba(255, 0, 255, 0.3) 25%, rgba(255, 0, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.3) 75%, rgba(255, 0, 255, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.3) 25%, rgba(0, 255, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.3) 75%, rgba(0, 255, 255, 0.3) 76%, transparent 77%, transparent); background-size: 50px 50px; color: #00ffff; font-family: 'Inter', sans-serif; }
      .report-cover { border-bottom: 2px solid #ff00ff; text-align: center; }
      .report-badge { border: 2px solid #ff00ff; color: #00ffff; border-radius: 0; background: rgba(42, 8, 69, 0.8); box-shadow: 2px 2px 0 #00ffff; }
      .report-cover-title { color: #ff00ff; font-family: 'Inter', sans-serif; font-size: 2.5rem; text-transform: uppercase; font-style: italic; text-shadow: 2px 2px 0 #00ffff; }
      .report-cover-theme { color: #00ffff; font-family: 'Inter', sans-serif; }
      .report-meta-item { background: rgba(42, 8, 69, 0.8); border: 2px solid #ff00ff; border-radius: 0; width: 100%; text-align: center; box-shadow: 4px 4px 0 rgba(0, 255, 255, 0.5); }
      .report-meta-label { color: #ff00ff; }
      .report-meta-value { color: #00ffff; }
      .report-section-title { color: #ff00ff; font-family: 'Inter', sans-serif; font-style: italic; border-bottom: 2px solid #ff00ff; text-shadow: 2px 2px 0 rgba(0, 255, 255, 0.5); }
      .section-number-badge { background: #ff00ff !important; color: #2a0845; border-radius: 0; }
      .method-step-card, .result-card { background: rgba(42, 8, 69, 0.8); border: 2px solid #ff00ff; border-radius: 0; box-shadow: 4px 4px 0 rgba(0, 255, 255, 0.3); }
      .method-step-card-title, .result-card-header { background: rgba(255, 0, 255, 0.2) !important; color: #ff00ff; border-bottom: 2px solid #ff00ff; font-style: italic; }
      .result-card-title { color: #ff00ff; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #00ffff; border-bottom-color: rgba(255, 0, 255, 0.3); }
      .report-footer { background: #2a0845; border-top: 2px solid #ff00ff; }
    `;
  } else if (theme === 'steampunk') {
    pageBg = '#8b5a2b'; pageText = '#ffdead';
    extraCss = `
      body, .a4-page { background-color: #8b5a2b !important; background-image: radial-gradient(circle, #5c3a21 2px, transparent 2.5px); background-size: 20px 20px; color: #ffdead; font-family: 'Playfair Display', serif; }
      .report-cover { border-bottom: 2px solid #cd853f; text-align: center; }
      .report-badge { border: 2px solid #cd853f; color: #d2691e; border-radius: 5px; background: #6b4423; box-shadow: 0 4px 6px rgba(0,0,0,0.5); }
      .report-cover-title { color: #cd853f; font-family: 'Playfair Display', serif; font-size: 2.5rem; text-shadow: 1px 1px 0 #000; }
      .report-cover-theme { color: #d2691e; font-family: 'Playfair Display', serif; }
      .report-meta-item { background: #6b4423; border: 2px solid #cd853f; border-radius: 5px; width: 100%; text-align: center; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
      .report-meta-label { color: #cd853f; }
      .report-meta-value { color: #ffdead; }
      .report-section-title { color: #cd853f; font-family: 'Playfair Display', serif; border-bottom: 2px dashed #cd853f; }
      .section-number-badge { background: #cd853f !important; color: #2b1d12; border-radius: 50%; border: 2px solid #8b5a2b; box-shadow: 0 2px 4px rgba(0,0,0,0.5); }
      .method-step-card, .result-card { background: #6b4423; border: 2px solid #cd853f; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.5); }
      .method-step-card-title, .result-card-header { background: rgba(205, 133, 63, 0.2) !important; color: #cd853f; border-bottom: 2px solid #cd853f; }
      .result-card-title { color: #cd853f; }
      .report-text, .report-list li, .method-step-card-body, .result-card-body, .references-list li { color: #ffdead; border-bottom-color: rgba(205, 133, 63, 0.3); }
      .report-footer { background: #8b5a2b; border-top: 2px solid #cd853f; }
    `;
  } else if (theme === 'caderno') {
    pageBg = '#faf8f5'; pageText = '#1a1a2a';
    extraCss = `
      body, .a4-page { background: #faf8f5 !important; color: #1a1a2a; }
      .a4-page { background-image: repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px) !important; background-position: 0 40px; }
      .report-cover { background: #fff; border-bottom: 4px solid #2563eb; }
      .report-cover-title { font-family: 'Playfair Display', serif; color: #1e3a8a; }
      .method-step-card, .result-card { background: #fff; border: 1px solid #d1d5db; box-shadow: 2px 2px 0px rgba(37,99,235,0.1); }
      .report-footer { background: #fff; border-top: 2px dashed #d1d5db; }
      .report-text, .method-step-card-body, .result-card-body { line-height: 32px; font-family: 'Inter', sans-serif; }
    `;
  } else if (theme === 'cyberpunk') {
    pageBg = '#09090b'; pageText = '#e0e0e0';
    extraCss = `
      body, .a4-page { background: #09090b !important; color: #e0e0e0; font-family: 'Inter', sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.05) 2px, rgba(0, 240, 255, 0.05) 4px); pointer-events:none; z-index:0; }
      .report-cover { background: #111; border-bottom: 2px solid #00f0ff; position: relative; z-index: 1; }
      .report-cover-title { color: #fff; text-transform: uppercase; font-weight: 800; letter-spacing: 2px; text-shadow: 2px 2px 0px #00f0ff, -2px -2px 0px #ff00f0; }
      .report-section-title { color: #09090b; background: #00f0ff; display: inline-flex; padding: 5px 15px; transform: skew(-10deg); border-image: none !important; border-bottom: none; margin-bottom: 20px; position: relative; z-index: 1; }
      .report-section-title > * { transform: skew(10deg); display: inline-block; }
      .section-number-badge { background: #09090b !important; color: #00f0ff; }
      .method-step-card, .result-card { background: rgba(9, 9, 11, 0.7); border: 1px solid #333; border-left: 2px solid #00f0ff; position: relative; z-index: 1; backdrop-filter: blur(10px); }
      .method-step-card-title, .result-card-header { background: rgba(0, 240, 255, 0.1) !important; color: #00f0ff; }
      .report-text, .report-list li, .references-list li { color: #ccc; position: relative; z-index: 1; }
      .report-footer { background: #000; border-top: 1px solid #333; position: relative; z-index: 1; }
    `;
  } else if (theme === 'silksong') {
    pageBg = '#120b12'; pageText = '#d4cbb8';
    extraCss = `
      body, .a4-page { background: #120b12 !important; color: #d4cbb8; font-family: 'Playfair Display', serif; }
      .report-cover { background: #1a101a; border-bottom: 1px solid #dbb258; position: relative; z-index: 1; }
      .report-cover-title { color: #dbb258; text-transform: uppercase; letter-spacing: 0.1em; text-shadow: 0 0 10px rgba(219, 178, 88, 0.3); }
      .report-meta-item { background: transparent; border: 1px solid rgba(219, 178, 88, 0.3); }
      .report-meta-label { color: #dbb258; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #dbb258; border-image: none !important; border-bottom: 1px solid rgba(219, 178, 88, 0.3); position: relative; z-index: 1; }
      .section-number-badge { background: #dbb258 !important; color: #120b12; }
      .method-step-card, .result-card { background: #1a101a; border: 1px solid rgba(219, 178, 88, 0.2); position: relative; z-index: 1; }
      .method-step-card-title { color: #dbb258; background: rgba(219, 178, 88, 0.05) !important; }
      .result-card-header { background: rgba(219, 178, 88, 0.1) !important; }
      .result-card-title { color: #dbb258; }
      .report-text, .report-list li, .references-list li { color: #b8b0a0; position: relative; z-index: 1; }
      .report-footer { background: #0a060a; border-top: 1px solid rgba(219, 178, 88, 0.2); position: relative; z-index: 1; }
    `;
  } else if (theme === 'hexatombe') {
    pageBg = '#0c0c0c'; pageText = '#d1d1d1';
    extraCss = `
      body, .a4-page { background: #0c0c0c !important; color: #d1d1d1; font-family: 'Inter', sans-serif; }
      .a4-page::after { content:''; position:absolute; top:0; right:0; width: 300px; height: 300px; background: radial-gradient(circle, #ff2a2a 0%, transparent 70%); opacity: 0.05; pointer-events: none; z-index:0; }
      .report-cover { background: #111; border-bottom: 2px solid #ff2a2a; position: relative; z-index: 1; }
      .report-cover-title { color: #fff; font-weight: 800; letter-spacing: 2px; text-shadow: 3px 0px 0px #ff2a2a, -3px 0px 0px #2a2aff; }
      .report-meta-item { background: transparent; border: 1px solid rgba(255, 42, 42, 0.3); }
      .report-meta-label { color: #ff2a2a; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #fff; border-image: none !important; border-bottom: 1px solid #ff2a2a; position: relative; z-index: 1; }
      .section-number-badge { background: #ff2a2a !important; color: #0c0c0c; box-shadow: 0 0 10px rgba(255,42,42,0.5); }
      .method-step-card, .result-card { background: #111; border: 1px solid rgba(255, 42, 42, 0.2); position: relative; z-index: 1; border-left: 3px solid #ff2a2a; }
      .method-step-card-title { color: #ff2a2a; background: rgba(255, 42, 42, 0.05) !important; }
      .result-card-header { background: rgba(255, 42, 42, 0.1) !important; }
      .result-card-title { color: #ff2a2a; }
      .report-text, .report-list li, .references-list li { color: #aaa; position: relative; z-index: 1; border-bottom-color: #222; }
      .report-footer { background: #000; border-top: 1px solid rgba(255, 42, 42, 0.2); position: relative; z-index: 1; }
    `;
  } else if (theme === 'resident-evil') {
    pageBg = '#111111'; pageText = '#d4d4d4';
    extraCss = `
      body, .a4-page { background: #111111 !important; color: #d4d4d4; font-family: 'Arial Narrow', Arial, sans-serif; }
      .a4-page::before { content:''; position:absolute; inset:0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px); pointer-events:none; z-index:0; }
      .report-cover { background: #000; border-bottom: 1px dashed rgba(255,255,255,0.3); position: relative; z-index: 1; }
      .report-cover-title { color: #fff; font-family: 'Courier New', Courier, monospace; text-transform: uppercase; }
      .report-meta-item { background: transparent; border: 1px dashed rgba(255,255,255,0.3); }
      .report-meta-label { color: #888; font-family: 'Courier New', Courier, monospace; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #fff; font-family: 'Courier New', Courier, monospace; border-image: none !important; border-bottom: 1px dashed rgba(255,255,255,0.3); position: relative; z-index: 1; }
      .section-number-badge { background: #333 !important; color: #fff; border-radius: 0; }
      .method-step-card, .result-card { background: #1a1a1a; border: 1px dashed rgba(255,255,255,0.2); position: relative; z-index: 1; border-left: none !important; border-radius: 0; }
      .method-step-card-title { color: #fff; background: rgba(255,255,255,0.05) !important; font-family: 'Courier New', Courier, monospace; }
      .result-card-header { background: rgba(255,255,255,0.1) !important; }
      .result-card-title { color: #fff; font-family: 'Courier New', Courier, monospace; }
      .report-text, .report-list li, .references-list li { color: #bbb; position: relative; z-index: 1; border-bottom-color: #222; }
      .report-footer { background: #000; border-top: 1px dashed rgba(255,255,255,0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'pokemon' || theme === 'pokemon-sword') {
    const isSword = theme === 'pokemon-sword';
    const pokeAccent = isSword ? '#e03a5f' : '#00ffaa';
    const pokeBg = isSword ? '#05141c' : '#0a1118';
    pageBg = pokeBg; pageText = '#d0dbe5';
    extraCss = `
      body, .a4-page { background: ${pokeBg} !important; color: #d0dbe5; font-family: 'Inter', sans-serif; }
      .report-cover { background: #000; border-bottom: 4px solid ${pokeAccent}; position: relative; z-index: 1; }
      .report-cover::after { content:''; position:absolute; bottom:0; left:0; right:0; height:10px; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px); }
      .report-cover-title { color: #fff; font-weight: 800; text-transform: uppercase; font-style: italic; }
      .report-meta-item { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
      .report-meta-label { color: ${pokeAccent}; }
      .report-meta-value { color: #fff; }
      .report-section-title { color: #fff; border-image: none !important; border-bottom: 2px solid ${pokeAccent}; position: relative; z-index: 1; font-style: italic; }
      .section-number-badge { background: ${pokeAccent} !important; color: #000; border-radius: 10px; }
      .method-step-card, .result-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 1; border-radius: 12px; overflow: hidden; border-left: 4px solid ${pokeAccent}; }
      .method-step-card-title { color: #fff; background: rgba(255,255,255,0.05) !important; font-weight: 800; text-transform: uppercase; font-size: 0.8rem; }
      .result-card-header { background: rgba(255,255,255,0.08) !important; }
      .result-card-title { color: #fff; font-weight: 800; text-transform: uppercase; }
      .report-text, .report-list li, .references-list li { color: #a0aebc; position: relative; z-index: 1; border-bottom-color: rgba(255,255,255,0.05); }
      .report-footer { background: #000; border-top: 2px solid rgba(255,255,255,0.1); position: relative; z-index: 1; }
    `;
  } else if (theme === 'moderno') {
    pageBg = '#ffffff'; pageText = '#333';
    extraCss = `
      body, .a4-page { background: #ffffff !important; color: #333; font-family: 'Inter', sans-serif; }
      .report-cover { background: #f8fafc; border-bottom: none; position: relative; z-index: 1; }
      .report-cover-title { color: #1e293b; font-weight: 800; }
      .report-meta-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
      .report-meta-label { color: #3b82f6; }
      .report-meta-value { color: #1e293b; }
      .report-section-title { color: #1e293b; border-image: none !important; border-bottom: 3px solid #3b82f6; display: inline-block; padding-bottom: 5px; position: relative; z-index: 1; }
      .section-number-badge { background: #3b82f6 !important; color: #fff; border-radius: 4px; }
      .method-step-card, .result-card { background: #fff; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative; z-index: 1; border-radius: 12px; }
      .method-step-card-title { color: #1e293b; background: #f8fafc !important; border-bottom: 1px solid #e2e8f0; }
      .result-card-header { background: #f8fafc !important; border-bottom: 1px solid #e2e8f0; }
      .result-card-title { color: #1e293b; }
      .result-card-dot { background: #3b82f6; }
      .report-text, .report-list li, .references-list li { color: #475569; position: relative; z-index: 1; border-bottom-color: #f1f5f9; }
      .report-footer { background: #f8fafc; border-top: none; position: relative; z-index: 1; }
    `;
  } else if (theme === 'belle-epoque') {
    pageBg = '#fdfaf3'; pageText = '#3a2d24';
    extraCss = `
      body, .a4-page { background: #fdfaf3 !important; color: #3a2d24; font-family: 'Playfair Display', serif; }
      .report-cover { background: #f3efe6; border-bottom: 2px solid #8b6b4a; position: relative; z-index: 1; }
      .report-cover-title { color: #4a3625; font-weight: 700; text-align: center; }
      .report-cover-theme { text-align: center; color: #8b6b4a; }
      .report-meta-item { background: transparent; border: 1px solid #d4cbb8; border-radius: 0; text-align: center; }
      .report-meta-label { color: #8b6b4a; font-family: 'Playfair Display', serif; }
      .report-meta-value { color: #4a3625; }
      .report-section-title { color: #4a3625; border-image: none !important; border-bottom: 1px solid #8b6b4a; position: relative; z-index: 1; text-align: center; justify-content: center; }
      .section-number-badge { display: none; }
      .method-step-card, .result-card { background: #fdfaf3; border: 1px solid #d4cbb8; position: relative; z-index: 1; border-radius: 0; border-left: none; }
      .method-step-card-title { color: #4a3625; background: #f3efe6 !important; text-align: center; }
      .result-card-header { background: #f3efe6 !important; justify-content: center; }
      .result-card-title { color: #4a3625; }
      .result-card-dot { display: none; }
      .report-text, .report-list li, .references-list li { color: #5c432d; position: relative; z-index: 1; border-bottom-color: #eee9dd; }
      .report-footer { background: #f3efe6; border-top: 1px solid #d4cbb8; position: relative; z-index: 1; justify-content: center; }
      .footer-brand { text-align: center; width: 100%; }
      .footer-line { display: none; }
    `;
  } else if (theme === 'clair-obscur') {
    pageBg = '#0d0c12'; pageText = '#d4cbb8';
    extraCss = `
      body, .a4-page { background: #0d0c12 !important; color: #d4cbb8; font-family: 'Playfair Display', serif; }
      .report-cover { background: #050508; border-bottom: 1px solid #b78f61; position: relative; z-index: 1; }
      .report-cover-title { color: #e6d8c3; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
      .report-meta-item { background: rgba(183, 143, 97, 0.05); border: 1px solid rgba(183, 143, 97, 0.3); border-radius: 0; }
      .report-meta-label { color: #b78f61; }
      .report-meta-value { color: #e6d8c3; }
      .report-section-title { color: #e6d8c3; border-image: none !important; border-bottom: 1px solid rgba(183, 143, 97, 0.5); position: relative; z-index: 1; }
      .section-number-badge { background: #b78f61 !important; color: #0d0c12; border-radius: 0; }
      .method-step-card, .result-card { background: #13111a; border: 1px solid rgba(183, 143, 97, 0.2); position: relative; z-index: 1; border-radius: 0; border-left: 2px solid #b78f61; }
      .method-step-card-title { color: #e6d8c3; background: rgba(183, 143, 97, 0.1) !important; }
      .result-card-header { background: rgba(183, 143, 97, 0.15) !important; }
      .result-card-title { color: #e6d8c3; }
      .report-text, .report-list li, .references-list li { color: #a39b8a; position: relative; z-index: 1; border-bottom-color: #1a1824; }
      .report-footer { background: #050508; border-top: 1px solid rgba(183, 143, 97, 0.3); position: relative; z-index: 1; }
    `;
  } else if (theme === 'minimalista') {
    pageBg = '#fafafa'; pageText = '#1a1a1a';
    extraCss = `
      body, .a4-page { background: #fafafa !important; color: #1a1a1a; font-family: 'Inter', sans-serif; }
      .report-cover { background: #fff; border-bottom: 1px solid #eee; position: relative; z-index: 1; padding-bottom: 40px; }
      .report-cover::before { display: none; }
      .report-cover-title { color: #000; font-weight: 400; font-size: 2.2rem; }
      .report-meta-item { background: transparent; border: none; border-bottom: 1px solid #eee; border-radius: 0; padding-left: 0; }
      .report-meta-label { color: #888; }
      .report-meta-value { color: #000; }
      .report-section-title { color: #000; border-image: none !important; border-bottom: none; position: relative; z-index: 1; padding-bottom: 0; margin-bottom: 24px; font-weight: 500; }
      .section-number-badge { background: #000 !important; color: #fff; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
      .method-step-card, .result-card { background: #fff; border: 1px solid #eaeaea; position: relative; z-index: 1; border-radius: 4px; box-shadow: none; border-left: none; }
      .method-step-card-title { color: #000; background: transparent !important; border-bottom: 1px solid #eaeaea; }
      .result-card-header { background: transparent !important; border-bottom: 1px solid #eaeaea; }
      .result-card-title { color: #000; }
      .result-card-dot { display: none; }
      .report-text, .report-list li, .references-list li { color: #444; position: relative; z-index: 1; border-bottom-color: #f5f5f5; }
      .report-footer { background: #fff; border-top: 1px solid #eee; position: relative; z-index: 1; }
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
  measureBox.style.padding = '0'; // removemos o padding para que a .a4-page ocupe 100%
  
  // Criamos um container temporário para não sujar o measureBox enquanto lemos os elementos
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = blocks.join('');
  const children = Array.from(tempDiv.children);

  measureBox.innerHTML = '';

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
  measureBox.appendChild(currentPage);
  let contentArea = currentPage.querySelector('.page-content');

  // Move elements one by one, checking for overflow
  for (let el of children) {
    contentArea.appendChild(el);
    
    let maxH = contentArea.clientHeight;
    if (maxH < 500) maxH = 1122; // Fallback se o navegador falhar no layout escondido
    
    // Se o conteúdo ultrapassar a altura máxima
    if (contentArea.scrollHeight > maxH) {
      contentArea.removeChild(el); // Too big for this page
      
      // Verifica se o elemento anterior que ficou no final da página é um subtítulo "órfão"
      let orphanTitle = null;
      if (contentArea.lastElementChild && contentArea.lastElementChild.classList.contains('report-section-title')) {
        orphanTitle = contentArea.lastElementChild;
        contentArea.removeChild(orphanTitle);
      }

      currentPage = createPage();
      measureBox.appendChild(currentPage);
      contentArea = currentPage.querySelector('.page-content');
      
      // Se tinha um título órfão, joga ele no topo da página nova primeiro
      if (orphanTitle) {
        contentArea.appendChild(orphanTitle);
      }
      
      contentArea.appendChild(el); // Add to new page
    }
  }

  // Depois de montar tudo no measureBox (que é sempre renderizado), passamos pro output final
  const output = document.getElementById('report-output');
  output.innerHTML = '';
  while (measureBox.firstChild) {
    output.appendChild(measureBox.firstChild);
  }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
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
  (d.results || []).forEach(r => addResult(r.title, r.body, r.image));

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
  updatePreview();
})();
