import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

type VpicResponse<T> = {
  Count: number;
  Results: T[];
};

type VpicMake = {
  MakeId: number;
  MakeName: string;
  VehicleTypeName?: string;
};

type VpicModel = {
  Model_Name: string;
};

type WikidataBinding = {
  manufacturerLabel: { value: string };
  modelLabel: { value: string };
};

type WikidataResponse = {
  results: {
    bindings: WikidataBinding[];
  };
};

const OUTPUT_PATH = resolve(import.meta.dir, "../src/utils/motorcycle-catalog.generated.ts");

const turkeyPriorityBrands = [
  "Apec",
  "Aprilia",
  "Arora",
  "Asya",
  "Bajaj",
  "Benelli",
  "BMW",
  "CFMoto",
  "Ducati",
  "Falcon",
  "Haojue",
  "Harley-Davidson",
  "Hero",
  "Honda",
  "Hyosung",
  "Husqvarna",
  "Indian",
  "Italjet",
  "Kanuni",
  "Kawasaki",
  "Keeway",
  "Kral",
  "KTM",
  "Kuba",
  "Kymco",
  "Lambretta",
  "Mondial",
  "Moto Guzzi",
  "Motolux",
  "MV Agusta",
  "Peugeot",
  "Piaggio",
  "QJMotor",
  "Ramzey",
  "RKS",
  "Royal Enfield",
  "Salcano",
  "Segway",
  "Suzuki",
  "SYM",
  "Togo",
  "Triumph",
  "TVS",
  "Ural",
  "Vespa",
  "Voge",
  "Volta",
  "Yamaha",
  "Yuki",
  "Zero",
  "Zontes",
] as const;

const brandAliasMap: Record<string, string> = {
  apec: "Apec",
  aprilia: "Aprilia",
  arora: "Arora",
  asya: "Asya",
  bajaj: "Bajaj",
  bajajauto: "Bajaj",
  benelli: "Benelli",
  bmw: "BMW",
  bmwmotorrad: "BMW",
  cfmoto: "CFMoto",
  ducati: "Ducati",
  falcon: "Falcon",
  falconmotorcycles: "Falcon",
  haojue: "Haojue",
  harleydavidson: "Harley-Davidson",
  hero: "Hero",
  heromotocorp: "Hero",
  honda: "Honda",
  hondamotorcompany: "Honda",
  hyosung: "Hyosung",
  hyosungmotorsamerica: "Hyosung",
  hyosungmotormachineryinc: "Hyosung",
  krmotors: "Hyosung",
  husqvarna: "Husqvarna",
  husqvarnagroup: "Husqvarna",
  husqvarnamotorcycles: "Husqvarna",
  indian: "Indian",
  indianmotorcycle: "Indian",
  italjet: "Italjet",
  kanuni: "Kanuni",
  kawasaki: "Kawasaki",
  kawasakiheavyindustries: "Kawasaki",
  kawasakimotors: "Kawasaki",
  keeway: "Keeway",
  kral: "Kral",
  ktm: "KTM",
  kuba: "Kuba",
  kymco: "Kymco",
  kwangyangmotor: "Kymco",
  lambretta: "Lambretta",
  mondial: "Mondial",
  motoguzzi: "Moto Guzzi",
  motolux: "Motolux",
  mvagusta: "MV Agusta",
  peugeot: "Peugeot",
  peugeotmotocycles: "Peugeot",
  piaggio: "Piaggio",
  qjmotor: "QJMotor",
  ramzey: "Ramzey",
  rks: "RKS",
  royalenfield: "Royal Enfield",
  royalenfieldindia: "Royal Enfield",
  salcano: "Salcano",
  segway: "Segway",
  suzuki: "Suzuki",
  suzukimotorcorporation: "Suzuki",
  suzukimotorcycleindialimited: "Suzuki",
  sym: "SYM",
  togo: "Togo",
  triumph: "Triumph",
  triumphmotorcyclesltd: "Triumph",
  tvs: "TVS",
  tvsmotorcompany: "TVS",
  ural: "Ural",
  vespa: "Vespa",
  motovespasa: "Vespa",
  voge: "Voge",
  volta: "Volta",
  yamaha: "Yamaha",
  yamahamotorcompany: "Yamaha",
  yamahafactoryracing: "Yamaha",
  yuki: "Yuki",
  zero: "Zero",
  zontes: "Zontes",
};

const manualFallbacks: Record<string, string[]> = {
  Apec: ["APX5 125", "ALFA 125", "PS3 50"],
  Falcon: ["Freedom 250", "Techno 125", "Wonder 150"],
  Haojue: ["DR160", "DL250", "HJ125"],
  Hyosung: ["GV250 Aquila", "GV300S Aquila", "GV650 Aquila", "GT250R", "GT650R", "GT650", "GD250N", "ST7", "RT125D Karion"],
  Kral: ["KR-11", "KR-23", "KR-25"],
  Kuba: ["Bluebird", "Cruiser 250", "Superlight 200", "TK03", "Trendy 50", "Brilliant 125 Pro"],
  Motolux: ["F5 125", "MRS 125", "MT 125", "Nirvana 125", "Rossi 50"],
  Ramzey: ["QM 125T-10D", "GQ 125-20", "Mopet 100"],
  RKS: ["RSIII Pro", "RZ125", "RZ150", "RZ125X", "RZ150X", "RZ250S", "Titanic 150", "Freccia 150", "Bitter 125", "Spontini 110", "Newlight 125", "ICON 50 ST", "ROSA 50 PRO", "LT50PRO PLUS", "PARMIDA 50", "LTM125", "NEON125", "VPS125 PRO", "DES125", "VRS125", "LTR125", "REALE125", "REALE125X", "LINCE125", "SC150RE", "VIESTE 249", "FORT250", "BLADE 250", "SVT650X", "SRT800SX", "SRT900SX", "SRT902S", "SRK125R", "SRK250RS", "R250", "SRK250RR", "SRK400RR", "SRK450RA", "SRK550RS", "M250", "125N", "SRV125", "K-LIGHT 250", "SRV250VS", "SRV700", "C1002V", "SRK125S", "SRK250", "SRK250S", "A250", "M502N", "SRK550", "GTR50", "RK125S", "RK250S", "RT250", "BLACKWOLF", "BLACKSTER 250", "BLACKSTER 250i", "BLACKSTER Chopper", "RODOS"],
  Salcano: ["Capri 50", "Nova 50", "Wolf 125", "XRS 125"],
  Togo: ["T3", "T4", "T10", "T11", "T12", "Maxi 50", "Maxi 125"],
  Voge: ["300R", "300RR", "300 Rally", "525ACX", "525DSX", "650DSX", "900DSX"],
};

const motorcycleOnlyBrands = new Set([
  "Apec",
  "Aprilia",
  "Arora",
  "Asya",
  "Bajaj",
  "Benelli",
  "CFMoto",
  "Ducati",
  "Falcon",
  "Haojue",
  "Harley-Davidson",
  "Hero",
  "Hyosung",
  "Husqvarna",
  "Indian",
  "Italjet",
  "Kanuni",
  "Keeway",
  "Kral",
  "KTM",
  "Kuba",
  "Kymco",
  "Lambretta",
  "Mondial",
  "Moto Guzzi",
  "Motolux",
  "MV Agusta",
  "QJMotor",
  "Ramzey",
  "RKS",
  "Royal Enfield",
  "Salcano",
  "Segway",
  "SYM",
  "Togo",
  "Triumph",
  "TVS",
  "Ural",
  "Vespa",
  "Voge",
  "Volta",
  "Yuki",
  "Zero",
  "Zontes",
]);

const allowPatternsByBrand: Record<string, RegExp> = {
  BMW: /(^C\s\d|^CE\s\d|^F\s\d|^G\s\d|^K\s\d|^R\s?\d|^S\s1000|^M\s1000|^HP2|^HP4)/,
  Honda: /(CB|CBR|CRF|CL\d|NC\d|PCX|SH\d|ADV|NX\d|X-ADV|REBEL|FORZA|TRANSALP|AFRICA|NT1100|GOLD WING)/,
  Kawasaki: /(NINJA|ZX-|VERSYS|VULCAN|ELIMINATOR|\bZ125\b|\bZ400\b|\bZ500\b|\bZ650\b|\bZ900\b|KLR|W800)/,
  Peugeot: /(TWEET|DJANGO|KISBEE|PULSION|XP400|METROPOLIS)/,
  Piaggio: /(LIBERTY|MEDLEY|BEVERLY|MP3)/,
  Suzuki: /(GSX|GSR|V-STROM|DL\d|BURGMAN|HAYABUSA|ADDRESS|AVENIS|SV650|KATANA)/,
  Yamaha: /(MT-|\bR1\b|\bR3\b|\bR6\b|\bR7\b|\bR25\b|YZF|TRACER|TENERE|XSR|XMAX|NMAX|TMAX|AEROX|RAYZR|YBR|CRYPTON|DRAG ?STAR|V-STAR|XV\d|VIRAGO|BOLT|FJR|FAZER|FZ\d|XT\d|WR\d|SUPER TENERE|XS\d|XJ\d|TZR|DT\d|RX\d|RD\d|PW\d)/,
};

const bannedModelsByBrand: Record<string, Set<string>> = {
  BMW: new Set(["1 SERIES", "2 SERIES", "3 SERIES", "4 SERIES", "5 SERIES", "7 SERIES", "I3", "I4", "I8", "IX", "X1", "X3", "X4", "X5", "X6", "X7", "Z4"]),
  Honda: new Set(["ACCORD", "CIVIC", "CR-V", "HR-V", "JAZZ", "CITY", "FIT", "PILOT", "ODYSSEY", "RIDGELINE"]),
  Suzuki: new Set(["ALTO", "BALENO", "CELERIO", "JIMNY", "SWIFT", "S-CROSS", "VITARA", "XL7"]),
  Peugeot: new Set(["107", "108", "206", "207", "208", "2008", "3008", "301", "308", "408", "5008", "508", "RIFTER"]),
};

function normalizeKey(value: string) {
  return value
    .toLocaleLowerCase("en-US")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function formatBrandName(raw: string) {
  const normalized = normalizeKey(raw);
  return brandAliasMap[normalized] ?? raw.trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatModelName(raw: string, brandName?: string) {
  let normalized = raw.trim().replace(/\s+/g, " ");

  if (brandName) {
    normalized = normalized.replace(
      new RegExp(`^${escapeRegExp(brandName).replace(/\\-/g, "[- ]?")}\\s+`, "i"),
      ""
    );
  }

  normalized = normalized
    .replace(/\s*\((motorcycle|motorbike)\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized
    .split(" ")
    .map((token) => {
      if (!token) return token;
      if (/[0-9]/.test(token) || /[-/'’]/.test(token) || token === token.toUpperCase()) {
        return token.toUpperCase();
      }
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join(" ");
}

function shouldKeepModel(
  brandName: string,
  rawModelName: string,
  source: "nhtsa" | "wikidata" | "generic" = "generic"
) {
  const model = rawModelName.trim().toUpperCase();

  if (!model || model.length < 2) return false;
  if (/^Q\d+$/.test(model)) return false;
  if (model === brandName.toUpperCase()) return false;
  if (/(TRAILER|SEMI-TRAILER|BUS|TRUCK|TRACTOR|PASSENGER CAR|MULTIPURPOSE)/.test(model)) return false;
  if (/(ATV|UTV|SIDE BY SIDE|CFORCE|UFORCE|ZFORCE|ROVER|RZR|TERYX|MULE)/.test(model)) return false;
  if (/^(SCOOTER|MOTORCYCLE|ON ROAD MOTORCYCLE|BASE|TOUR|ROADSTER|SPORT|CRUISER|OFF ROAD|ALL TERRAIN VEHICLE)$/.test(model)) return false;
  if (/(CONCEPT|PROTOTYPE|INCOMPLETE)/.test(model)) return false;

  const bannedSet = bannedModelsByBrand[brandName];
  if (bannedSet?.has(model)) return false;

  if (source === "wikidata") {
    return true;
  }

  if (motorcycleOnlyBrands.has(brandName)) {
    return true;
  }

  const allowPattern = allowPatternsByBrand[brandName];
  if (allowPattern) {
    return allowPattern.test(model);
  }

  return /(MOTO|SCOOTER|BIKE|DUKE|NINJA|CB|CBR|GSX|VESPA|MAXSYM|XMAX|NMAX|PCX)/.test(model);
}

async function getJson<T>(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "MotoNovaCatalogSync/1.0",
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }

  return (await response.json()) as T;
}

async function postWikidataJson<T>(query: string) {
  const response = await fetch("https://query.wikidata.org/sparql", {
    method: "POST",
    headers: {
      "user-agent": "MotoNovaCatalogSync/1.0",
      accept: "application/sparql-results+json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({
      format: "json",
      query,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for Wikidata query`);
  }

  return (await response.json()) as T;
}

function mergeImportedMaps(...maps: Record<string, string[]>[]) {
  const merged = new Map<string, string[]>();

  for (const currentMap of maps) {
    for (const [brandName, models] of Object.entries(currentMap)) {
      const existing = merged.get(brandName) ?? [];
      merged.set(
        brandName,
        Array.from(new Set([...existing, ...models])).sort((left, right) =>
          left.localeCompare(right, "tr-TR")
        )
      );
    }
  }

  return Object.fromEntries(
    Array.from(merged.entries()).sort((left, right) => left[0].localeCompare(right[0], "tr-TR"))
  );
}

async function fetchNhtsaBrandModels(targetBrands: string[]) {
  const makesResponse = await getJson<VpicResponse<VpicMake>>(
    "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/motorcycle?format=json"
  );

  const wantedKeys = new Set(targetBrands.map((brand) => normalizeKey(brand)));
  const matchedMakes = new Map<string, VpicMake>();

  for (const make of makesResponse.Results) {
    const canonicalName = formatBrandName(make.MakeName);
    const canonicalKey = normalizeKey(canonicalName);

    if (!wantedKeys.has(canonicalKey)) {
      continue;
    }

    if (!matchedMakes.has(canonicalName)) {
      matchedMakes.set(canonicalName, make);
    }
  }

  const importedBrandModels: Record<string, string[]> = {};

  for (const [brandName, make] of matchedMakes.entries()) {
    try {
      const modelsResponse = await getJson<VpicResponse<VpicModel>>(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/${make.MakeId}?format=json`
      );

      const cleanedModels = Array.from(
        new Set(
          modelsResponse.Results
            .map((item) => item.Model_Name)
            .filter((modelName) => shouldKeepModel(brandName, modelName, "nhtsa"))
            .map((modelName) => formatModelName(modelName, brandName))
        )
      ).sort((left, right) => left.localeCompare(right, "tr-TR"));

      if (cleanedModels.length > 0) {
        importedBrandModels[brandName] = cleanedModels;
      }

      console.log(`✓ NHTSA ${brandName}: ${cleanedModels.length} model alındı`);
    } catch (error) {
      console.warn(`! NHTSA ${brandName} çekilemedi`, error);
    }
  }

  return importedBrandModels;
}

function buildWikidataQuery() {
  return `
SELECT DISTINCT ?manufacturerLabel ?modelLabel WHERE {
  ?manufacturer rdfs:label ?manufacturerLabel .
  FILTER(LANG(?manufacturerLabel) = "en")
  ?model wdt:P176 ?manufacturer .
  ?model wdt:P31/wdt:P279* wd:Q34493 .
  FILTER NOT EXISTS { ?manufacturer wdt:P31 wd:Q4167836 }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,tr". }
}
ORDER BY ?manufacturerLabel ?modelLabel
`;
}

async function fetchWikidataBrandModels() {
  const response = await postWikidataJson<WikidataResponse>(buildWikidataQuery());
  const importedBrandModels: Record<string, string[]> = {};

  for (const binding of response.results.bindings) {
    const brandName = formatBrandName(binding.manufacturerLabel.value);
    const modelName = formatModelName(binding.modelLabel.value, brandName);

    if (!shouldKeepModel(brandName, modelName, "wikidata")) {
      continue;
    }

    if (!importedBrandModels[brandName]) {
      importedBrandModels[brandName] = [];
    }

    importedBrandModels[brandName].push(modelName);
  }

  for (const [brandName, models] of Object.entries(importedBrandModels)) {
    importedBrandModels[brandName] = Array.from(new Set(models)).sort((left, right) =>
      left.localeCompare(right, "tr-TR")
    );
    console.log(`✓ Wikidata ${brandName}: ${importedBrandModels[brandName].length} model alındı`);
  }

  return importedBrandModels;
}

async function main() {
  const wikidataBrandModels = await fetchWikidataBrandModels();
  const expandedTargetBrands = Array.from(
    new Set([...turkeyPriorityBrands, ...Object.keys(wikidataBrandModels)])
  ).sort((left, right) => left.localeCompare(right, "tr-TR"));

  const nhtsaBrandModels = await fetchNhtsaBrandModels(expandedTargetBrands);
  const importedBrandModels = mergeImportedMaps(wikidataBrandModels, nhtsaBrandModels);

  for (const [brandName, fallbackModels] of Object.entries(manualFallbacks)) {
    importedBrandModels[brandName] = Array.from(
      new Set([...(importedBrandModels[brandName] ?? []), ...fallbackModels])
    ).sort((left, right) => left.localeCompare(right, "tr-TR"));
  }

  const sortedBrandEntries = Object.entries(importedBrandModels)
    .sort((left, right) => left[0].localeCompare(right[0], "tr-TR"));

  const finalMap = Object.fromEntries(sortedBrandEntries);
  const modelCount = sortedBrandEntries.reduce((total, [, models]) => total + models.length, 0);

  const fileContent = `export const importedBrandModels: Record<string, readonly string[]> = ${JSON.stringify(finalMap, null, 2)};\n\nexport const importedCatalogMeta = ${JSON.stringify(
    {
      source: "Wikidata archive + NHTSA motorcycle makes/models + manual Turkey fallbacks",
      syncedAt: new Date().toISOString(),
      brandCount: sortedBrandEntries.length,
      modelCount,
    },
    null,
    2
  )} as const;\n`;

  writeFileSync(OUTPUT_PATH, fileContent, "utf8");

  console.log(`\nMotoNova katalog dosyası güncellendi:`);
  console.log(`- Marka sayısı: ${sortedBrandEntries.length}`);
  console.log(`- Model sayısı: ${modelCount}`);
  console.log(`- Çıktı: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("Katalog senkronizasyonu başarısız oldu.");
  console.error(error);
  process.exit(1);
});
