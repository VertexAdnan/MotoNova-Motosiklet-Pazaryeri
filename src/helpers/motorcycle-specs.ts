export type MotorcycleSpecSuggestion = {
  motorType: string;
  horsepowerHp: string;
  torqueNm: string;
  weightKg: string;
  topSpeedKph: string;
  fuelTankL: string;
  engineCc: string;
  transmission: string;
  timingType: string;
  fuelType: string;
  origin: string;
  sourceLabel: string;
  confidence: "high" | "medium";
};

type SpecLookupInput = {
  brandName: string;
  modelName: string;
};

const curatedSpecs: Record<string, Omit<MotorcycleSpecSuggestion, "sourceLabel" | "confidence">> = {
  "yamaha:mt-07": {
    motorType: "Naked",
    horsepowerHp: "73",
    torqueNm: "67",
    weightKg: "184",
    topSpeedKph: "214",
    fuelTankL: "14",
    engineCc: "689",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "yamaha:mt-09": {
    motorType: "Naked",
    horsepowerHp: "119",
    torqueNm: "93",
    weightKg: "193",
    topSpeedKph: "225",
    fuelTankL: "14",
    engineCc: "890",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "yamaha:r25": {
    motorType: "Spor",
    horsepowerHp: "36",
    torqueNm: "23",
    weightKg: "166",
    topSpeedKph: "170",
    fuelTankL: "14",
    engineCc: "249",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "yamaha:xmax-250": {
    motorType: "Scooter",
    horsepowerHp: "22",
    torqueNm: "24",
    weightKg: "181",
    topSpeedKph: "135",
    fuelTankL: "13",
    engineCc: "249",
    transmission: "Otomatik",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "yamaha:dragstar-1100": {
    motorType: "Cruiser",
    horsepowerHp: "62",
    torqueNm: "85",
    weightKg: "275",
    topSpeedKph: "177",
    fuelTankL: "17",
    engineCc: "1063",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "honda:cbr650r": {
    motorType: "Spor",
    horsepowerHp: "95",
    torqueNm: "63",
    weightKg: "208",
    topSpeedKph: "220",
    fuelTankL: "15",
    engineCc: "649",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "honda:cb650r": {
    motorType: "Naked",
    horsepowerHp: "95",
    torqueNm: "63",
    weightKg: "202",
    topSpeedKph: "215",
    fuelTankL: "15",
    engineCc: "649",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "honda:pcx-125": {
    motorType: "Scooter",
    horsepowerHp: "12",
    torqueNm: "12",
    weightKg: "130",
    topSpeedKph: "105",
    fuelTankL: "8",
    engineCc: "125",
    transmission: "Otomatik",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "bmw:r-1250-gs": {
    motorType: "Adventure",
    horsepowerHp: "136",
    torqueNm: "143",
    weightKg: "249",
    topSpeedKph: "220",
    fuelTankL: "20",
    engineCc: "1254",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Almanya",
  },
  "bmw:s-1000-rr": {
    motorType: "Spor",
    horsepowerHp: "210",
    torqueNm: "113",
    weightKg: "197",
    topSpeedKph: "299",
    fuelTankL: "16",
    engineCc: "999",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Almanya",
  },
  "kawasaki:z900": {
    motorType: "Naked",
    horsepowerHp: "125",
    torqueNm: "98",
    weightKg: "212",
    topSpeedKph: "240",
    fuelTankL: "17",
    engineCc: "948",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "kawasaki:ninja-650": {
    motorType: "Spor",
    horsepowerHp: "68",
    torqueNm: "65",
    weightKg: "193",
    topSpeedKph: "210",
    fuelTankL: "15",
    engineCc: "649",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "ktm:390-duke": {
    motorType: "Naked",
    horsepowerHp: "44",
    torqueNm: "37",
    weightKg: "165",
    topSpeedKph: "167",
    fuelTankL: "13",
    engineCc: "373",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Avusturya",
  },
  "ktm:390-adventure": {
    motorType: "Adventure",
    horsepowerHp: "44",
    torqueNm: "37",
    weightKg: "177",
    topSpeedKph: "155",
    fuelTankL: "14",
    engineCc: "373",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Avusturya",
  },
  "suzuki:v-strom-650": {
    motorType: "Adventure",
    horsepowerHp: "71",
    torqueNm: "62",
    weightKg: "216",
    topSpeedKph: "185",
    fuelTankL: "20",
    engineCc: "645",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "Japonya",
  },
  "triumph:street-triple-765": {
    motorType: "Naked",
    horsepowerHp: "120",
    torqueNm: "80",
    weightKg: "188",
    topSpeedKph: "230",
    fuelTankL: "15",
    engineCc: "765",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "İngiltere",
  },
  "ducati:panigale-v2": {
    motorType: "Spor",
    horsepowerHp: "155",
    torqueNm: "104",
    weightKg: "200",
    topSpeedKph: "270",
    fuelTankL: "17",
    engineCc: "955",
    transmission: "Manuel",
    timingType: "4 Zamanlı",
    fuelType: "Benzin",
    origin: "İtalya",
  },
};

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferMotorType(modelName: string) {
  const value = modelName.toLocaleLowerCase("tr-TR");

  if (/(pcx|xmax|nmax|tmax|rayzr|aerox|vespa|liberty|medley|burgman|joymax|cruisym|maxsym|fiddle|jet|orbit|symphony|like|agility|scooter|dio|activa|sh125|sh150|forza)/.test(value)) return "Scooter";
  if (/(gs|adv|adventure|tracer|tenere|africa|v-strom|versys|tiger|multistrada|tuareg|nx500|transalp|himalayan|pan america|700 mt|800 mt)/.test(value)) return "Adventure";
  if (/(ninja|r25|r7|r1|yzf-r125|cbr|zx|panigale|rr|rs |rsv4|daytona|gsx-8r|gsx-250r)/.test(`${value} `)) return "Spor";
  if (/(mt-|z900|z650|z500|duke|monster|street triple|trident|cb650r|cb250r|cb125r|f900r|nk|svartpilen|vitpilen|hunter 350|xsr)/.test(value)) return "Naked";
  if (/(bobber|sportster|fat bob|nightster|vulcan|diavel|chief|dragstar|drag star|virago|bolt|rebel|intruder|eliminator|meteor 350|super meteor)/.test(value)) return "Cruiser";
  if (/(touring|mandello|rocket|bonneville|speed twin|nt1100|gold wing|street glide|road glide)/.test(value)) return "Touring";
  if (/(enduro|cross|supermoto|701|crf|xpulse)/.test(value)) return "Cross";

  return "Naked";
}

function inferOrigin(brandName: string) {
  const value = brandName.toLocaleLowerCase("tr-TR");

  if (/(yamaha|honda|suzuki|kawasaki)/.test(value)) return "Japonya";
  if (/(bmw)/.test(value)) return "Almanya";
  if (/(ducati|aprilia|moto guzzi|mv agusta|vespa|piaggio|benelli|lambretta|italjet)/.test(value)) return "İtalya";
  if (/(triumph)/.test(value)) return "İngiltere";
  if (/(ktm|husqvarna)/.test(value)) return "Avusturya";
  if (/(hyosung)/.test(value)) return "Güney Kore";
  if (/(cfmoto|qjmotor|zontes|keeway|kymco|sym|segway|voge|haojue)/.test(value)) return "Çin";
  if (/(bajaj|tvs|hero)/.test(value)) return "Hindistan";
  if (/(mondial|rks|yuki|kanuni|arora|volta|motolux|kuba|salcano|ramzey|falcon|kral|apec|togo)/.test(value)) return "Türkiye";

  return "Japonya";
}

function inferEngineCc(modelName: string) {
  const values = modelName.match(/\d+/g) ?? [];

  for (const raw of values) {
    const numeric = Number(raw);

    if (raw.length >= 3) return numeric;
    if (raw.length === 2) return numeric <= 15 ? numeric * 100 : numeric * 10;
    if (raw.length === 1) return numeric * 100;
  }

  return 650;
}

function estimateHorsepower(engineCc: number, motorType: string) {
  if (engineCc <= 125) return 12;
  if (engineCc <= 250) return 26;
  if (engineCc <= 400) return motorType === "Spor" ? 45 : 42;
  if (engineCc <= 500) return 50;
  if (engineCc <= 700) return motorType === "Spor" ? 74 : 69;
  if (engineCc <= 900) return motorType === "Adventure" ? 95 : 108;
  if (engineCc <= 1300) return motorType === "Cruiser" ? 125 : 145;
  return 170;
}

function estimateTorque(engineCc: number, motorType: string) {
  if (engineCc <= 125) return 11;
  if (engineCc <= 250) return 22;
  if (engineCc <= 400) return 36;
  if (engineCc <= 500) return 43;
  if (engineCc <= 700) return motorType === "Spor" ? 64 : 68;
  if (engineCc <= 900) return motorType === "Adventure" ? 88 : 92;
  if (engineCc <= 1300) return motorType === "Cruiser" ? 118 : 128;
  return 145;
}

function estimateWeight(engineCc: number, motorType: string) {
  const baseByType: Record<string, number> = {
    Scooter: 132,
    Spor: 168,
    Naked: 175,
    Adventure: 196,
    Cruiser: 240,
    Touring: 225,
    Cross: 118,
  };

  const base = baseByType[motorType] ?? 175;
  const ccFactor = Math.round(engineCc / 25);
  return Math.min(base + ccFactor, motorType === "Cruiser" ? 320 : 255);
}

function estimateTopSpeed(engineCc: number, motorType: string) {
  if (motorType === "Scooter") return engineCc <= 125 ? 100 : engineCc <= 250 ? 130 : 155;
  if (engineCc <= 125) return 110;
  if (engineCc <= 250) return 150;
  if (engineCc <= 400) return 170;
  if (engineCc <= 700) return 210;
  if (engineCc <= 900) return 230;
  if (engineCc <= 1300) return 250;
  return 270;
}

function estimateFuelTank(engineCc: number, motorType: string) {
  if (motorType === "Scooter") return engineCc <= 125 ? 8 : 13;
  if (motorType === "Adventure") return engineCc >= 800 ? 20 : 16;
  if (motorType === "Cruiser") return 18;
  return engineCc <= 250 ? 12 : engineCc <= 700 ? 15 : 17;
}

function inferTransmission(modelName: string, motorType: string) {
  const value = modelName.toLocaleLowerCase("tr-TR");
  if (motorType === "Scooter" || /(x-adv|ce 04|dct)/.test(value)) return "Otomatik";
  return "Manuel";
}

function inferFuelType(modelName: string) {
  return /elettrica|electric|sr\/f|sr\/s|ce 04/.test(modelName.toLocaleLowerCase("tr-TR")) ? "Elektrik" : "Benzin";
}

function buildInferredSuggestion(input: SpecLookupInput): MotorcycleSpecSuggestion {
  const motorType = inferMotorType(input.modelName);
  const engineCc = inferEngineCc(input.modelName);
  const fuelType = inferFuelType(input.modelName);

  return {
    motorType,
    horsepowerHp: String(estimateHorsepower(engineCc, motorType)),
    torqueNm: String(estimateTorque(engineCc, motorType)),
    weightKg: String(estimateWeight(engineCc, motorType)),
    topSpeedKph: String(estimateTopSpeed(engineCc, motorType)),
    fuelTankL: String(estimateFuelTank(engineCc, motorType)),
    engineCc: String(engineCc),
    transmission: inferTransmission(input.modelName, motorType),
    timingType: fuelType === "Elektrik" ? "Elektrikli" : "4 Zamanlı",
    fuelType,
    origin: inferOrigin(input.brandName),
    sourceLabel: "Yardımcı dış veri tahmini",
    confidence: "medium",
  };
}

export async function getMotorcycleSpecsSuggestion(input: SpecLookupInput): Promise<MotorcycleSpecSuggestion | null> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const key = `${slugify(input.brandName)}:${slugify(input.modelName)}`;
  const curated = curatedSpecs[key];

  if (curated) {
    return {
      ...curated,
      sourceLabel: "Yardımcı dış veri eşleşmesi",
      confidence: "high",
    };
  }

  if (!input.brandName || !input.modelName) {
    return null;
  }

  return buildInferredSuggestion(input);
}