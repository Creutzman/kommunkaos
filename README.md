# Kommunkaos

Ett humoristiskt, politiskt neutralt strategispel om ekonomin i den fiktiva kommunen Lagomköping. Kommunkaos 0.2 har en illustrerad spelvy i React + Vite, färgade budgetkort och ekonomichefen Gunnar Siffrén. Spelregler, ekonomi, händelser och valvillkor är oförändrade från MVP 0.1.

## Starta och bygga

Kräver Node.js 22.12 eller senare (CI använder Node 22) och npm.

```sh
npm ci
npm run dev
```

Öppna adressen som Vite visar, med `/kommunkaos/` i sökvägen.

```sh
npm test
npm run build
npm run preview
```

Produktionsfiler skapas i `dist/`. Förhandsgranska på `http://localhost:4173/kommunkaos/`. Vite har `base: '/kommunkaos/'` för både JavaScript, CSS och importerade bilder. `dist/` checkas inte in. Spelet körs helt i webbläsaren utan backend, databas, externa API:er eller sparade spelsessioner.

## Tester

`npm test` kör Node:s inbyggda testverktyg. En oförändrad kopia av originalet från commit `f787cc7c8064c227fdc6641a0598156b51e5bc5f` finns i `tests/fixtures/mvp-0.1.html` som oberoende referens. Jämförelsetester kör originalets JavaScript i en isolerad VM och jämför ekonomi, opinion och händelser med den nya motorn: 1 224 budget/händelsekombinationer och 20 hela mandatperioder. Valgräns, avrundning, opinionsgränser, återstart och händelseurval täcks också.

Webbläsartester körs mot produktionsbygget på mobil (375 px) och dator (1280 px):

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

På Linux kan `npx playwright install --with-deps chromium` behövas. Alternativt går det att använda en installerad Chrome genom att sätta `PLAYWRIGHT_CHROME_PATH` till dess körbara fil. Åtta webbläsartester jämför spelvärden, reglagegränser, händelsetexter, val och bokslut mot originalet genom fyra år, val och återstart. De kontrollerar också Gunnars reaktioner, tangentbordsreglage, 320 px bredd, reducerad rörelse, horisontellt överflöde och webbläsarfel. Skärmbilder sparas lokalt i `test-results/`.

## Kodstruktur och bevarade regler

- `src/game/economy.js`: anslag, skatteintäkter och budgetens opinionseffekter.
- `src/game/events.js`: originalets åtta händelser med oförändrade val och effekter.
- `src/game/engine.js`: ren reducer för budget, händelse, årsbokslut, val och återstart. Slumptalet skickas in från gränssnittet.
- `src/components/`: budgetreglage, opinionsmätare, händelsekort och årsbokslut.
- `src/styles/main.css`: responsiv spelvy med färgade budgetkort, tydliga fokusmarkeringar och stöd för reducerad rörelse.

Årsresultatet är fortfarande `−150 + skatt × 95 − summan av anslagsändringarna`. Skatt och anslagsändringar nollställs varje nytt år; opinion och använda händelser följer med. Händelser dras utan upprepning. Opinion begränsas till 0–100. Efter fyra år krävs ett **avrundat** genomsnitt på minst 52 för omval. Händelsekostnader följer originalets årsmodell och blir inte permanenta investeringar eller skulder. Originalets särdrag bevaras: årsbokslutets text inkluderar händelsens ekonomiska effekt, medan sidhuvudets årsresultat räknas om till budgetresultatet utan händelseeffekten. Dessa värden lagras separat som `summaryBalance` och `balance`; detta är inte en ny ekonomisk regel. Headerns opinionssiffra uppdateras efter händelsevalet, precis som i originalet.

## Visuell makeover · uppdrag 02

`Town.jsx` och `Gunnar.jsx` innehåller egna lokala SVG-illustrationer. Inga tidigare mockupbilder eller karaktärsbilder fanns tillgängliga i projektet eller den åtkomliga chattreferensen. De nya illustrationerna tolkar den överenskomna riktningen; de är inte en exakt återgivning av en referensbild. Inga externa bild-, typsnitts- eller API-anrop behövs.

Gunnar reagerar på budgetresultat, låg opinion, händelsefas, bokslutets `summaryBalance` och valutfall. Kommentarerna är enbart presentation och ändrar aldrig spelmotorn eller föreslår effekter som inte finns i den. Två ansiktsuttryck, en levande pratbubbla och diskreta övergångar förmedlar reaktionen. `prefers-reduced-motion` stänger av övergångarna.

Budgetens sex verksamheter har egna färger, reglage och belopp. Reglagens gränser och steg är oförändrade. Årsindikatorn visar mandatperioden, medan årsresultatet fortfarande visar budgeten före händelser; bokslutet innehåller händelsens effekt. På mobil visas Gunnar kompakt före besluten. Tangentbordsfokus följer den nya panelens rubrik när en fas eller ett budgetår byts.

Panelerna behåller stabila `data-phase`-attribut. `EventCard` stödjer fortsatt valfri `illustration={{ src, alt }}`. Importera framtida lokala bilder från `src/assets/`, eller använd `import.meta.env.BASE_URL` för sökvägar till `public/`.

## Publicera på GitHub Pages

**Engångsförberedelse före merge:** kontrollera repositoryts **Settings → Pages → Build and deployment → Source** och välj **GitHub Actions**. Den tidigare rena HTML-sidan behövde inget byggsteg; React-källfilerna kan inte publiceras direkt från branchens rot. Om Pages fortfarande använder branch-publicering måste källan ändras i samband med godkänd övergång. Inställningen ingår inte i Git och ändras inte av denna PR. Behåll den befintliga publiceringen tills övergången är godkänd och redo.

Workflow `.github/workflows/pages.yml` testar och bygger pull requests utan att publicera dem. Efter godkänd merge till `main` testar och bygger samma workflow, laddar upp **enbart `dist/`** och publicerar på [GitHub Pages](https://creutzman.github.io/kommunkaos/). Workflowet kan också startas manuellt från `main` via Actions. Publicering från andra brancher är spärrad. `github-pages`-miljön kan ha separat godkännande enligt repositoryts inställningar.

Granska det första deploy-jobbet och kontrollera `/kommunkaos/` på mobil och dator efter merge. Vid misslyckad build/test sker ingen ny Actions-publicering; ett redan publicerat Pages-artefakt ligger kvar. Om den nya versionen behöver rullas tillbaka: återställ migreringscommiten via en granskad PR och återställ den tidigare Pages-källan vid behov.

Vites instruktioner för base path och Actions-publicering: [Deploying a Static Site](https://vite.dev/guide/static-deploy.html#github-pages).
