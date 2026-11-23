# Kommunkaos

Ett humoristiskt, politiskt neutralt strategispel om ekonomin i den fiktiva kommunen Lagomköping. React + Vite-migrering som teknisk grund för 0.2. Samma layout, texter, händelser och spelbalans som MVP 0.1.

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

På Linux kan `npx playwright install --with-deps chromium` behövas. Alternativt går det att använda en installerad Chrome genom att sätta `PLAYWRIGHT_CHROME_PATH` till dess körbara fil. Testerna jämför synliga texter mot originalet genom fyra år, val och återstart, kontrollerar tangentbordsreglage, horisontellt överflöde och webbläsarfel. Skärmbilder sparas lokalt i `test-results/`.

## Kodstruktur och bevarade regler

- `src/game/economy.js`: anslag, skatteintäkter och budgetens opinionseffekter.
- `src/game/events.js`: originalets åtta händelser med oförändrade val och effekter.
- `src/game/engine.js`: ren reducer för budget, händelse, årsbokslut, val och återstart. Slumptalet skickas in från gränssnittet.
- `src/components/`: budgetreglage, opinionsmätare, händelsekort och årsbokslut.
- `src/styles/main.css`: originalets CSS och förberedda medie-/rörelsekrokar.

Årsresultatet är fortfarande `−150 + skatt × 95 − summan av anslagsändringarna`. Skatt och anslagsändringar nollställs varje nytt år; opinion och använda händelser följer med. Händelser dras utan upprepning. Opinion begränsas till 0–100. Efter fyra år krävs ett **avrundat** genomsnitt på minst 52 för omval. Händelsekostnader följer originalets årsmodell och blir inte permanenta investeringar eller skulder. Originalets särdrag bevaras: årsbokslutets text inkluderar händelsens ekonomiska effekt, medan sidhuvudets årsresultat räknas om till budgetresultatet utan händelseeffekten. Dessa värden lagras separat som `summaryBalance` och `balance`; detta är inte en ny ekonomisk regel. Headerns opinionssiffra uppdateras efter händelsevalet, precis som i originalet.

För framtida illustrationer: importera lokala filer från `src/assets/` och skicka valfri `illustration={{ src, alt }}` till `EventCard`. För filer i `public/`, använd `import.meta.env.BASE_URL` i sökvägen. Panelerna har stabila `data-phase`-attribut och bilder får klassen `panel-media`. CSS respekterar `prefers-reduced-motion`. Inga bilder, animationer, Gunnar-gestaltningar eller visuella omarbetningar introduceras i denna migrering.

## Publicera på GitHub Pages

**Engångsförberedelse före merge:** kontrollera repositoryts **Settings → Pages → Build and deployment → Source** och välj **GitHub Actions**. Den tidigare rena HTML-sidan behövde inget byggsteg; React-källfilerna kan inte publiceras direkt från branchens rot. Om Pages fortfarande använder branch-publicering måste källan ändras i samband med godkänd övergång. Inställningen ingår inte i Git och ändras inte av denna PR. Behåll den befintliga publiceringen tills övergången är godkänd och redo.

Workflow `.github/workflows/pages.yml` testar och bygger pull requests utan att publicera dem. Efter godkänd merge till `main` testar och bygger samma workflow, laddar upp **enbart `dist/`** och publicerar på [GitHub Pages](https://creutzman.github.io/kommunkaos/). Workflowet kan också startas manuellt från `main` via Actions. Publicering från andra brancher är spärrad. `github-pages`-miljön kan ha separat godkännande enligt repositoryts inställningar.

Granska det första deploy-jobbet och kontrollera `/kommunkaos/` på mobil och dator efter merge. Vid misslyckad build/test sker ingen ny Actions-publicering; ett redan publicerat Pages-artefakt ligger kvar. Om den nya versionen behöver rullas tillbaka: återställ migreringscommiten via en granskad PR och återställ den tidigare Pages-källan vid behov.

Vites instruktioner för base path och Actions-publicering: [Deploying a Static Site](https://vite.dev/guide/static-deploy.html#github-pages).
