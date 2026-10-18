const raw = $input.first().json?.choices?.[0]?.message?.content;
if (!raw) throw new Error('Verifier returned empty content.');
let rep; try { rep = JSON.parse(raw); } catch { throw new Error('Verifier output is not valid JSON.'); }
if (!Array.isArray(rep.findings) || typeof rep.assessment !== 'string') throw new Error('invalid_schema');
const srcs = $('Build Evidence R1').first().json.sources;
const norm = u => { try { const x = new URL(u); x.hash=''; ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','ref','source'].forEach(p=>x.searchParams.delete(p)); return x.href.replace(/\/$/, '').toLowerCase(); } catch { return String(u||'').toLowerCase(); } };
const map = new Map(srcs.map(s => [norm(s.url), s]));
const canon = t => String(t||'').normalize('NFC').replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/[\u2013\u2014\u2010\u2011\u2012]/g,'-').replace(/\u00A0/g,' ').replace(/\s+/g,' ');
const V = new Set(['supported','contradicted','insufficient_evidence']);
const S = new Set(['info','low','medium','high','critical']);
const MATERIAL = new Set(['breach','litigation','sanctions','fraud','security','reliability','compliance']);
let downgraded = 0, normalizedOnly = 0, retrievable = [];
const findings = rep.findings.map(f => {
  const v = { original_state: f.verification, final_state: f.verification, url_match: false, evidence_match: 'none', downgrade_reason: 'none', severity_adjusted: false };
  if (!f.claim || !f.topic || !V.has(f.verification) || !S.has(f.severity)) { v.final_state='insufficient_evidence'; v.downgrade_reason='invalid_finding'; }
  const src = map.get(norm(f.source_url));
  const ev = String(f.evidence||'').trim();
  const badFormat = ev.length<20 || ev.length>2000 || /(\u2026|\.\.\.|\[\.\.\.\])/.test(ev);
  if (f.verification !== 'insufficient_evidence') {
    if (!src) { v.final_state='insufficient_evidence'; v.downgrade_reason='url_not_in_extraction_set'; if (f.source_url) retrievable.push(f.topic); }
    else { v.url_match = true;
      if (badFormat) { v.final_state='insufficient_evidence'; v.downgrade_reason='evidence_format_invalid'; }
      else { const exact = src.content.normalize('NFC').replace(/\s+/g,' ').includes(ev.normalize('NFC').replace(/\s+/g,' '));
        const normMatch = !exact && canon(src.content).includes(canon(ev));
        if (exact) v.evidence_match='exact'; else if (normMatch) v.evidence_match='normalized';
        else { v.final_state='insufficient_evidence'; v.downgrade_reason='evidence_not_found_in_source'; }
      }
    }
  }
  if (v.final_state !== f.verification) downgraded++;
  if (v.evidence_match === 'normalized') normalizedOnly++;
  if (v.final_state === 'contradicted' && ['info','low'].includes(f.severity)) { f.severity='medium'; v.severity_adjusted=true; }
  if (v.final_state === 'insufficient_evidence' && ['high','critical'].includes(f.severity) && !MATERIAL.has(f.topic)) { f.severity='medium'; v.severity_adjusted=true; }
  return { ...f, verification: v.final_state, source_url: src ? f.source_url : '', source_title: src ? (f.source_title || src.title) : '', evidence: v.evidence_match==='none'&&v.final_state!=='insufficient_evidence' ? ev : (v.final_state==='insufficient_evidence'?'':ev), validation: v, compound: String(f.claim).length>300 };
});
const materialInsuff = findings.filter(f => MATERIAL.has(f.topic) && f.verification==='insufficient_evidence').length;
const reasons = [];
if (findings.some(f=>f.verification==='contradicted')) reasons.push('contradicted_finding');
if (normalizedOnly) reasons.push('normalized_match_audit');
if (downgraded>=2) reasons.push('downgrade_threshold');
if (materialInsuff >= Math.ceil(findings.filter(f=>MATERIAL.has(f.topic)).length/2) && findings.some(f=>MATERIAL.has(f.topic))) reasons.push('material_insufficiency');
if (findings.some(f=>f.compound)) reasons.push('compound_claim_suspected');
const needsFollowUp = Boolean(rep.needs_more_research && retrievable.length && rep.follow_up_queries?.length);
return [{ json: { findings, assessment: rep.assessment, needs_follow_up: needsFollowUp, follow_up_queries: needsFollowUp ? rep.follow_up_queries.slice(0,3) : [], review_reasons: reasons, downgraded, round: 0 } }];