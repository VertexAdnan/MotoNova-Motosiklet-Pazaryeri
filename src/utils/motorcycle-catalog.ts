import { importedBrandModels } from "./motorcycle-catalog.generated.ts";

export type CatalogBrand = {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
};

export type CatalogModel = {
  id: string;
  brandId: string;
  slug: string;
  name: string;
  isActive: boolean;
};

export type CatalogProvince = {
  id: string;
  plateCode: number;
  name: string;
  isActive: boolean;
};

export type ListingFilterDraft = {
  provinceIds: string[];
  brandIds: string[];
  modelIds: string[];
  priceRange: string;
};

const curatedBrandModels = {
  Aprilia: ["RS 125", "RS 457", "RS 660", "RSV4", "Tuareg 660", "Tuono 660", "Tuono V4", "RX 125", "SX 125", "SR GT 125", "SR GT 200"],
  Arora: ["AR 50 Cappucino", "AR 125-23", "Beest 125", "Special 50"],
  Bajaj: ["Pulsar NS125", "Pulsar NS200", "Pulsar RS200", "Dominar 250", "Dominar 400", "Avenger Street 220"],
  Benelli: ["125 S", "BN 125", "TRK 251", "TRK 502", "TRK 502 X", "TRK 552 X", "TRK 702", "Leoncino 250", "Leoncino 500", "Leoncino 800", "Imperiale 400", "502C", "752S", "302S"],
  BMW: ["G 310 R", "G 310 GS", "F 750 GS", "F 800 GS", "F 900 R", "F 900 XR", "F 900 GS", "R 12", "R 12 nineT", "R 1250 GS", "R 1300 GS", "R 18", "S 1000 RR", "S 1000 R", "M 1000 RR", "M 1000 XR", "C 400 X", "C 400 GT", "CE 02", "CE 04"],
  CFMoto: ["250 NK", "250 CL-C", "300 SR", "450 NK", "450 SR", "450 MT", "450 CL-C", "650 NK", "700 CL-X", "700 MT", "800 MT", "800 NK", "675 NK", "675 SR-R"],
  Ducati: ["Monster", "Monster+", "Scrambler Icon", "Scrambler Full Throttle", "Multistrada V2", "Multistrada V4", "DesertX", "Hypermotard 698 Mono", "Streetfighter V2", "Streetfighter V4", "Panigale V2", "Panigale V4", "Supersport 950", "Diavel V4"],
  "Harley-Davidson": ["Sportster S", "Nightster", "Street Bob 114", "Fat Bob 114", "Breakout 117", "Low Rider S", "Road Glide", "Pan America 1250"],
  Hero: ["Hunk 150", "Xpulse 200 4V", "Karizma XMR 210", "Pleasure+ 110", "Destini 125"],
  Honda: ["Activa 125", "Dio", "CB125F", "CB125R", "CB250R", "CB500 Hornet", "CBR250R", "CBR500R", "CB650R", "CBR650R", "CL250", "CL500", "CRF250L", "CRF300L", "NX500", "NC750X", "Rebel 500", "X-ADV", "ADV350", "Forza 125", "Forza 250", "Forza 750", "PCX 125", "SH125i", "SH150i", "XL750 Transalp", "Africa Twin", "NT1100", "Gold Wing"],
  Husqvarna: ["Svartpilen 125", "Svartpilen 250", "Svartpilen 401", "Vitpilen 125", "Vitpilen 401", "701 Supermoto", "701 Enduro", "Norden 901"],
  Indian: ["Scout Sixty", "Scout Bobber", "Scout Rogue", "Chief Dark Horse", "Sport Chief", "Challenger", "FTR"],
  Italjet: ["Dragster 125", "Dragster 200", "Formula 125"],
  Kanuni: ["Resa 125", "Seha 150", "Breton S 125"],
  Kawasaki: ["Ninja 250", "Ninja 400", "Ninja 500", "Ninja 650", "Ninja ZX-4RR", "Ninja ZX-6R", "Ninja ZX-10R", "Z125", "Z400", "Z500", "Z650", "Z900", "Z H2", "Versys 650", "Versys 1000", "Vulcan S", "Eliminator 500", "KLR650", "W800"],
  Keeway: ["RKF 125", "RKF 250", "V302C", "Vieste 125", "Vieste 300", "Superlight 125", "XDV 125 EVO"],
  KTM: ["125 Duke", "250 Duke", "390 Duke", "390 Adventure", "250 Adventure", "RC 125", "RC 390", "690 SMC R", "790 Duke", "790 Adventure", "890 Duke R", "890 Adventure", "990 Duke", "1290 Super Duke R", "1390 Super Duke R"],
  Kymco: ["Agility 125", "Agility S 125", "Like 125", "Like 150i", "X-Town CT 250", "DTX 360", "Xciting VS 400", "Xciting S 400", "AK 550"],
  Lambretta: ["V50 Special", "V125 Special", "X300"],
  Mondial: ["Drift L", "125 MH Drift", "125 ZNU", "125 Turismo", "Flat Track 125", "RX3i Evo", "X-Treme Max 200"],
  "Moto Guzzi": ["V7 Stone", "V85 TT", "V100 Mandello", "Stelvio"],
  "MV Agusta": ["Brutale 800", "Dragster 800", "Turismo Veloce", "F3 Rosso", "Superveloce", "Enduro Veloce"],
  Peugeot: ["Kisbee 50", "Tweet 125", "Django 125", "Pulsion 125", "XP400", "Metropolis 400"],
  Piaggio: ["Liberty 125", "Medley 125", "Medley 150", "Beverly 300", "Beverly 400", "MP3 400", "MP3 530 Exclusive"],
  QJMotor: ["SRK 125 S", "SRK 250 RR", "SRK 550", "SRV 300", "SRT 550", "SRT 700X", "SRT 800"],
  RKS: ["RSIII Pro", "RZ125", "RZ150", "RZ125X", "RZ150X", "RZ250S", "Titanic 150", "Freccia 150", "Bitter 125", "Spontini 110", "Newlight 125", "ICON 50 ST", "ROSA 50 PRO", "LT50PRO PLUS", "PARMIDA 50", "LTM125", "NEON125", "VPS125 PRO", "DES125", "VRS125", "LTR125", "REALE125", "REALE125X", "LINCE125", "SC150RE", "VIESTE 249", "FORT250", "BLADE 250", "SVT650X", "SRT800SX", "SRT900SX", "SRT902S", "SRK125R", "SRK250RS", "R250", "SRK250RR", "SRK400RR", "SRK450RA", "SRK550RS", "M250", "125N", "SRV125", "K-LIGHT 250", "SRV250VS", "SRV700", "C1002V", "SRK125S", "SRK250", "SRK250S", "A250", "M502N", "SRK550", "GTR50", "RK125S", "RK250S", "RT250", "BLACKWOLF", "BLACKSTER 250", "BLACKSTER 250i", "BLACKSTER Chopper", "RODOS"],
  "Royal Enfield": ["Hunter 350", "Classic 350", "Bullet 350", "Meteor 350", "Super Meteor 650", "Himalayan 450", "Interceptor 650", "Continental GT 650", "Shotgun 650"],
  Segway: ["E110A", "E125S", "E300SE"],
  Suzuki: ["Address 125", "Avenis 125", "GSX-S125", "GSX-250R", "GSX-8S", "GSX-8R", "GSX-S1000", "V-Strom 250 SX", "V-Strom 650", "V-Strom 800DE", "V-Strom 1050", "Hayabusa", "Burgman 400"],
  SYM: ["Fiddle 125", "Symphony ST 125", "Orbit II 125", "Jet 14", "Jet X 125", "Joymax Z+ 250", "Cruisym 250", "MMBCU", "Maxsym 400", "Maxsym TL 508"],
  Triumph: ["Speed 400", "Scrambler 400 X", "Trident 660", "Daytona 660", "Street Triple 765", "Tiger Sport 660", "Tiger 900", "Tiger 1200", "Bonneville T100", "Scrambler 900", "Speed Twin 900", "Bobber", "Rocket 3"],
  TVS: ["Apache RTR 200", "Apache RR 310", "Raider 125", "Jupiter 125", "Ntorq 125"],
  Togo: ["T3", "T4", "T10", "T11", "T12", "Maxi 50", "Maxi 125"],
  Ural: ["Gear Up", "CT"],
  Vespa: ["Primavera 125", "Primavera S 150", "Sprint 150", "Sprint S 150", "GTS 300", "GTV 300", "Elettrica"],
  Voge: ["300R", "300RR", "300 Rally", "525ACX", "525DSX", "650DSX", "900DSX"],
  Volta: ["VS1", "VM4", "VSM"],
  Yamaha: ["Crypton S", "YBR 125", "YS125", "MT-03", "MT-07", "MT-09", "MT-10 SP", "MT-125", "MT-25", "R25", "R3", "R6", "R7", "R1", "YZF-R125", "XSR125", "XSR700", "XSR900", "Tracer 7", "Tracer 9", "Tenere 700", "NMAX 125", "XMAX 250", "TMAX Tech Max", "D'elight 125", "RayZR 125", "Aerox 155", "Dragstar 250", "Dragstar 400", "Dragstar 650", "Dragstar 1100", "V-Star 250", "V-Star 650", "V-Star 950", "XV250 Virago", "Virago 535", "XV950 Bolt", "Bolt", "FJR1300", "Fazer 600", "Fazer 1000", "FZ6", "FZ8", "FZ1", "XT660R", "XT1200Z Super Tenere", "WR250R", "WR450F", "PW50", "DT125", "RX100", "RD350", "XS650", "XS400", "XJ600", "XJ900", "TZR 250", "TZR 125"],
  Yuki: ["YK-125", "YK-150", "YK-250", "Casper S", "Tino 50", "GT250"],
  Zero: ["S", "DS", "SR/F", "SR/S"],
  Zontes: ["125 G1", "125 U", "350 GK", "350 R", "350 T", "350 X1", "350 E", "703F"],
  Hyosung: ["GV250 Aquila", "GV300S Aquila", "GV650 Aquila", "GT250R", "GT650R", "GT650", "GD250N", "ST7", "RT125D Karion"],
  Kuba: ["Bluebird", "Cruiser 250", "Superlight 200", "TK03", "Trendy 50", "Brilliant 125 Pro"],
  Motolux: ["F5 125", "MRS 125", "MT 125", "Nirvana 125", "Rossi 50"],
  Apec: ["APX5 125", "ALFA 125", "PS3 50"],
  Falcon: ["Freedom 250", "Techno 125", "Wonder 150"],
  Haojue: ["DR160", "DL250", "HJ125"],
  Kral: ["KR-11", "KR-23", "KR-25"],
  Ramzey: ["QM 125T-10D", "GQ 125-20", "Mopet 100"],
  Salcano: ["Capri 50", "Nova 50", "Wolf 125", "XRS 125"],
} as const;

function mergeBrandModelMaps(
  baseMap: Record<string, readonly string[]>,
  importedMap: Record<string, readonly string[]>
) {
  const merged = new Map<string, string[]>();

  for (const [brandName, models] of Object.entries(baseMap)) {
    merged.set(brandName, [...models]);
  }

  for (const [brandName, models] of Object.entries(importedMap)) {
    const currentModels = merged.get(brandName) ?? [];
    merged.set(
      brandName,
      Array.from(new Set([...currentModels, ...models])).sort((left, right) =>
        left.localeCompare(right, "tr-TR")
      )
    );
  }

  return Object.fromEntries(
    Array.from(merged.entries()).sort((left, right) => left[0].localeCompare(right[0], "tr-TR"))
  );
}

const rawBrandModels = mergeBrandModelMaps(curatedBrandModels, importedBrandModels);

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

export const brandsTR: CatalogBrand[] = Object.keys(rawBrandModels).map((name) => ({
  id: `brand_${slugify(name)}`,
  slug: slugify(name),
  name,
  isActive: true,
}));

export const modelsTR: CatalogModel[] = brandsTR.flatMap((brand) => {
  const modelNames = rawBrandModels[brand.name as keyof typeof rawBrandModels] ?? [];
  return modelNames.map((modelName) => ({
    id: `model_${brand.slug}_${slugify(modelName)}`,
    brandId: brand.id,
    slug: slugify(modelName),
    name: modelName,
    isActive: true,
  }));
});

export const provincesTR: CatalogProvince[] = [
  { id: "province_01", plateCode: 1, name: "Adana", isActive: true },
  { id: "province_02", plateCode: 2, name: "Adiyaman", isActive: true },
  { id: "province_03", plateCode: 3, name: "Afyonkarahisar", isActive: true },
  { id: "province_04", plateCode: 4, name: "Agri", isActive: true },
  { id: "province_05", plateCode: 5, name: "Amasya", isActive: true },
  { id: "province_06", plateCode: 6, name: "Ankara", isActive: true },
  { id: "province_07", plateCode: 7, name: "Antalya", isActive: true },
  { id: "province_08", plateCode: 8, name: "Artvin", isActive: true },
  { id: "province_09", plateCode: 9, name: "Aydin", isActive: true },
  { id: "province_10", plateCode: 10, name: "Balikesir", isActive: true },
  { id: "province_11", plateCode: 11, name: "Bilecik", isActive: true },
  { id: "province_12", plateCode: 12, name: "Bingol", isActive: true },
  { id: "province_13", plateCode: 13, name: "Bitlis", isActive: true },
  { id: "province_14", plateCode: 14, name: "Bolu", isActive: true },
  { id: "province_15", plateCode: 15, name: "Burdur", isActive: true },
  { id: "province_16", plateCode: 16, name: "Bursa", isActive: true },
  { id: "province_17", plateCode: 17, name: "Canakkale", isActive: true },
  { id: "province_18", plateCode: 18, name: "Cankiri", isActive: true },
  { id: "province_19", plateCode: 19, name: "Corum", isActive: true },
  { id: "province_20", plateCode: 20, name: "Denizli", isActive: true },
  { id: "province_21", plateCode: 21, name: "Diyarbakir", isActive: true },
  { id: "province_22", plateCode: 22, name: "Edirne", isActive: true },
  { id: "province_23", plateCode: 23, name: "Elazig", isActive: true },
  { id: "province_24", plateCode: 24, name: "Erzincan", isActive: true },
  { id: "province_25", plateCode: 25, name: "Erzurum", isActive: true },
  { id: "province_26", plateCode: 26, name: "Eskisehir", isActive: true },
  { id: "province_27", plateCode: 27, name: "Gaziantep", isActive: true },
  { id: "province_28", plateCode: 28, name: "Giresun", isActive: true },
  { id: "province_29", plateCode: 29, name: "Gumushane", isActive: true },
  { id: "province_30", plateCode: 30, name: "Hakkari", isActive: true },
  { id: "province_31", plateCode: 31, name: "Hatay", isActive: true },
  { id: "province_32", plateCode: 32, name: "Isparta", isActive: true },
  { id: "province_33", plateCode: 33, name: "Mersin", isActive: true },
  { id: "province_34", plateCode: 34, name: "Istanbul", isActive: true },
  { id: "province_35", plateCode: 35, name: "Izmir", isActive: true },
  { id: "province_36", plateCode: 36, name: "Kars", isActive: true },
  { id: "province_37", plateCode: 37, name: "Kastamonu", isActive: true },
  { id: "province_38", plateCode: 38, name: "Kayseri", isActive: true },
  { id: "province_39", plateCode: 39, name: "Kirklareli", isActive: true },
  { id: "province_40", plateCode: 40, name: "Kirsehir", isActive: true },
  { id: "province_41", plateCode: 41, name: "Kocaeli", isActive: true },
  { id: "province_42", plateCode: 42, name: "Konya", isActive: true },
  { id: "province_43", plateCode: 43, name: "Kutahya", isActive: true },
  { id: "province_44", plateCode: 44, name: "Malatya", isActive: true },
  { id: "province_45", plateCode: 45, name: "Manisa", isActive: true },
  { id: "province_46", plateCode: 46, name: "Kahramanmaras", isActive: true },
  { id: "province_47", plateCode: 47, name: "Mardin", isActive: true },
  { id: "province_48", plateCode: 48, name: "Mugla", isActive: true },
  { id: "province_49", plateCode: 49, name: "Mus", isActive: true },
  { id: "province_50", plateCode: 50, name: "Nevsehir", isActive: true },
  { id: "province_51", plateCode: 51, name: "Nigde", isActive: true },
  { id: "province_52", plateCode: 52, name: "Ordu", isActive: true },
  { id: "province_53", plateCode: 53, name: "Rize", isActive: true },
  { id: "province_54", plateCode: 54, name: "Sakarya", isActive: true },
  { id: "province_55", plateCode: 55, name: "Samsun", isActive: true },
  { id: "province_56", plateCode: 56, name: "Siirt", isActive: true },
  { id: "province_57", plateCode: 57, name: "Sinop", isActive: true },
  { id: "province_58", plateCode: 58, name: "Sivas", isActive: true },
  { id: "province_59", plateCode: 59, name: "Tekirdag", isActive: true },
  { id: "province_60", plateCode: 60, name: "Tokat", isActive: true },
  { id: "province_61", plateCode: 61, name: "Trabzon", isActive: true },
  { id: "province_62", plateCode: 62, name: "Tunceli", isActive: true },
  { id: "province_63", plateCode: 63, name: "Sanliurfa", isActive: true },
  { id: "province_64", plateCode: 64, name: "Usak", isActive: true },
  { id: "province_65", plateCode: 65, name: "Van", isActive: true },
  { id: "province_66", plateCode: 66, name: "Yozgat", isActive: true },
  { id: "province_67", plateCode: 67, name: "Zonguldak", isActive: true },
  { id: "province_68", plateCode: 68, name: "Aksaray", isActive: true },
  { id: "province_69", plateCode: 69, name: "Bayburt", isActive: true },
  { id: "province_70", plateCode: 70, name: "Karaman", isActive: true },
  { id: "province_71", plateCode: 71, name: "Kirikkale", isActive: true },
  { id: "province_72", plateCode: 72, name: "Batman", isActive: true },
  { id: "province_73", plateCode: 73, name: "Sirnak", isActive: true },
  { id: "province_74", plateCode: 74, name: "Bartin", isActive: true },
  { id: "province_75", plateCode: 75, name: "Ardahan", isActive: true },
  { id: "province_76", plateCode: 76, name: "Igdir", isActive: true },
  { id: "province_77", plateCode: 77, name: "Yalova", isActive: true },
  { id: "province_78", plateCode: 78, name: "Karabuk", isActive: true },
  { id: "province_79", plateCode: 79, name: "Kilis", isActive: true },
  { id: "province_80", plateCode: 80, name: "Osmaniye", isActive: true },
  { id: "province_81", plateCode: 81, name: "Duzce", isActive: true },
];

export const modelsByBrandIdTR = modelsTR.reduce<Record<string, CatalogModel[]>>((acc, model) => {
  if (!acc[model.brandId]) {
    acc[model.brandId] = [];
  }
  acc[model.brandId].push(model);
  return acc;
}, {});
