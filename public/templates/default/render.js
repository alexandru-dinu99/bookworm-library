// ── CV Builder — Default Template — Rendering Engine ─────────────────────────
// Called by renderCV(data, lang) from the parent app (or postMessage).
// All data comes from the CvContent contract defined in src/data/model.ts.

var LABELS = {
  EN: { summary: 'Summary', experience: 'Work Experience', education: 'Education',
        skills: 'Skills', languages: 'Languages', present: 'Present' },
  RO: { summary: 'Profil', experience: 'Experiență Profesională', education: 'Educație',
        skills: 'Competențe', languages: 'Limbi Străine', present: 'Prezent' },
  DE: { summary: 'Profil', experience: 'Berufserfahrung', education: 'Ausbildung',
        skills: 'Kenntnisse', languages: 'Sprachen', present: 'Heute' },
};

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildCvHtml(cv, lang) {
  var L = LABELS[lang] || LABELS.EN;
  var out = '';

  out += buildHeader(cv.personal || {});

  if (cv.summary && cv.summary.trim()) {
    out += section(L.summary, '<p class="cv-summary">' + esc(cv.summary) + '</p>');
  }

  if (cv.experience && cv.experience.length) {
    out += section(L.experience, cv.experience.map(function(e) { return buildExp(e, L); }).join(''));
  }

  if (cv.education && cv.education.length) {
    out += section(L.education, cv.education.map(buildEdu).join(''));
  }

  if (cv.skills && cv.skills.length) {
    out += section(L.skills, cv.skills.map(buildSkillGroup).join(''));
  }

  if (cv.languages && cv.languages.length) {
    out += section(L.languages, buildLangs(cv.languages));
  }

  if (cv.customSections) {
    cv.customSections.forEach(function(cs) {
      if (cs.heading && cs.entries && cs.entries.length) {
        var content = cs.entries
          .filter(function(e) { return e && e.trim(); })
          .map(function(e) { return '<p class="cv-custom-entry">' + esc(e) + '</p>'; })
          .join('');
        if (content) out += section(esc(cs.heading), content);
      }
    });
  }

  return out;
}

function buildHeader(p) {
  var out = '<header class="cv-header">';

  if (p.photoBase64) {
    out += '<img class="cv-photo" src="' + esc(p.photoBase64) + '" alt="photo" />';
  }

  out += '<div class="cv-header-text">';
  out += '<div class="cv-name">' + esc(p.fullName || '') + '</div>';
  if (p.title) out += '<div class="cv-jobtitle">' + esc(p.title) + '</div>';

  var items = [];
  if (p.email)    items.push(esc(p.email));
  if (p.phone)    items.push(esc(p.phone));
  if (p.location) items.push(esc(p.location));
  if (p.links) {
    p.links.forEach(function(l) {
      if (l.url) items.push(l.label ? esc(l.label) + ': ' + esc(l.url) : esc(l.url));
    });
  }

  if (items.length) {
    out += '<div class="cv-contact">' +
      items.map(function(i) { return '<span class="cv-contact-item">' + i + '</span>'; })
           .join('<span class="cv-contact-sep">·</span>') +
      '</div>';
  }

  out += '</div></header><hr class="cv-rule" />';
  return out;
}

function section(heading, content) {
  return '<div class="cv-section"><h2 class="cv-section-heading">' +
    esc(heading) + '</h2>' + content + '</div>';
}

function buildExp(e, L) {
  var dateRange = e.current
    ? esc(e.start) + ' – ' + L.present
    : esc(e.start) + (e.end ? ' – ' + esc(e.end) : '');

  var out = '<div class="cv-entry"><div class="cv-entry-row">';
  out += '<div class="cv-entry-left">';
  out += '<span class="cv-entry-title">' + esc(e.role) + '</span>';
  if (e.company) out += '<span class="cv-entry-org"> &middot; ' + esc(e.company) + '</span>';
  out += '</div>';
  out += '<div class="cv-entry-right">';
  if (e.location) out += '<span class="cv-entry-loc">' + esc(e.location) + '</span>';
  out += '<span class="cv-entry-date">' + dateRange + '</span>';
  out += '</div></div>';

  var bullets = (e.bullets || []).filter(function(b) { return b && b.trim(); });
  if (bullets.length) {
    out += '<ul class="cv-bullets">' +
      bullets.map(function(b) { return '<li>' + esc(b) + '</li>'; }).join('') +
      '</ul>';
  }

  out += '</div>';
  return out;
}

function buildEdu(e) {
  var dateRange = esc(e.start) + (e.end ? ' – ' + esc(e.end) : '');

  var out = '<div class="cv-entry"><div class="cv-entry-row">';
  out += '<div class="cv-entry-left">';
  out += '<span class="cv-entry-title">' + esc(e.degree) + '</span>';
  if (e.institution) out += '<span class="cv-entry-org"> &middot; ' + esc(e.institution) + '</span>';
  out += '</div>';
  out += '<div class="cv-entry-right">';
  if (e.location) out += '<span class="cv-entry-loc">' + esc(e.location) + '</span>';
  out += '<span class="cv-entry-date">' + dateRange + '</span>';
  out += '</div></div>';
  if (e.notes) out += '<p class="cv-entry-notes">' + esc(e.notes) + '</p>';
  out += '</div>';
  return out;
}

function buildSkillGroup(g) {
  var items = (g.items || []).filter(Boolean).map(esc).join(' · ');
  var out = '<div class="cv-skill-row">';
  if (g.category) out += '<span class="cv-skill-cat">' + esc(g.category) + ': </span>';
  out += '<span class="cv-skill-items">' + items + '</span>';
  out += '</div>';
  return out;
}

function buildLangs(langs) {
  return '<div class="cv-lang-row">' +
    langs.map(function(l) {
      return '<span>' +
        '<span class="cv-lang-name">' + esc(l.language) + '</span>' +
        '<span class="cv-lang-level"> — ' + esc(l.level) + '</span>' +
        '</span>';
    }).join('') +
    '</div>';
}
