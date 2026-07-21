---
layout: page
title: Il Nostro Matrimonio
permalink: /wedding/
nav: false
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

.libretto {
  --ink: #2c2620;
  --muted: #6b6151;
  --gold: #b0894f;
  --rubric: #a24b3b;
  --rule: #e6dcc9;
  --paper: #fbf8f2;
  --paper-2: #f5efe3;

  max-width: 720px;
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 3.25rem) clamp(1.1rem, 4vw, 3rem) 3rem;
  background: var(--paper);
  color: var(--ink);
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 1.12rem;
  line-height: 1.72;
  border: 1px solid var(--rule);
  border-radius: 6px;
  box-shadow: 0 18px 55px -30px rgba(70, 55, 30, 0.5);
}

.libretto p { margin: 0 0 1.05rem; }
/* force text color so the site theme (esp. dark mode) can't override paragraphs to a low-contrast grey */
.libretto p,
.libretto li,
.libretto .verse,
.libretto .celebrant,
.libretto .hymn,
.libretto .reading .body,
.libretto .vow .words { color: var(--ink); }
.libretto a { color: var(--gold); text-decoration: none; border-bottom: 1px solid rgba(176, 137, 79, 0.35); }
.libretto a:hover { color: #8a6a35; border-bottom-color: #8a6a35; }

/* ---- Cover ---- */
.lb-cover { text-align: center; padding: 1rem 0 2.4rem; }
.lb-cover .kicker {
  font-family: 'EB Garamond', serif;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: var(--muted);
  margin-bottom: 1.4rem;
}
.lb-cover .names {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500;
  font-size: clamp(2.6rem, 9vw, 4.1rem);
  line-height: 1.05;
  color: var(--ink);
  margin: 0.2rem 0;
}
.lb-cover .amp { color: var(--gold); font-style: italic; font-weight: 400; display: block; font-size: 0.55em; margin: 0.35rem 0; }
.lb-cover .subtitle { font-style: italic; color: var(--muted); font-size: 1.18rem; margin-top: 1rem; }

/* ---- Section titles ---- */
.lb-section {
  text-align: center;
  margin: 3.1rem 0 1.8rem;
}
.lb-section .num {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  color: var(--gold);
  font-size: 1.05rem;
  margin-bottom: 0.15rem;
}
.lb-section h2 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 1.28rem;
  color: var(--ink);
  margin: 0;
}
.lb-section .ornament {
  color: var(--gold);
  font-size: 1rem;
  margin-top: 0.7rem;
  letter-spacing: 0.5em;
}

/* subheads within a section */
.lb-sub {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: 0.02em;
  color: var(--ink);
  margin: 2rem 0 0.7rem;
  text-align: center;
}

/* ---- Rubrics (stage directions) ---- */
.rubric {
  font-style: italic;
  color: var(--rubric);
  font-size: 0.97rem;
  line-height: 1.55;
  margin: 0.4rem 0 1rem;
  text-align: center;
}

/* ---- Celebrant / spoken prayer ---- */
.celebrant { margin: 0 0 1.1rem; }
.celebrant.v { white-space: normal; }

/* verse-style spoken text (line breaks preserved) */
.verse {
  margin: 0.2rem auto 1.2rem;
  text-align: center;
  line-height: 1.6;
}

/* ---- Assembly / spoken responses ---- */
.response {
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 1.18rem;
  letter-spacing: 0.05em;
  color: var(--gold);
  margin: 1rem 0;
}
.response small { display: block; font-family: 'EB Garamond', serif; font-weight: 400; font-style: italic; font-size: 0.8rem; color: var(--muted); letter-spacing: 0.02em; margin-bottom: 0.1rem; }

/* ---- Song cards ---- */
.song {
  background: var(--paper-2);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--gold);
  border-radius: 5px;
  padding: 0.85rem 1.1rem;
  margin: 1.3rem 0;
  text-align: center;
}
.song .lbl {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.68rem;
  color: var(--muted);
  margin-bottom: 0.3rem;
}
.song .title { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 600; }
.song .note { display: block; font-style: italic; font-size: 0.9rem; color: var(--muted); margin-top: 0.25rem; }
.song .title::before { content: '\266A'; color: var(--gold); margin-right: 0.45rem; }

/* ---- Readings / quotes ---- */
.reading {
  margin: 1.2rem 0;
  padding: 0.2rem 0.3rem;
}
.reading .body { font-style: italic; }
.reading .en {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--rule);
  color: var(--muted);
  font-style: italic;
  font-size: 0.98rem;
}
.reading .src { display: block; text-align: right; font-style: normal; font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; letter-spacing: 0.03em; }

/* hymn lyrics */
.hymn {
  text-align: center;
  font-style: italic;
  color: var(--ink);
  line-height: 1.55;
  margin: 1rem auto;
}
.hymn .stanza { margin-bottom: 1rem; display: block; }

/* vows */
.vows {
  display: grid;
  gap: 1rem;
  margin: 1.4rem 0;
}
.vow {
  background: var(--paper-2);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 1.2rem 1.4rem;
  text-align: center;
}
.vow .who {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.6rem;
}
.vow .words { font-style: italic; line-height: 1.6; }

/* processional / list blocks */
.entrance-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem auto 1.4rem;
  text-align: center;
}
.entrance-list li { padding: 0.28rem 0; border-bottom: 1px solid var(--rule); }
.entrance-list li:last-child { border-bottom: none; }

/* names / saints inline chips */
.litany { text-align: center; font-style: italic; color: var(--ink); line-height: 2; margin: 0.6rem 0 1rem; }
.litany .r { color: var(--gold); font-style: normal; font-size: 0.85rem; letter-spacing: 0.04em; }

.memoriam {
  text-align: center;
  font-size: 0.98rem;
  color: var(--muted);
  font-style: italic;
  line-height: 1.9;
  margin: 0.6rem 0 1rem;
}
.memoriam .lbl { display: block; font-style: normal; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.66rem; color: var(--rubric); margin-bottom: 0.4rem; }

/* section divider */
.lb-flourish { text-align: center; color: var(--gold); letter-spacing: 0.6em; margin: 2.6rem 0 0; font-size: 1rem; }

/* playlist */
.playlist { list-style: none; padding: 0; margin: 1rem 0 0; }
.playlist li { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding: 0.55rem 0; border-bottom: 1px solid var(--rule); }
.playlist li:last-child { border-bottom: none; }
.playlist .moment { font-style: italic; color: var(--muted); font-size: 0.92rem; white-space: nowrap; }
.playlist .track { font-family: 'Cormorant Garamond', serif; font-size: 1.12rem; text-align: right; }
</style>

<div class="libretto">

  <div class="lb-cover">
    <div class="kicker">Rito del Matrimonio</div>
    <div class="names">Emanuele<span class="amp">&amp;</span>Maria&nbsp;Giulia</div>
    <div class="subtitle">Libretto della celebrazione</div>
  </div>

  <!-- ============ ENTRATA ============ -->
  <div class="lb-section">
    <span class="num">i</span>
    <h2>Entrata</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <p class="rubric">Processione d'ingresso, nell'ordine:</p>
  <ul class="entrance-list">
    <li>Damigelle e Testimoni</li>
    <li>Sacerdoti</li>
    <li>Lele con Mami e Papi</li>
    <li>Giuli con Mami e Papi</li>
  </ul>

  <div class="song">
    <span class="lbl">Canto d'ingresso</span>
    <span class="title"><a href="https://open.spotify.com/intl-it/track/03vj8pQhpLH5VnpRpr17xm">You Are Loved</a></span>
  </div>

  <div class="lb-sub">Meditazione breve e incenso</div>
  <p class="rubric">La presenta Mapa:</p>
  <p class="celebrant">«Benvenuti a tutti, oggi siamo qua per accompagnare Giuli e Ema in questo passo importante. Vogliamo iniziare con un momento di meditazione per ascoltare le nostre emozioni e vivere al massimo la celebrazione. Gli sposi hanno scelto una frase per loro rappresentativa della loro storia, dalla quale partire per questi pochi minuti. La frase è la seguente:»</p>

  <div class="reading">
    <p class="body">Proprio come un'onda non ha bisogno di cercare l'acqua, noi non abbiamo bisogno di cercare l'assoluto. L'onda <em>è</em> l'acqua. E voi <em>siete</em> già l'assoluto. I cristiani usano la frase «riposare in Dio». Quando rinunciamo a ogni ricerca, a ogni sforzo, è come se stessimo riposando in Dio. Ci radichiamo fermamente nel momento presente e dimoriamo nell'assoluto. Dimorare nell'assoluto non richiede una fede o un credo. Un'onda non ha bisogno di <em>credere</em> di essere acqua. L'onda è già acqua, qui e ora.</p>
    <p class="body">Per me, Dio non è al di fuori di noi o al di fuori della realtà. Dio è <em>all'interno</em>. Dio non è un'entità esterna che dobbiamo cercare, un'entità in cui credere o non credere. Dio, l'assoluto, è insito in ognuno di noi. Il regno di Dio è disponibile in ogni momento. La domanda è se siamo disponibili noi. Con consapevolezza, concentrazione e intuizione, toccare l'assoluto diventa possibile a ogni respiro e a ogni passo.</p>
  </div>

  <p class="rubric">«Ora vi invito a chiudere gli occhi e a lasciarvi guidare dalla mia voce.»<br>&hellip; Meditazione breve (5&ndash;10 min) &hellip;</p>
  <p class="rubric">Silenzio &mdash; inizia la Messa.</p>

  <!-- ============ MEMORIA DEL BATTESIMO ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">ii</span>
    <h2>Memoria del Battesimo</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <p class="verse">Emanuele e Maria Giulia,<br>
  la Chiesa partecipa alla vostra gioia<br>
  e insieme con i vostri cari<br>
  vi accoglie con grande affetto<br>
  nel giorno in cui davanti a Dio, nostro Padre,<br>
  decidete di realizzare la comunione di tutta la vita.</p>

  <p class="verse">In questo giorno per voi di festa<br>
  il Signore vi ascolti.<br>
  Mandi dal cielo il suo aiuto e vi custodisca.<br>
  Realizzi i desideri del vostro cuore<br>
  ed esaudisca le vostre preghiere.</p>

  <p class="verse">Riconoscenti per essere divenuti figli nel Figlio,<br>
  facciamo ora memoria del Battesimo,<br>
  dal quale, come da seme fecondo,<br>
  nasce e prende vigore l'impegno<br>
  di vivere fedeli nell'amore.</p>

  <p class="rubric">Dopo l'invito iniziale, il sacerdote rimane in piedi alla sede, rivolto verso il popolo. Alcuni ministranti portano dinanzi a lui l'acqua benedetta. Quindi si ringrazia per il dono del Battesimo. Dove è possibile, la memoria del Battesimo avviene presso il fonte battesimale.</p>

  <p class="verse">Padre,<br>
  nel Battesimo del tuo Figlio Gesù al fiume Giordano<br>
  hai rivelato al mondo l'amore sponsale per il tuo popolo.</p>
  <p class="response">Noi ti lodiamo e ti rendiamo grazie.</p>

  <p class="verse">Cristo Gesù,<br>
  dal tuo costato aperto sulla Croce<br>
  hai generato la Chiesa, tua diletta sposa.</p>
  <p class="response">Noi ti lodiamo e ti rendiamo grazie.</p>

  <p class="verse">Spirito Santo,<br>
  potenza del Padre e del Figlio,<br>
  oggi fai risplendere in Emanuele e Maria Giulia<br>
  la veste nuziale della Chiesa.</p>
  <p class="response">Noi ti lodiamo e ti rendiamo grazie.</p>

  <p class="rubric">Il sacerdote continua:</p>
  <p class="verse">Dio onnipotente, origine e fonte della vita,<br>
  che ci hai rigenerati nell'acqua<br>
  con la potenza del tuo Spirito,<br>
  ravviva in tutti noi la grazia del Battesimo,<br>
  e concedi a Emanuele e Maria Giulia un cuore libero e una fede ardente<br>
  perché, purificati nell'intimo,<br>
  accolgano il dono del Matrimonio,<br>
  nuova via della loro santificazione.<br>
  Per Cristo nostro Signore.</p>
  <p class="response">Amen.</p>

  <div class="song">
    <span class="lbl">Canto</span>
    <span class="title"><a href="https://www.youtube.com/watch?v=CO-z-vko0Zs">No Temas</a></span>
    <span class="note">solo prima strofa e ritornello, due volte</span>
  </div>

  <p class="verse">O Dio, che dall'inizio del mondo<br>
  benedici l'uomo e la donna con la grazia della fecondità,<br>
  accogli la nostra preghiera:<br>
  scenda la tua benedizione su Emanuele e Maria Giulia, tuoi figli,<br>
  perché, nel loro Matrimonio,<br>
  siano uniti nel reciproco amore, nell'unico progetto di vita,<br>
  nel comune cammino di santità.<br>
  Per il nostro Signore Gesù Cristo, tuo Figlio, che è Dio,<br>
  e vive e regna con te, nell'unità dello Spirito Santo,<br>
  per tutti i secoli dei secoli.</p>

  <!-- ============ LITURGIA DELLA PAROLA ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">iii</span>
    <h2>Liturgia della Parola</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <div class="lb-sub">Prima lettura</div>
  <p class="rubric">Zio Giovanni e Zia Barbara &middot; dal Cantico dei Cantici</p>
  <div class="reading">
    <p class="body">Chi è colei che sale dal deserto,<br>appoggiata al suo diletto?</p>
    <p class="body">Sotto il melo ti ho svegliata;<br>là dove tua madre ti concepì,<br>là dove ti concepì colei che ti ha partorita.</p>
    <p class="body">Mettimi come sigillo sul tuo cuore,<br>come sigillo sul tuo braccio;<br>perché forte come la morte è l'amore,<br>tenace come il soggiorno dei morti è la passione;<br>le sue vampe sono vampe di fuoco,<br>una fiamma ardente.</p>
    <p class="body">Le grandi acque non possono spegnere l'amore,<br>né i fiumi sommergerlo;<br>se uno desse tutte le ricchezze della sua casa in cambio dell'amore,<br>sarebbe del tutto disprezzato.</p>
    <div class="en">
      <p>Who is she who comes up from the wilderness,<br>leaning on her beloved?</p>
      <p>Under the apple tree I awakened you;<br>there your mother conceived you,<br>there she who gave birth to you conceived you.</p>
      <p>Set me as a seal upon your heart,<br>as a seal upon your arm;<br>for love is as strong as death,<br>passion as relentless as the realm of the dead;<br>its flames are flames of fire,<br>a blazing flame.</p>
      <p>Many waters cannot quench love,<br>nor can rivers sweep it away;<br>if a man were to give all the wealth of his house in exchange for love,<br>he would be utterly despised.</p>
    </div>
  </div>

  <div class="lb-sub">Salmo</div>
  <div class="song">
    <span class="lbl">Cantato</span>
    <span class="title"><a href="https://www.youtube.com/watch?v=jSq7zvrrsCA">Dolce Sentire</a></span>
  </div>
  <div class="hymn">
    <span class="stanza">Dolce è sentire come nel mio cuore<br>ora umilmente sta nascendo amore.<br>Dolce è capire che non son più solo<br>ma che son parte di una immensa vita<br>che generosa risplende intorno a me,<br>dono di Lui, del Suo immenso amore.</span>
    <span class="stanza">Ci ha dato il cielo e le chiare stelle,<br>fratello sole e sorella luna,<br>la madre terra con frutti, prati e fiori,<br>il fuoco e il vento, l'aria e l'acqua pura,<br>fonte di vita per le sue creature.<br>Dono di Lui, del Suo immenso amore.</span>
    <span class="stanza">Sia laudato, nostro Signore<br>che ha creato l'universo intero;<br>sia laudato, nostro Signore,<br>noi tutti siamo sue creature.<br>Dono di Lui, del Suo immenso amor.<br>Beato chi lo serve in umiltà.</span>
  </div>

  <div class="song">
    <span class="lbl">Canto al Vangelo</span>
    <span class="title"><a href="https://www.youtube.com/watch?v=6ol9QL9heeA">Alleluia &mdash; Lode Cosmica</a></span>
  </div>

  <div class="lb-sub">Vangelo</div>
  <p class="rubric">&#10013; Dal Vangelo secondo Matteo (7, 21.24-29)</p>
  <div class="reading">
    <p class="body">In quel tempo, Gesù disse ai suoi discepoli:</p>
    <p class="body">«Non chiunque mi dice: "Signore, Signore", entrerà nel regno dei cieli, ma colui che fa la volontà del Padre mio che è nei cieli.</p>
    <p class="body">Perciò chiunque ascolta queste mie parole e le mette in pratica sarà simile a un uomo saggio, che ha costruito la sua casa sulla roccia. Cadde la pioggia, strariparono i fiumi, soffiarono i venti e si abbatterono su quella casa, ma essa non cadde, perché era fondata sulla roccia.</p>
    <p class="body">Chiunque ascolta queste mie parole e non le mette in pratica sarà simile a un uomo stolto, che ha costruito la sua casa sulla sabbia. Cadde la pioggia, strariparono i fiumi, soffiarono i venti e si abbatterono su quella casa, ed essa cadde e la sua rovina fu grande».</p>
  </div>
  <p class="response"><small>Parola del Signore</small>Rendiamo grazie a Dio</p>

  <p class="rubric">Omelia del sacerdote.</p>

  <!-- ============ INTERROGAZIONI ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">iv</span>
    <h2>Interrogazioni prima del consenso</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <p class="verse">Carissimi Emanuele e Maria Giulia,<br>
  siete venuti nella casa del Signore,<br>
  davanti al ministro della Chiesa e davanti alla comunità,<br>
  perché la vostra decisione di unirvi in matrimonio<br>
  riceva il sigillo dello Spirito Santo,<br>
  sorgente dell'amore fedele e inesauribile.<br>
  Ora Cristo vi rende partecipi dello stesso amore<br>
  con cui egli ha amato la sua Chiesa,<br>
  fino a dare se stesso per lei.</p>
  <p class="rubric">Vi chiedo pertanto di esprimere le vostre intenzioni.</p>

  <p class="verse">Emanuele e Maria Giulia,<br>
  siete venuti a celebrare il Matrimonio<br>
  senza alcuna costrizione, in piena libertà<br>
  e consapevoli del significato della vostra decisione?</p>
  <p class="response"><small>Gli sposi rispondono</small>Sì.</p>

  <p class="verse">Siete disposti, seguendo la via del Matrimonio,<br>
  ad amarvi e a onorarvi l'un l'altro per tutta la vita?</p>
  <p class="response"><small>Gli sposi rispondono</small>Sì.</p>

  <p class="verse">Siete disposti ad accogliere con amore<br>
  i figli che Dio vorrà donarvi<br>
  e a educarli secondo la legge di Cristo e della sua Chiesa?</p>
  <p class="response"><small>Gli sposi rispondono</small>Sì.</p>

  <!-- ============ CONSENSO ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">v</span>
    <h2>Manifestazione del consenso</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <p class="verse">Alla presenza di Dio<br>
  e davanti alla Chiesa qui riunita,<br>
  datevi la mano destra ed esprimete il vostro consenso.<br>
  Il Signore, inizio e compimento del vostro amore,<br>
  sia con voi sempre.</p>

  <div class="vows">
    <div class="vow">
      <div class="who">Lo sposo</div>
      <p class="words">Io Emanuele, accolgo te, Maria Giulia, come mia sposa. Con la grazia di Cristo prometto di esserti fedele sempre, nella gioia e nel dolore, nella salute e nella malattia, e di amarti e onorarti tutti i giorni della mia vita.</p>
    </div>
    <div class="vow">
      <div class="who">La sposa</div>
      <p class="words">Io Maria Giulia, accolgo te, Emanuele, come mio sposo. Con la grazia di Cristo prometto di esserti fedele sempre, nella gioia e nel dolore, nella salute e nella malattia, e di amarti e onorarti tutti i giorni della mia vita.</p>
    </div>
  </div>

  <div class="lb-sub">Accoglienza del consenso</div>
  <p class="rubric">Il sacerdote, stendendo la mano sulle mani unite degli sposi, dice:</p>
  <p class="verse">Il Signore onnipotente e misericordioso<br>
  confermi il consenso<br>
  che avete manifestato davanti alla Chiesa<br>
  e vi ricolmi della sua benedizione.<br>
  L'uomo non osi separare ciò che Dio unisce.</p>
  <p class="response"><small>Tutti</small>Amen.</p>

  <!-- ============ ANELLI ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">vi</span>
    <h2>Benedizione e consegna degli anelli</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <p class="rubric">Sono presentati gli anelli. Li portano le gemelle e Bea. Il sacerdote li benedice:</p>
  <p class="verse">Signore, benedici e santifica l'amore di questi sposi:<br>
  l'anello che porteranno come simbolo di fedeltà<br>
  li richiami continuamente al vicendevole amore.<br>
  Per Cristo nostro Signore.</p>
  <p class="response"><small>Tutti</small>Amen.</p>

  <p class="rubric">Il sacerdote consegna agli sposi gli anelli. Lo sposo, mettendo l'anello al dito anulare della sposa, dice:</p>
  <p class="verse">Maria Giulia, ricevi questo anello,<br>
  segno del mio amore e della mia fedeltà.<br>
  Nel nome del Padre e del Figlio e dello Spirito Santo.</p>

  <p class="rubric">Quindi la sposa, mettendo l'anello al dito anulare dello sposo, dice:</p>
  <p class="verse">Emanuele, ricevi questo anello,<br>
  segno del mio amore e della mia fedeltà.<br>
  Nel nome del Padre e del Figlio e dello Spirito Santo.</p>

  <!-- ============ PREGHIERA DEI FEDELI ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">vii</span>
    <h2>Preghiera dei fedeli</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <p class="rubric">Rispondiamo alle invocazioni tutti insieme:</p>
  <p class="response">Ascoltaci, o Signore</p>

  <ul class="entrance-list">
    <li><em>Martina</em> &middot; per gli ammalati</li>
    <li><em>Eugenio</em> &middot; per chi vive nella povertà</li>
    <li><em>Francesco</em> &middot; per gli animali e la natura, citando san Francesco</li>
    <li><em>Flor</em> &middot; per i futuri sposi <span class="rubric" style="display:inline">(esp)</span></li>
    <li><em>Zia Benni</em> &middot; per il Papa</li>
    <li><em>Edoardo Rossi</em> &middot; per le famiglie degli sposi, che siano strumenti di pace</li>
    <li><em>Enxell</em> &middot; sulla guerra <span class="rubric" style="display:inline">(eng)</span></li>
    <li><em>Ferdi</em> &middot; sull'amore in tutte le sue forme <span class="rubric" style="display:inline">(eng)</span></li>
    <li><em>Micol</em> &middot; sulla genitorialità</li>
    <li><em>Simone</em> &middot; sulla tolleranza verso tutte le forme di spiritualità</li>
    <li><em>Donato</em> &middot; per i capi di stato</li>
  </ul>

  <div class="lb-sub">Invocazione dei Santi</div>
  <p class="litany">
  Santa Teresa di Calcutta <span class="r">prega per noi</span><br>
  San Francesco <span class="r">prega per noi</span><br>
  Sant'Emanuele &middot; Santa Giulia <span class="r">pregate per noi</span><br>
  Santa Maria &middot; San Giuseppe <span class="r">pregate per noi</span><br>
  San Giovanni Battista <span class="r">prega per noi</span><br>
  San Gabriele &middot; Sant'Ubaldo &middot; Sant'Anna <span class="r">pregate per noi</span><br>
  Santi Apostoli ed Evangelisti <span class="r">pregate per noi</span>
  </p>

  <p class="memoriam">
    <span class="lbl">Nel ricordo di</span>
    Mamma di Francesco &middot; Papà di Beppe &middot; Mamma di Laurita &middot; Papà di Ferdi &middot; Genitori di Barbara<br>
    Giorgio &middot; Anna &middot; Giovanni &middot; Rossano &middot; Aurelia &middot; Lino &middot; Gianni &middot; Franca &middot; Peter &middot; Simba &middot; Nicoletta &middot; Giuseppa
  </p>

  <!-- ============ LITURGIA EUCARISTICA ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">viii</span>
    <h2>Liturgia Eucaristica</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <div class="song">
    <span class="lbl">Offertorio</span>
    <span class="title"><a href="https://www.youtube.com/watch?v=58kcjV73H_4">Re dei Re</a></span>
    <span class="note">oppure <em>Meraviglioso</em>, Negramaro</span>
  </div>

  <p class="verse">Effondi, Signore, su Emanuele e Maria Giulia<br>
  lo Spirito del tuo amore,<br>
  perché diventino un cuore solo e un'anima sola:<br>
  nulla separi questi sposi che tu hai unito,<br>
  e, ricolmati della tua benedizione, nulla li affligga.<br>
  Per Cristo nostro Signore.</p>
  <p class="response">Amen.</p>

  <div class="song">
    <span class="lbl">Santo</span>
    <span class="title"><a href="https://www.youtube.com/watch?v=42VNDtoWZsA">Osanna nelle altezze</a></span>
    <span class="note">oppure <em>Santo è il Signore, Dio dell'universo</em>, a due voci</span>
  </div>

  <div class="lb-sub">Padre Nostro</div>

  <!-- ============ BENEDIZIONE NUZIALE ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">ix</span>
    <h2>Benedizione nuziale</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <p class="rubric">Il velo, portato da Miriam, è steso sugli sposi; i testimoni si dispongono in cerchio attorno a loro e si eleva un canto di benedizione.</p>
  <div class="song">
    <span class="lbl">Canto di benedizione</span>
    <span class="title"><a href="https://www.youtube.com/watch?v=QnC7z03QkEM">The Blessing</a></span>
  </div>

  <p class="rubric">Terminato il Padre nostro, il sacerdote, rivolto verso gli sposi, invoca su di loro la benedizione di Dio. A mani giunte, invita i presenti a pregare:</p>
  <p class="verse">Fratelli e sorelle, raccolti in preghiera,<br>
  invochiamo su questi sposi, Emanuele e Maria Giulia,<br>
  la benedizione di Dio:<br>
  egli, che oggi li ricolma di grazia<br>
  con il sacramento del Matrimonio,<br>
  li accompagni sempre con la sua protezione.</p>

  <p class="rubric">Tutti pregano per breve tempo in silenzio. Poi il sacerdote, tenendo stese le mani sugli sposi, continua:</p>
  <p class="verse">Padre santo, creatore dell'universo,<br>
  che hai formato l'uomo e la donna a tua immagine<br>
  e hai voluto benedire la loro unione,<br>
  ti preghiamo umilmente per questi tuoi figli,<br>
  che oggi si uniscono con il sacramento nuziale.</p>
  <p class="response">Ti lodiamo, Signore, e ti benediciamo:<br><small style="text-transform:none;letter-spacing:0;font-size:0.9rem">eterno è il tuo amore per noi.</small></p>

  <p class="verse">Scenda, o Signore, su questi sposi Emanuele e Maria Giulia<br>
  la ricchezza delle tue benedizioni,<br>
  e la forza del tuo Santo Spirito<br>
  infiammi dall'alto i loro cuori,<br>
  perché nel dono reciproco dell'amore<br>
  allietino di figli la loro famiglia e la comunità ecclesiale.</p>
  <p class="response">Ti supplichiamo, Signore:<br><small style="text-transform:none;letter-spacing:0;font-size:0.9rem">ascolta la nostra preghiera.</small></p>

  <p class="verse">Ti lodino, Signore, nella gioia,<br>
  ti cerchino nella sofferenza;<br>
  godano del tuo sostegno nella fatica<br>
  e del tuo conforto nella necessità;<br>
  ti preghino nella santa assemblea,<br>
  siano tuoi testimoni nel mondo.<br>
  Vivano a lungo nella prosperità e nella pace<br>
  e, con tutti gli amici che ora li circondano,<br>
  giungano alla felicità del tuo regno.<br>
  Per Cristo nostro Signore.</p>
  <p class="response">Amen.</p>

  <p class="rubric">Segue lo scambio del dono della pace. Gli sposi e i presenti possono ricevere la comunione sotto le due specie.</p>

  <!-- ============ COMUNIONE ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">x</span>
    <h2>Comunione</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <div class="song">
    <span class="lbl">Canto di comunione</span>
    <span class="title"><a href="https://www.youtube.com/watch?v=V4ysFYghjHk">Danziamo dentro al Fuoco</a></span>
  </div>

  <p class="rubric">Subito dopo la comunione, momento di silenzio guidato da Beppe:</p>
  <p class="celebrant">«In conclusione raccogliamo questa gratitudine verso questo momento appena passato insieme, ricco di amore e presenza. Vi lascio con questa frase:»</p>
  <div class="reading">
    <p class="body">No coming, no going.<br>No after, no before.<br>I hold you close to me.<br>I release you to be free.<br>Because I am in you and you are in me.</p>
  </div>

  <!-- ============ CONCLUSIONE ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <span class="num">xi</span>
    <h2>Riti di conclusione</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <p class="rubric">Il sacerdote benedice gli sposi e il popolo dicendo:</p>
  <p class="verse">Dio, eterno Padre,<br>
  vi conservi uniti nel reciproco amore;<br>
  la pace di Cristo abiti in voi<br>
  e rimanga sempre nella vostra casa.</p>
  <p class="response">Amen.</p>
  <p class="verse">Abbiate benedizione nei figli,<br>
  conforto dagli amici, vera pace con tutti.</p>
  <p class="response">Amen.</p>
  <p class="verse">Siate nel mondo testimoni dell'amore di Dio<br>
  perché i poveri e i sofferenti,<br>
  che avranno sperimentato la vostra carità,<br>
  vi accolgano grati un giorno nella casa del Padre.</p>
  <p class="response">Amen.</p>

  <div class="song">
    <span class="lbl">Canto finale</span>
    <span class="title"><a href="https://www.youtube.com/watch?v=egf81MYejak">Inno all'Amore</a></span>
    <span class="note">Debora Vezzani</span>
  </div>

  <p class="rubric">Pensieri agli sposi &mdash; si passa il microfono.</p>

  <!-- ============ MUSICHE ============ -->
  <div class="lb-flourish">&#10087;</div>
  <div class="lb-section">
    <h2>Le Musiche della Celebrazione</h2>
    <div class="ornament">&#10086;</div>
  </div>

  <ul class="playlist">
    <li><span class="moment">Ingresso</span><span class="track"><a href="https://www.youtube.com/watch?v=jfs265p4yMg">You Are Loved</a></span></li>
    <li><span class="moment">Memoria del Battesimo</span><span class="track"><a href="https://www.youtube.com/watch?v=CO-z-vko0Zs">No Temas</a> &middot; J. Olguín</span></li>
    <li><span class="moment">Salmo</span><span class="track"><a href="https://www.youtube.com/watch?v=jSq7zvrrsCA">Dolce Sentire</a></span></li>
    <li><span class="moment">Alleluia</span><span class="track"><a href="https://www.youtube.com/watch?v=6ol9QL9heeA">Lode Cosmica</a></span></li>
    <li><span class="moment">Offertorio</span><span class="track"><a href="https://www.youtube.com/watch?v=9zbbr_GHXSo">Re dei Re</a> &middot; opp. <a href="https://www.youtube.com/watch?v=MUjWGGtMdJk">Meraviglioso</a></span></li>
    <li><span class="moment">Santo</span><span class="track"><a href="https://www.youtube.com/watch?v=VuIIk8Zu484">Osanna nelle altezze</a></span></li>
    <li><span class="moment">Benedizione nuziale</span><span class="track"><a href="https://www.youtube.com/watch?v=Zp6aygmvzM4">The Blessing</a> &middot; Kari Jobe &amp; Cody Carnes</span></li>
    <li><span class="moment">Comunione</span><span class="track"><a href="https://www.youtube.com/watch?v=V4ysFYghjHk">Danziamo dentro al fuoco</a></span></li>
    <li><span class="moment">Conclusione</span><span class="track"><a href="https://www.youtube.com/watch?v=egf81MYejak">Inno all'Amore</a> &middot; Debora Vezzani</span></li>
  </ul>

  <div class="lb-cover" style="padding-top:2.6rem;padding-bottom:0.5rem;">
    <div class="amp" style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;color:var(--gold);">&#10086;</div>
    <div class="subtitle" style="margin-top:0.4rem;">Emanuele &amp; Maria Giulia</div>
  </div>

</div>
