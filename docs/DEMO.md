# VendorProof — 2 dakikalık demo videosu (Stage 1 başvurusu)

Hedef: n8n side track'ini kazanmak. 120 saniyenin ~45'inde ekranda n8n canvas'ı ve execution'lar olacak; anlatılan her şey ekranda gösterilecek, sadece söylenmeyecek.

Jüri uluslararası olduğu için seslendirme İngilizce. Her bölümde okunacak İngilizce metin ve Türkçe anlamı var.

## Kayıttan önce hazırlık

1. NVIDIA (execution #82) ve Nimbus (execution #84) raporları zaten kayıtlı, lookup formu anında açar.
2. Chrome sekmelerini bu sırayla aç, hepsinde giriş yapılmış olsun, yazılar 1080p'de okunacak kadar zoom'lu olsun:
   1. `https://yesildal.app.n8n.cloud/form/vp-lookup` → Nimbus raporu açık
   2. `https://yesildal.app.n8n.cloud/form/vp-assessment` (boş form)
   3. n8n orchestrator canvas'ı (zoom-to-fit)
   4. n8n Executions → NVIDIA execution'ı #82 (yeşil), zoom-to-fit
   5. `https://yesildal.app.n8n.cloud/form/vp-lookup` → NVIDIA raporu açık
   6. NVIDIA'nın SUPPORTED bulgularından birinin kaynak sayfası (alıntının altındaki link)
3. Bildirimleri kapat (Rahatsız Etme), yer imleri çubuğunu gizle (Cmd+Shift+B), n8n'deki checklist popup'ını kapat.
4. QuickTime veya Cmd+Shift+5 ile tam ekran, mikrofon açık kaydet. Her bölüm ayrı çekilebilir, sonra herhangi bir editörde birleştir.

## Çekim listesi ve seslendirme

**0:00–0:12 · Sekme 1: Nimbus raporu, "CANNOT ASSESS — NO SUPPORTED EVIDENCE"**
- Söyle: "We asked an AI to research a vendor that doesn't exist. Most tools would write the report anyway. VendorProof refused — no quote, no claim."
- Anlamı: Var olmayan bir şirketi araştırttık. Çoğu araç yine de rapor yazardı. VendorProof reddetti: alıntı yoksa iddia da yok.

**0:12–0:25 · Sekme 2: `NVIDIA` ve amacı yaz, "Start assessment"a bas, anında onay gelir**
- Söyle: "VendorProof is evidence-first vendor due diligence. You name a company and what you need to know. The research runs in the background."
- Anlamı: VendorProof kanıt odaklı tedarikçi araştırması yapar. Şirketi ve ne öğrenmek istediğini yazarsın, araştırma arka planda çalışır.

**0:25–0:50 · Sekme 3: orchestrator canvas'ı, soldan sağa gez**
- Söyle: "It is built entirely as n8n workflows. One orchestrator: intake and a dedupe cache, then three sub-workflows — plan, collect, verify — a bounded follow-up round, and persistence with Gmail alerts. The whole research pipeline is native nodes except one: the Code node that validates the evidence."
- Anlamı: Tamamen n8n workflow'larıyla kurulu. Bir orchestrator var: girdi kontrolü ve tekrar önleyen cache, ardından üç sub-workflow (planla, topla, doğrula), en fazla bir ek araştırma turu, kayıt ve Gmail uyarısı. Araştırma hattında kanıtı doğrulayan tek bir Code node dışında her şey native node.

**0:50–1:05 · Sekme 4: yeşil execution, Evidence Collector sub-execution'ını aç**
- Söyle: "NVIDIA Nemotron on Nebius Token Factory writes the research plan. Tavily searches and extracts the sources — every query gets an equal share of URLs, all with Split Out, Filter, Remove Duplicates, Limit and Aggregate."
- Anlamı: Araştırma planını Nebius Token Factory'deki NVIDIA Nemotron yazar. Kaynakları Tavily arar ve metinlerini çeker. Her sorgu eşit sayıda URL alır, hepsi Split Out, Filter, Remove Duplicates, Limit ve Aggregate node'larıyla.

**1:05–1:35 · Sekme 5: NVIDIA raporu, risk satırı, bir SUPPORTED bulgu ve alıntısı → Sekme 6, kaynak sayfada Cmd+F ile alıntıyı bul**
- Söyle: "The model must quote its source for every claim. Then deterministic code — not another model — checks that the quote really exists in that exact page. Here is the claim, here is the quote, and here it is on the source. Four claims verified for NVIDIA; five were dropped automatically because the quote didn't check out."
- Anlamı: Model her iddia için kaynağından alıntı yapmak zorunda. Sonra başka bir model değil, deterministik kod o alıntının gerçekten o sayfada olup olmadığını kontrol eder. İşte iddia, işte alıntı, işte kaynakta. NVIDIA için 4 iddia doğrulandı, alıntısı tutmayan 5 iddia otomatik olarak düşürüldü.

**1:35–1:50 · Sekme 5: bir INSUFFICIENT EVIDENCE bulgusuna, sonra review banner'ına in**
- Söyle: "A claim the validator can't prove drops to insufficient evidence — nothing is ever upgraded. When evidence is missing, the report says so and flags a human for review."
- Anlamı: Doğrulayıcının kanıtlayamadığı iddia "yetersiz kanıt"a düşer, hiçbir iddia yükseltilmez. Kanıt eksikse rapor bunu açıkça söyler ve bir insanı incelemeye çağırır.

**1:50–2:00 · Sekme 3 ya da deck'in son slaytı**
- Söyle: "Research once. Verify every claim. Monitor what changes. VendorProof — built on n8n, NVIDIA Nemotron, Nebius and Tavily."
- Anlamı: Bir kez araştır. Her iddiayı doğrula. Değişeni takip et. VendorProof: n8n, NVIDIA Nemotron, Nebius ve Tavily üzerinde.

## Yedek planlar

- Form gönderimi yavaş kalırsa onay ekranından direkt mevcut yeşil execution'a (Sekme 4) kes. Kamerada asla bekleme.
- İnternet giderse `pitch-deck.html`'deki Nimbus ve NVIDIA rapor kartlarıyla mimari slaytı üzerinden anlat (slayt 4–6).

## Başvuru kontrol listesi (Tech Europe dashboard)

- [ ] 2 dakikalık video yüklendi
- [ ] Public repo: https://github.com/umutyesildal/vendorproof (README: kurulum, API'ler, framework'ler, partner teknolojileri, mimari)
- [ ] Partner teknolojileri listelendi: n8n, NVIDIA Nemotron, Nebius Token Factory, Tavily
- [ ] 18:30'dan önce gönderildi (gönderimi sadece sen yaparsın)
