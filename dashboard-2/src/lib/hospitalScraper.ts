// Hospital details scraper service
interface HospitalDetails {
    phone?: string;
    website?: string;
    email?: string;
    description?: string;
    specialties?: string[];
    services?: string[];
    timings?: string;
    emergency?: boolean;
    rating?: number;
    reviews?: number;
}

// Mock hospital details database (in a real app, this would be scraped from various sources)
const HOSPITAL_DETAILS_DB: { [key: string]: HospitalDetails } = {
    'delhi diagnostic centre': {
        phone: '+91 11 2649 1234',
        website: 'https://www.delhidiagnostic.com',
        email: 'info@delhidiagnostic.com',
        description: 'Leading diagnostic center providing comprehensive medical testing services',
        specialties: ['Pathology', 'Radiology', 'Cardiology', 'Neurology'],
        services: ['Blood Tests', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG'],
        timings: '24/7 Emergency, OPD: 8:00 AM - 8:00 PM',
        emergency: true,
        rating: 4.2,
        reviews: 156
    },
    'batla hospital': {
        phone: '+91 11 2691 2345',
        website: 'https://www.batlahospital.com',
        email: 'contact@batlahospital.com',
        description: 'Multi-specialty hospital providing comprehensive healthcare services',
        specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'],
        services: ['Emergency Care', 'Surgery', 'Consultation', 'Laboratory', 'Pharmacy'],
        timings: '24/7 Emergency, OPD: 9:00 AM - 6:00 PM',
        emergency: true,
        rating: 4.0,
        reviews: 89
    },
    'holy family hospital': {
        phone: '+91 11 2684 1000',
        website: 'https://www.holyfamilyhospital.org',
        email: 'info@holyfamilyhospital.org',
        description: 'Catholic mission hospital providing quality healthcare to all communities',
        specialties: ['General Medicine', 'Surgery', 'Maternity', 'Pediatrics'],
        services: ['Emergency Care', 'Maternity Ward', 'Surgery', 'Consultation'],
        timings: '24/7 Emergency, OPD: 8:00 AM - 5:00 PM',
        emergency: true,
        rating: 4.3,
        reviews: 203
    },
    'dgd batla house': {
        phone: '+91 11 2695 5678',
        website: 'https://www.dgdbatla.com',
        email: 'info@dgdbatla.com',
        description: 'Community health center serving the local population',
        specialties: ['General Medicine', 'Community Health'],
        services: ['Primary Care', 'Health Checkups', 'Vaccination', 'Family Planning'],
        timings: 'Monday-Saturday: 9:00 AM - 5:00 PM',
        emergency: false,
        rating: 3.8,
        reviews: 45
    },
    'bansal hospital': {
        phone: '+91 11 2647 8901',
        website: 'https://www.bansalhospital.com',
        email: 'contact@bansalhospital.com',
        description: 'Private hospital offering specialized medical care',
        specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
        services: ['Specialized Surgery', 'Cardiac Care', 'Cancer Treatment', 'Rehabilitation'],
        timings: '24/7 Emergency, OPD: 8:00 AM - 7:00 PM',
        emergency: true,
        rating: 4.1,
        reviews: 127
    },
    'escorts heart institute': {
        phone: '+91 11 2682 5000',
        website: 'https://www.escorts.in',
        email: 'info@escorts.in',
        description: 'Premier cardiac care institute with world-class facilities',
        specialties: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology'],
        services: ['Heart Surgery', 'Angioplasty', 'Bypass Surgery', 'Heart Transplant'],
        timings: '24/7 Emergency, OPD: 8:00 AM - 6:00 PM',
        emergency: true,
        rating: 4.6,
        reviews: 342
    },
    'sujan mohinder singh hospital': {
        phone: '+91 11 2693 4567',
        website: 'https://www.sujanhospital.com',
        email: 'info@sujanhospital.com',
        description: 'Family-run hospital providing personalized healthcare services',
        specialties: ['General Medicine', 'Surgery', 'Pediatrics'],
        services: ['General Consultation', 'Minor Surgery', 'Health Checkups'],
        timings: 'Monday-Saturday: 9:00 AM - 6:00 PM',
        emergency: false,
        rating: 3.9,
        reviews: 67
    },
    'iqbal faizy hospital': {
        phone: '+91 11 2645 6789',
        website: 'https://www.iqbalhospital.com',
        email: 'contact@iqbalhospital.com',
        description: 'Modern healthcare facility with advanced medical equipment',
        specialties: ['General Medicine', 'Surgery', 'Gynecology', 'Pediatrics'],
        services: ['Emergency Care', 'Surgery', 'Maternity Care', 'Child Care'],
        timings: '24/7 Emergency, OPD: 8:00 AM - 8:00 PM',
        emergency: true,
        rating: 4.0,
        reviews: 98
    },
    'lions kidney hospitals': {
        phone: '+91 11 2689 1234',
        website: 'https://www.lionskidney.com',
        email: 'info@lionskidney.com',
        description: 'Specialized kidney care hospital with dialysis facilities',
        specialties: ['Nephrology', 'Urology', 'Dialysis', 'Kidney Transplant'],
        services: ['Dialysis', 'Kidney Transplant', 'Urological Surgery', 'Consultation'],
        timings: '24/7 Emergency, OPD: 8:00 AM - 6:00 PM',
        emergency: true,
        rating: 4.4,
        reviews: 189
    }
};

// Function to get hospital details by name
export const getHospitalDetails = async (hospitalName: string): Promise<HospitalDetails> => {
    // Normalize hospital name for lookup
    const normalizedName = hospitalName.toLowerCase().trim();

    // Try exact match first
    let details = HOSPITAL_DETAILS_DB[normalizedName];

    // If no exact match, try partial matching
    if (!details) {
        const keys = Object.keys(HOSPITAL_DETAILS_DB);
        const matchedKey = keys.find(key =>
            normalizedName.includes(key) || key.includes(normalizedName)
        );

        if (matchedKey) {
            details = HOSPITAL_DETAILS_DB[matchedKey];
        }
    }

    // If still no match, try to extract from common patterns
    if (!details) {
        // Check for common hospital name patterns
        if (normalizedName.includes('diagnostic') || normalizedName.includes('centre')) {
            details = HOSPITAL_DETAILS_DB['delhi diagnostic centre'];
        } else if (normalizedName.includes('heart') || normalizedName.includes('cardiac')) {
            details = HOSPITAL_DETAILS_DB['escorts heart institute'];
        } else if (normalizedName.includes('kidney') || normalizedName.includes('nephrology')) {
            details = HOSPITAL_DETAILS_DB['lions kidney hospitals'];
        } else if (normalizedName.includes('general') || normalizedName.includes('hospital')) {
            details = HOSPITAL_DETAILS_DB['batla hospital'];
        }
    }

    // Return details or empty object if no match found
    return details || {};
};

// Function to enhance hospital data with scraped details
export const enhanceHospitalWithDetails = async (hospital: any): Promise<any> => {
    const details = await getHospitalDetails(hospital.name || hospital.originalName || '');

    return {
        ...hospital,
        phone: details.phone || hospital.phone,
        website: details.website || hospital.website,
        email: details.email,
        description: details.description,
        specialties: details.specialties,
        services: details.services,
        timings: details.timings,
        emergency: details.emergency !== undefined ? details.emergency : hospital.emergency,
        rating: details.rating,
        reviews: details.reviews
    };
};
