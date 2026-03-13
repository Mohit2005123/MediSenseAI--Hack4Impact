// Firestore queries and mock data for demo mode
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit as firestoreLimit,
} from "firebase/firestore";
import { getStrings } from "./i18n";
import { enhanceHospitalWithDetails } from "./hospitalScraper";

// Comprehensive hospital name translation mapping
const translateHospitalName = (name: string, language: string): string => {
  if (!name || language === "en") return name;

  const strings = getStrings(language as any);

  // If name is just "Hospital" or generic, try to find a better translation
  if (name.toLowerCase() === "hospital" || name.toLowerCase() === "clinic") {
    return strings[name.toLowerCase() as keyof typeof strings] || name;
  }

  // For specific known hospital names, use exact translations
  const specificHospitals = [
    { pattern: /city general hospital/i, key: "cityGeneralHospital" },
    { pattern: /apollo clinic/i, key: "apolloClinic" },
    { pattern: /community health center/i, key: "communityHealthCenter" },
    { pattern: /batla hospital/i, key: "batlaHospital" },
    { pattern: /lions kidney hospitals/i, key: "lionsKidneyHospitals" },
    { pattern: /holy family hospital/i, key: "holyFamilyHospital" },
    { pattern: /dgd batla house/i, key: "dgdBatlaHouse" },
    { pattern: /delhi diagnostic centre/i, key: "delhiDiagnosticCentre" },
    { pattern: /bansal hospital/i, key: "bansalHospital" },
    { pattern: /escorts heart institute/i, key: "escortsHeartInstitute" },
    {
      pattern: /sujan mohinder singh hospital/i,
      key: "sujanMohinderSinghHospital",
    },
    { pattern: /iqbal faizy hospital/i, key: "iqbalFaizyHospital" },
    { pattern: /fortis hospital/i, key: "fortisHospital" },
    { pattern: /max hospital/i, key: "maxHospital" },
    { pattern: /manipal hospital/i, key: "manipalHospital" },
    { pattern: /narayana hospital/i, key: "narayanaHospital" },
    { pattern: /medanta hospital/i, key: "medantaHospital" },
    { pattern: /indraprastha hospital/i, key: "indraprasthaHospital" },
    { pattern: /sir ganga ram hospital/i, key: "sirGangaRamHospital" },
    { pattern: /aiims/i, key: "aiims" },
    { pattern: /safdarjung hospital/i, key: "safdarjungHospital" },
    { pattern: /ram manohar lohia hospital/i, key: "ramManoharLohiaHospital" },
    { pattern: /lady hardinge hospital/i, key: "ladyHardingeHospital" },
    { pattern: /lok nayak hospital/i, key: "lokNayakHospital" },
    { pattern: /guru teg bahadur hospital/i, key: "guruTegBahadurHospital" },
  ];

  for (const { pattern, key } of specificHospitals) {
    if (pattern.test(name)) {
      return strings[key as keyof typeof strings] || name;
    }
  }

  // For generic terms at the end of names, translate them
  const genericTerms = [
    { pattern: /\bgeneral hospital\b/i, key: "generalHospital" },
    { pattern: /\bmedical center\b/i, key: "medicalCenter" },
    { pattern: /\bhealth center\b/i, key: "healthCenter" },
    { pattern: /\bemergency hospital\b/i, key: "emergencyHospital" },
    { pattern: /\bprivate hospital\b/i, key: "privateHospital" },
    { pattern: /\bgovernment hospital\b/i, key: "governmentHospital" },
    {
      pattern: /\bmultispeciality hospital\b/i,
      key: "multispecialityHospital",
    },
    {
      pattern: /\bsuper speciality hospital\b/i,
      key: "superSpecialityHospital",
    },
    { pattern: /\bspeciality hospital\b/i, key: "specialityHospital" },
    { pattern: /\bcardiac hospital\b/i, key: "cardiacHospital" },
    { pattern: /\boncology hospital\b/i, key: "oncologyHospital" },
    { pattern: /\borthopedic hospital\b/i, key: "orthopedicHospital" },
    { pattern: /\bpediatric hospital\b/i, key: "pediatricHospital" },
    { pattern: /\bmaternity hospital\b/i, key: "maternityHospital" },
    { pattern: /\beye hospital\b/i, key: "eyeHospital" },
    { pattern: /\bdental hospital\b/i, key: "dentalHospital" },
    { pattern: /\bpsychiatric hospital\b/i, key: "psychiatricHospital" },
    { pattern: /\bhospital\b/i, key: "hospital" },
    { pattern: /\bclinic\b/i, key: "clinic" },
    { pattern: /\binstitute\b/i, key: "institute" },
    { pattern: /\bcentre\b/i, key: "centre" },
    { pattern: /\bcenter\b/i, key: "center" },
    { pattern: /\bmedical\b/i, key: "medical" },
    { pattern: /\bhealthcare\b/i, key: "healthcare" },
    { pattern: /\bcare\b/i, key: "care" },
    { pattern: /\bdiagnostic\b/i, key: "diagnostic" },
    { pattern: /\blaboratory\b/i, key: "laboratory" },
    { pattern: /\blab\b/i, key: "lab" },
    { pattern: /\bpharmacy\b/i, key: "pharmacy" },
    { pattern: /\bdispensary\b/i, key: "dispensary" },
  ];

  let translatedName = name;
  for (const { pattern, key } of genericTerms) {
    const translation = strings[key as keyof typeof strings];
    if (translation) {
      translatedName = translatedName.replace(pattern, translation);
    }
  }

  return translatedName;
};

// Comprehensive hospital address translation
const translateHospitalAddress = (
  address: string,
  language: string
): string => {
  if (!address || language === "en") return address;

  const strings = getStrings(language as any);

  // Common address terms translation
  const addressTerms = [
    { pattern: /\broad\b/gi, key: "road" },
    { pattern: /\bstreet\b/gi, key: "street" },
    { pattern: /\bavenue\b/gi, key: "avenue" },
    { pattern: /\blane\b/gi, key: "lane" },
    { pattern: /\bcolony\b/gi, key: "colony" },
    { pattern: /\bnagar\b/gi, key: "nagar" },
    { pattern: /\bpark\b/gi, key: "park" },
    { pattern: /\bblock\b/gi, key: "block" },
    { pattern: /\bphase\b/gi, key: "phase" },
    { pattern: /\bsector\b/gi, key: "sector" },
    { pattern: /\barea\b/gi, key: "area" },
    { pattern: /\bzone\b/gi, key: "zone" },
    { pattern: /\bnear\b/gi, key: "near" },
    { pattern: /\bopposite\b/gi, key: "opposite" },
    { pattern: /\bnext to\b/gi, key: "nextTo" },
    { pattern: /\bclose to\b/gi, key: "closeTo" },
    { pattern: /\badjacent to\b/gi, key: "adjacentTo" },
    { pattern: /\bby\b/gi, key: "by" },
    { pattern: /\bvia\b/gi, key: "via" },
    { pattern: /\bthrough\b/gi, key: "through" },
    { pattern: /\bmain\b/gi, key: "main" },
    { pattern: /\bcentral\b/gi, key: "central" },
    { pattern: /\bnorth\b/gi, key: "north" },
    { pattern: /\bsouth\b/gi, key: "south" },
    { pattern: /\beast\b/gi, key: "east" },
    { pattern: /\bwest\b/gi, key: "west" },
    { pattern: /\bupper\b/gi, key: "upper" },
    { pattern: /\blower\b/gi, key: "lower" },
    { pattern: /\bnew\b/gi, key: "new" },
    { pattern: /\bold\b/gi, key: "old" },
    { pattern: /\bmarket\b/gi, key: "market" },
    { pattern: /\bchowk\b/gi, key: "chowk" },
    { pattern: /\bchowki\b/gi, key: "chowki" },
    { pattern: /\bchowki\b/gi, key: "chowki" },
    { pattern: /\bpolice\b/gi, key: "police" },
    { pattern: /\bstation\b/gi, key: "station" },
    { pattern: /\bpost\b/gi, key: "post" },
    { pattern: /\boffice\b/gi, key: "office" },
    { pattern: /\bbuilding\b/gi, key: "building" },
    { pattern: /\bcomplex\b/gi, key: "complex" },
    { pattern: /\bplaza\b/gi, key: "plaza" },
    { pattern: /\btower\b/gi, key: "tower" },
    { pattern: /\bfloor\b/gi, key: "floor" },
    { pattern: /\bground\b/gi, key: "ground" },
    { pattern: /\bfirst\b/gi, key: "first" },
    { pattern: /\bsecond\b/gi, key: "second" },
    { pattern: /\bthird\b/gi, key: "third" },
    { pattern: /\bfourth\b/gi, key: "fourth" },
    { pattern: /\bfifth\b/gi, key: "fifth" },
    { pattern: /\bnumber\b/gi, key: "number" },
    { pattern: /\bno\.\b/gi, key: "no" },
    { pattern: /\bhouse\b/gi, key: "house" },
    { pattern: /\bflat\b/gi, key: "flat" },
    { pattern: /\bapartment\b/gi, key: "apartment" },
    { pattern: /\bvilla\b/gi, key: "villa" },
    { pattern: /\bbungalow\b/gi, key: "bungalow" },
    { pattern: /\bgate\b/gi, key: "gate" },
    { pattern: /\bentrance\b/gi, key: "entrance" },
    { pattern: /\bexit\b/gi, key: "exit" },
    { pattern: /\bcorner\b/gi, key: "corner" },
    { pattern: /\bintersection\b/gi, key: "intersection" },
    { pattern: /\bjunction\b/gi, key: "junction" },
    { pattern: /\bcrossing\b/gi, key: "crossing" },
    { pattern: /\bbridge\b/gi, key: "bridge" },
    { pattern: /\bunder\b/gi, key: "under" },
    { pattern: /\bover\b/gi, key: "over" },
    { pattern: /\bbeside\b/gi, key: "beside" },
    { pattern: /\bbetween\b/gi, key: "between" },
    { pattern: /\bamong\b/gi, key: "among" },
    { pattern: /\binside\b/gi, key: "inside" },
    { pattern: /\boutside\b/gi, key: "outside" },
    { pattern: /\bfront\b/gi, key: "front" },
    { pattern: /\bback\b/gi, key: "back" },
    { pattern: /\bside\b/gi, key: "side" },
    { pattern: /\bend\b/gi, key: "end" },
    { pattern: /\bstart\b/gi, key: "start" },
    { pattern: /\bbeginning\b/gi, key: "beginning" },
    { pattern: /\bmiddle\b/gi, key: "middle" },
    { pattern: /\bcenter\b/gi, key: "center" },
    { pattern: /\bcentre\b/gi, key: "centre" },
  ];

  let translatedAddress = address;
  for (const { pattern, key } of addressTerms) {
    const translation = strings[key as keyof typeof strings];
    if (translation) {
      translatedAddress = translatedAddress.replace(pattern, translation);
    }
  }

  return translatedAddress;
};

// Translate hospital amenity type
const translateAmenityType = (amenity: string, language: string): string => {
  const strings = getStrings(language as any);

  const amenityMap: { [key: string]: string } = {
    hospital: "hospital",
    clinic: "clinic",
    doctors: "clinic",
    medical_centre: "medicalCenter",
    health_centre: "healthCenter",
  };

  const key = amenityMap[amenity.toLowerCase()] || "hospital";
  return strings[key as keyof typeof strings] || amenity;
};

// Mock data for demo mode (when Firebase not configured)
export const MOCK_PRESCRIPTIONS = [
  {
    id: "1",
    uid: "demo-uid",
    imageUrl: "/placeholder.svg",
    summaryText: "Fever and Cold Treatment - Multiple medications prescribed",
    createdAt: new Date("2025-12-15"),
    language: "en",
    source: "whatsapp",
    dosagePlan: [
      {
        med: "Paracetamol",
        dose: "500mg",
        freq: "Twice daily",
        duration: "5 days",
      },
      {
        med: "Cetirizine",
        dose: "10mg",
        freq: "Once daily",
        duration: "7 days",
      },
      {
        med: "Vitamin C",
        dose: "1000mg",
        freq: "Once daily",
        duration: "10 days",
      },
      {
        med: "Steam Inhalation",
        dose: "N/A",
        freq: "Twice daily",
        duration: "5 days",
      },
    ],
  },
  {
    id: "2",
    uid: "demo-uid",
    imageUrl: "/placeholder.svg",
    summaryText: "बुखार और सर्दी का इलाज - कई दवाएं निर्धारित",
    createdAt: new Date("2025-12-10"),
    language: "hi",
    source: "whatsapp",
    dosagePlan: [
      { med: "Aspirin", dose: "75mg", freq: "Once daily", duration: "7 days" },
      {
        med: "Montelukast",
        dose: "10mg",
        freq: "Once daily",
        duration: "14 days",
      },
      {
        med: "Zinc Supplements",
        dose: "50mg",
        freq: "Once daily",
        duration: "21 days",
      },
      {
        med: "Gargle with Salt Water",
        dose: "N/A",
        freq: "Three times daily",
        duration: "7 days",
      },
    ],
  },
  {
    id: "3",
    uid: "demo-uid",
    imageUrl: "/placeholder.svg",
    summaryText: "Vitamin Deficiency Treatment - Comprehensive supplement plan",
    createdAt: new Date("2025-12-05"),
    language: "en",
    source: "whatsapp",
    dosagePlan: [
      {
        med: "Vitamin D3",
        dose: "1000 IU",
        freq: "Once daily",
        duration: "30 days",
      },
      {
        med: "Vitamin B12",
        dose: "1000mcg",
        freq: "Once daily",
        duration: "30 days",
      },
      {
        med: "Iron Supplements",
        dose: "100mg",
        freq: "Once daily",
        duration: "60 days",
      },
      {
        med: "Folic Acid",
        dose: "5mg",
        freq: "Once daily",
        duration: "30 days",
      },
      {
        med: "Calcium Carbonate",
        dose: "500mg",
        freq: "Twice daily",
        duration: "90 days",
      },
    ],
  },
  {
    id: "4",
    uid: "demo-uid",
    imageUrl: "/placeholder.svg",
    summaryText:
      "Respiratory Infection Treatment - Antibiotic and supportive care",
    createdAt: new Date("2025-11-28"),
    language: "en",
    source: "whatsapp",
    dosagePlan: [
      {
        med: "Amoxicillin",
        dose: "500mg",
        freq: "Three times daily",
        duration: "7 days",
      },
      {
        med: "Bromhexine",
        dose: "8mg",
        freq: "Three times daily",
        duration: "10 days",
      },
      {
        med: "Salbutamol Inhaler",
        dose: "100mcg",
        freq: "As needed",
        duration: "30 days",
      },
      {
        med: "Steam Inhalation",
        dose: "N/A",
        freq: "Twice daily",
        duration: "7 days",
      },
      {
        med: "Chest Physiotherapy",
        dose: "N/A",
        freq: "Once daily",
        duration: "10 days",
      },
    ],
  },
  {
    id: "5",
    uid: "demo-uid",
    imageUrl: "/placeholder.svg",
    summaryText: "Diabetes Management - Blood sugar control medications",
    createdAt: new Date("2025-11-20"),
    language: "en",
    source: "whatsapp",
    dosagePlan: [
      {
        med: "Metformin",
        dose: "500mg",
        freq: "Twice daily",
        duration: "Ongoing",
      },
      {
        med: "Gliclazide",
        dose: "80mg",
        freq: "Once daily",
        duration: "Ongoing",
      },
      {
        med: "Atorvastatin",
        dose: "20mg",
        freq: "Once daily",
        duration: "Ongoing",
      },
      { med: "Aspirin", dose: "75mg", freq: "Once daily", duration: "Ongoing" },
      {
        med: "Multivitamin",
        dose: "1 tablet",
        freq: "Once daily",
        duration: "Ongoing",
      },
    ],
  },
  {
    id: "6",
    uid: "demo-uid",
    imageUrl: "/placeholder.svg",
    summaryText: "Hypertension Treatment - Blood pressure management",
    createdAt: new Date("2025-11-15"),
    language: "en",
    source: "whatsapp",
    dosagePlan: [
      {
        med: "Amlodipine",
        dose: "5mg",
        freq: "Once daily",
        duration: "Ongoing",
      },
      {
        med: "Losartan",
        dose: "50mg",
        freq: "Once daily",
        duration: "Ongoing",
      },
      {
        med: "Hydrochlorothiazide",
        dose: "12.5mg",
        freq: "Once daily",
        duration: "Ongoing",
      },
      {
        med: "Potassium Supplements",
        dose: "20mEq",
        freq: "Once daily",
        duration: "Ongoing",
      },
    ],
  },
];

export const MOCK_VITALS = [
  // Temperature readings (last 30 days)
  {
    id: "temp-1",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "98.6°F",
    capturedAt: new Date("2025-12-15T08:30:00"),
  },
  {
    id: "temp-2",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "97.8°F",
    capturedAt: new Date("2025-12-14T08:15:00"),
  },
  {
    id: "temp-3",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "98.2°F",
    capturedAt: new Date("2025-12-13T08:45:00"),
  },
  {
    id: "temp-4",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "98.9°F",
    capturedAt: new Date("2025-12-12T09:00:00"),
  },
  {
    id: "temp-5",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "97.5°F",
    capturedAt: new Date("2025-12-11T08:20:00"),
  },
  {
    id: "temp-6",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "98.1°F",
    capturedAt: new Date("2025-12-10T08:30:00"),
  },
  {
    id: "temp-7",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "99.2°F",
    capturedAt: new Date("2025-12-09T08:45:00"),
  },
  {
    id: "temp-8",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "97.9°F",
    capturedAt: new Date("2025-12-08T08:15:00"),
  },
  {
    id: "temp-9",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "98.4°F",
    capturedAt: new Date("2025-12-07T08:30:00"),
  },
  {
    id: "temp-10",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "98.7°F",
    capturedAt: new Date("2025-12-06T08:20:00"),
  },

  // Blood Pressure readings
  {
    id: "bp-1",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "120/80 mmHg",
    capturedAt: new Date("2025-12-15T09:00:00"),
  },
  {
    id: "bp-2",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "118/78 mmHg",
    capturedAt: new Date("2025-12-14T09:15:00"),
  },
  {
    id: "bp-3",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "122/82 mmHg",
    capturedAt: new Date("2025-12-13T09:00:00"),
  },
  {
    id: "bp-4",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "115/75 mmHg",
    capturedAt: new Date("2025-12-12T09:30:00"),
  },
  {
    id: "bp-5",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "125/85 mmHg",
    capturedAt: new Date("2025-12-11T09:15:00"),
  },
  {
    id: "bp-6",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "119/79 mmHg",
    capturedAt: new Date("2025-12-10T09:00:00"),
  },
  {
    id: "bp-7",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "128/88 mmHg",
    capturedAt: new Date("2025-12-09T09:45:00"),
  },
  {
    id: "bp-8",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "116/76 mmHg",
    capturedAt: new Date("2025-12-08T09:30:00"),
  },
  {
    id: "bp-9",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "121/81 mmHg",
    capturedAt: new Date("2025-12-07T09:15:00"),
  },
  {
    id: "bp-10",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "124/84 mmHg",
    capturedAt: new Date("2025-12-06T09:00:00"),
  },

  // Glucose readings
  {
    id: "glucose-1",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "95 mg/dL",
    capturedAt: new Date("2025-12-15T07:30:00"),
  },
  {
    id: "glucose-2",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "102 mg/dL",
    capturedAt: new Date("2025-12-14T07:45:00"),
  },
  {
    id: "glucose-3",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "88 mg/dL",
    capturedAt: new Date("2025-12-13T07:30:00"),
  },
  {
    id: "glucose-4",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "110 mg/dL",
    capturedAt: new Date("2025-12-12T07:15:00"),
  },
  {
    id: "glucose-5",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "92 mg/dL",
    capturedAt: new Date("2025-12-11T07:45:00"),
  },
  {
    id: "glucose-6",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "98 mg/dL",
    capturedAt: new Date("2025-12-10T07:30:00"),
  },
  {
    id: "glucose-7",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "115 mg/dL",
    capturedAt: new Date("2025-12-09T07:20:00"),
  },
  {
    id: "glucose-8",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "85 mg/dL",
    capturedAt: new Date("2025-12-08T07:40:00"),
  },
  {
    id: "glucose-9",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "105 mg/dL",
    capturedAt: new Date("2025-12-07T07:25:00"),
  },
  {
    id: "glucose-10",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "108 mg/dL",
    capturedAt: new Date("2025-12-06T07:35:00"),
  },

  // Weight readings
  {
    id: "weight-1",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "70.2 kg",
    capturedAt: new Date("2025-12-15T06:00:00"),
  },
  {
    id: "weight-2",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "70.0 kg",
    capturedAt: new Date("2025-12-14T06:15:00"),
  },
  {
    id: "weight-3",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "69.8 kg",
    capturedAt: new Date("2025-12-13T06:00:00"),
  },
  {
    id: "weight-4",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "70.5 kg",
    capturedAt: new Date("2025-12-12T06:30:00"),
  },
  {
    id: "weight-5",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "69.5 kg",
    capturedAt: new Date("2025-12-11T06:15:00"),
  },
  {
    id: "weight-6",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "70.8 kg",
    capturedAt: new Date("2025-12-10T06:00:00"),
  },
  {
    id: "weight-7",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "71.0 kg",
    capturedAt: new Date("2025-12-09T06:45:00"),
  },
  {
    id: "weight-8",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "69.2 kg",
    capturedAt: new Date("2025-12-08T06:30:00"),
  },
  {
    id: "weight-9",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "70.3 kg",
    capturedAt: new Date("2025-12-07T06:15:00"),
  },
  {
    id: "weight-10",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "70.6 kg",
    capturedAt: new Date("2025-12-06T06:00:00"),
  },

  // Additional readings for more variety
  {
    id: "temp-11",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "99.1°F",
    capturedAt: new Date("2025-12-05T08:30:00"),
  },
  {
    id: "temp-12",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "97.3°F",
    capturedAt: new Date("2025-12-04T08:15:00"),
  },
  {
    id: "temp-13",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "98.8°F",
    capturedAt: new Date("2025-12-03T08:45:00"),
  },
  {
    id: "temp-14",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "97.6°F",
    capturedAt: new Date("2025-12-02T08:20:00"),
  },
  {
    id: "temp-15",
    uid: "demo-uid",
    type: "thermometer",
    imageUrl: "/placeholder.svg",
    readingText: "98.3°F",
    capturedAt: new Date("2025-12-01T08:30:00"),
  },

  {
    id: "bp-11",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "127/87 mmHg",
    capturedAt: new Date("2025-12-05T09:00:00"),
  },
  {
    id: "bp-12",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "114/74 mmHg",
    capturedAt: new Date("2025-12-04T09:15:00"),
  },
  {
    id: "bp-13",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "123/83 mmHg",
    capturedAt: new Date("2025-12-03T09:00:00"),
  },
  {
    id: "bp-14",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "117/77 mmHg",
    capturedAt: new Date("2025-12-02T09:30:00"),
  },
  {
    id: "bp-15",
    uid: "demo-uid",
    type: "bp",
    imageUrl: "/placeholder.svg",
    readingText: "126/86 mmHg",
    capturedAt: new Date("2025-12-01T09:15:00"),
  },

  {
    id: "glucose-11",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "112 mg/dL",
    capturedAt: new Date("2025-12-05T07:30:00"),
  },
  {
    id: "glucose-12",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "89 mg/dL",
    capturedAt: new Date("2025-12-04T07:45:00"),
  },
  {
    id: "glucose-13",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "103 mg/dL",
    capturedAt: new Date("2025-12-03T07:30:00"),
  },
  {
    id: "glucose-14",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "96 mg/dL",
    capturedAt: new Date("2025-12-02T07:15:00"),
  },
  {
    id: "glucose-15",
    uid: "demo-uid",
    type: "glucometer",
    imageUrl: "/placeholder.svg",
    readingText: "109 mg/dL",
    capturedAt: new Date("2025-12-01T07:45:00"),
  },

  {
    id: "weight-11",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "71.2 kg",
    capturedAt: new Date("2025-12-05T06:00:00"),
  },
  {
    id: "weight-12",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "69.0 kg",
    capturedAt: new Date("2025-12-04T06:15:00"),
  },
  {
    id: "weight-13",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "70.7 kg",
    capturedAt: new Date("2025-12-03T06:00:00"),
  },
  {
    id: "weight-14",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "69.8 kg",
    capturedAt: new Date("2025-12-02T06:30:00"),
  },
  {
    id: "weight-15",
    uid: "demo-uid",
    type: "weight",
    imageUrl: "/placeholder.svg",
    readingText: "70.9 kg",
    capturedAt: new Date("2025-12-01T06:15:00"),
  },
];

export const MOCK_HOSPITALS = [
  {
    id: "1",
    nameKey: "cityGeneralHospital",
    addressKey: "mainRoadDelhi",
    lat: 28.6139,
    lng: 77.209,
    distanceKm: 1.2,
  },
  {
    id: "2",
    nameKey: "apolloClinic",
    addressKey: "parkStreetDelhi",
    lat: 28.618,
    lng: 77.213,
    distanceKm: 2.5,
  },
  {
    id: "3",
    nameKey: "communityHealthCenter",
    addressKey: "nehruPlaceDelhi",
    lat: 28.61,
    lng: 77.205,
    distanceKm: 3.8,
  },
];

// Get user data
export const getUser = async (uid: string) => {
  if (!db) {
    return {
      phoneHash: "demo",
      name: "Demo User",
      langCode: "en",
      homeLocation: { lat: 28.6139, lng: 77.209 },
    };
  }

  try {
    const userDoc = await getDocs(
      query(
        collection(db, "users"),
        where("__name__", "==", uid),
        firestoreLimit(1)
      )
    );
    if (!userDoc.empty) {
      return { id: userDoc.docs[0].id, ...userDoc.docs[0].data() };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  return null;
};

// List prescriptions with optional filters
export const listPrescriptions = async (
  uid: string,
  filters?: { from?: Date; to?: Date; lang?: string }
) => {
  if (!db) {
    let results = [...MOCK_PRESCRIPTIONS];

    if (filters?.from) {
      results = results.filter((p) => p.createdAt >= filters.from!);
    }
    if (filters?.to) {
      results = results.filter((p) => p.createdAt <= filters.to!);
    }
    if (filters?.lang) {
      results = results.filter((p) => p.language === filters.lang);
    }

    return results;
  }

  try {
    let q = query(
      collection(db, "prescriptions"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const prescriptions = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });

    // Apply filters
    let results = prescriptions;
    if (filters?.from) {
      results = results.filter((p: any) => p.createdAt >= filters.from!);
    }
    if (filters?.to) {
      results = results.filter((p: any) => p.createdAt <= filters.to!);
    }
    if (filters?.lang) {
      results = results.filter((p: any) => p.language === filters.lang);
    }

    return results;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return MOCK_PRESCRIPTIONS;
  }
};

// List vitals photos with optional type filter
export const listVitals = async (uid: string, filters?: { type?: string }) => {
  if (!db) {
    let results = [...MOCK_VITALS];

    if (filters?.type) {
      results = results.filter((v) => v.type === filters.type);
    }

    return results;
  }

  try {
    let q = query(
      collection(db, "vitalsPhotos"),
      where("uid", "==", uid),
      orderBy("capturedAt", "desc")
    );

    const snapshot = await getDocs(q);
    const vitals = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        capturedAt: data.capturedAt?.toDate() || new Date(),
      };
    });

    // Apply filters
    let results = vitals;
    if (filters?.type) {
      results = results.filter((v: any) => v.type === filters.type);
    }

    return results;
  } catch (error) {
    console.error("Error fetching vitals:", error);
    return MOCK_VITALS;
  }
};

// Search for real hospitals using Overpass API (OpenStreetMap)
const searchRealHospitals = async (
  lat: number,
  lng: number,
  radius: number = 5000
) => {
  try {
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        way["amenity"="clinic"](around:${radius},${lat},${lng});
        node["amenity"="doctors"](around:${radius},${lat},${lng});
        way["amenity"="doctors"](around:${radius},${lat},${lng});
      );
      out center;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: overpassQuery,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch hospitals from Overpass API");
    }

    const data = await response.json();

    return data.elements
      .filter(
        (element) =>
          element.tags &&
          (element.tags.name ||
            element.tags.operator ||
            element.tags["addr:street"])
      )
      .map((element, index) => {
        const elementLat = element.lat || element.center?.lat;
        const elementLng = element.lon || element.center?.lon;

        if (!elementLat || !elementLng) return null;

        // Generate a better name if the original is generic
        let hospitalName = element.tags.name;
        if (
          !hospitalName ||
          hospitalName.toLowerCase() === "hospital" ||
          hospitalName.toLowerCase() === "clinic"
        ) {
          // Try to create a more descriptive name
          if (element.tags.operator) {
            hospitalName = element.tags.operator;
          } else if (element.tags["addr:street"]) {
            hospitalName = `${element.tags.amenity || "Hospital"} - ${
              element.tags["addr:street"]
            }`;
          } else if (element.tags["addr:suburb"]) {
            hospitalName = `${element.tags.amenity || "Hospital"} - ${
              element.tags["addr:suburb"]
            }`;
          } else {
            hospitalName = element.tags.amenity || "Hospital";
          }
        }

        const address =
          element.tags["addr:full"] ||
          `${element.tags["addr:street"] || ""} ${
            element.tags["addr:city"] || ""
          }`.trim() ||
          element.tags["addr:suburb"] ||
          "";

        return {
          id: `real-${element.id || index}`,
          name: hospitalName, // Will be translated in the component
          originalName: element.tags.name || hospitalName, // Keep original for reference
          lat: elementLat,
          lng: elementLng,
          address: address, // Will be translated in the component
          originalAddress: address, // Keep original for reference
          distanceKm: calculateDistance(lat, lng, elementLat, elementLng),
          phone: element.tags.phone || "",
          website: element.tags.website || "",
          real: true,
          emergency: element.tags.emergency || "",
          openingHours: element.tags["opening_hours"] || "",
          healthcare: element.tags.healthcare || "",
          operator: element.tags.operator || "",
          amenity: element.tags.amenity || "hospital",
          originalAmenity: element.tags.amenity || "hospital",
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 20); // Limit to 20 results
  } catch (error) {
    console.error("Error fetching real hospitals:", error);
    return [];
  }
};

// Get nearby hospitals (tries real data first, falls back to mock)
export const getNearbyHospitals = async (
  lat: number,
  lng: number,
  language: string = "en"
) => {
  try {
    // First try to get real hospitals
    const realHospitals = await searchRealHospitals(lat, lng);

    if (realHospitals.length > 0) {
      console.log("Found real hospitals:", realHospitals.length);
      // Translate hospital names and details based on user language
      const enhancedHospitals = await Promise.all(
        realHospitals.map(async (hospital) => {
          // Always translate hospital name
          const translatedName = translateHospitalName(hospital.name, language);
          if (translatedName !== hospital.name) {
            console.log(
              `Translated name: "${hospital.name}" -> "${translatedName}"`
            );
          }

          // Always translate address
          const translatedAddress = translateHospitalAddress(
            hospital.address,
            language
          );
          if (translatedAddress !== hospital.address) {
            console.log(
              `Translated address: "${hospital.address}" -> "${translatedAddress}"`
            );
          }

          // Translate operator if available
          const translatedOperator = hospital.operator
            ? translateHospitalName(hospital.operator, language)
            : hospital.operator;
          if (translatedOperator !== hospital.operator) {
            console.log(
              `Translated operator: "${hospital.operator}" -> "${translatedOperator}"`
            );
          }

          const baseHospital = {
            ...hospital,
            name: translatedName,
            address: translatedAddress,
            operator: translatedOperator,
            amenity: translateAmenityType(
              hospital.originalAmenity || hospital.amenity,
              language
            ),
          };

          // Enhance with detailed information
          return await enhanceHospitalWithDetails(baseHospital);
        })
      );

      return enhancedHospitals;
    }

    // Fallback to mock hospitals if no real ones found
    console.log("No real hospitals found, using mock data");
    return MOCK_HOSPITALS.map((h) => ({
      ...h,
      distanceKm: calculateDistance(lat, lng, h.lat, h.lng),
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    // Fallback to mock hospitals on error
    return MOCK_HOSPITALS.map((h) => ({
      ...h,
      distanceKm: calculateDistance(lat, lng, h.lat, h.lng),
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  }
};

// Simple distance calculation (Haversine formula)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
