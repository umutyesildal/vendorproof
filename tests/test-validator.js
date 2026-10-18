// VendorProof validator fixture tests — runs Validate R1 jsCode with mocked n8n globals.
const fs = require('fs');
const code = fs.readFileSync('tests/validator.js', 'utf8');

const SRC_A = { url: 'https://vendor.com/pricing', title: 'Pricing', content: 'Our Basic plan costs $10 per month. Enterprise pricing is custom. All plans include SSL.' };
const SRC_B = { url: 'https://blog.example.com/review', title: 'Review', content: 'The vendor suffered a major outage in March, lasting six hours and affecting all regions.' };

function run(modelReport, sources = [SRC_A, SRC_B]) {
  let result;
  const $input = { first: () => ({ json: { choices: [{ message: { content: JSON.stringify(modelReport) } }] } }) };
  const $ = (name) => ({ first: () => ({ json: { sources } }) });
  const fn = new Function('$input', '$', 'require', code);
  try { result = fn($input, $, require); } catch (e) { return { error: e.message }; }
  return result[0].json;
}

const mk = (over) => Object.assign({
  findings: [{ claim: 'Basic plan costs $10/month', topic: 'pricing', verification: 'supported',
    source_url: SRC_A.url, source_title: 'Pricing', source_class: 'first_party',
    evidence: 'Our Basic plan costs $10 per month.', severity: 'info' }],
  assessment: 'ok', needs_more_research: false, follow_up_queries: []
}, over);

const f = (r) => r.findings[0];
let pass = 0, fail = 0;
const t = (name, cond) => { if (cond) { pass++; console.log('PASS', name); } else { fail++; console.log('FAIL', name); } };

// T1 exact match stays supported
let r = run(mk());
t('T1 exact match → supported', f(r).verification === 'supported' && f(r).validation.evidence_match === 'exact');

// T3 quote exists but in a DIFFERENT source → downgrade
r = run(mk({ findings: [Object.assign(mk().findings[0], { evidence: 'The vendor suffered a major outage in March, lasting six hours and affecting all regions.' })] }));
t('T3 quote from wrong source → insufficient_evidence', f(r).verification === 'insufficient_evidence' && f(r).validation.downgrade_reason === 'evidence_not_found_in_source');

// T5 cited URL not in extraction set → downgrade
r = run(mk({ findings: [Object.assign(mk().findings[0], { source_url: 'https://other.com/x' })] }));
t('T5 URL outside extraction set → insufficient_evidence', f(r).verification === 'insufficient_evidence' && f(r).validation.downgrade_reason === 'url_not_in_extraction_set');

// T6 too-short quote → downgrade
r = run(mk({ findings: [Object.assign(mk().findings[0], { evidence: 'costs $10' })] }));
t('T6 short quote → insufficient_evidence', f(r).verification === 'insufficient_evidence' && f(r).validation.downgrade_reason === 'evidence_format_invalid');

// T7 ellipsis quote → downgrade
r = run(mk({ findings: [Object.assign(mk().findings[0], { evidence: 'Our Basic plan costs $10 per month. Enterprise pricing...' })] }));
t('T7 ellipsis quote → insufficient_evidence', f(r).verification === 'insufficient_evidence');

// T9 contradicted stays contradicted + severity floor medium
r = run(mk({ findings: [Object.assign(mk().findings[0], { claim: 'Vendor has no outages', topic: 'reliability', verification: 'contradicted', source_url: SRC_B.url, severity: 'info', evidence: 'The vendor suffered a major outage in March, lasting six hours and affecting all regions.' })] }));
t('T9 contradicted preserved + severity≥medium', f(r).verification === 'contradicted' && f(r).severity === 'medium' && r.review_reasons.includes('contradicted_finding'));

// T10 malformed schema → throws
r = run({ findings: 'not-an-array', assessment: 1 });
t('T10 malformed schema → error thrown', r.error === 'invalid_schema');

// T11 smart-quote normalization → supported via normalized tier
const SRC_Q = { url: 'https://vendor.com/security', title: 'Security', content: 'It\u2019s our policy that \u201Call data is encrypted at rest\u201D and in transit.' };
r = run(mk({ findings: [Object.assign(mk().findings[0], { source_url: SRC_Q.url, evidence: 'It\'s our policy that "all data is encrypted at rest" and in transit.' })] }), [SRC_Q]);
t('T11 smart-quote normalized match → supported (normalized)', f(r).verification === 'supported' && f(r).validation.evidence_match === 'normalized' && r.review_reasons.includes('normalized_match_audit'));

// T13 model upgrades insuff→supported impossible: model says supported w/o valid quote; validator downgrades, never upgrades — also insufficient_evidence input stays insufficient
r = run(mk({ findings: [Object.assign(mk().findings[0], { verification: 'insufficient_evidence', source_url: '', evidence: '' })] }));
t('T13 insufficient stays insufficient', f(r).verification === 'insufficient_evidence');

// T20 failed_results URL used as source → downgrade
r = run(mk({ findings: [Object.assign(mk().findings[0], { source_url: 'https://failed.example.com/x', evidence: 'anything long enough here ok' })] }), [SRC_A]);
t('T20 non-extracted URL → insufficient_evidence', f(r).verification === 'insufficient_evidence');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
