export type PersonalDetails = {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    photoUrl?: string;
    description?: string;
    postSeeking?: string;
};

export type User = {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
    // Informations personnelles
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    nationality?: string;
    // Adresse
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    // Professionnel
    profession?: string;
    company?: string;
    industry?: string;
    experienceLevel?: 'entry' | 'junior' | 'mid' | 'senior' | 'executive';
    // Contact & social
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    // Préférences
    preferredLanguage?: string;
    timezone?: string;
    // Marketing
    newsletter?: boolean;
    marketingConsent?: boolean;
    // Bio
    bio?: string;
};

export type AuthResponse = {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
};

export type Country = {
    code: string;
    name: string;
    flag: string;
    cvTemplates?: CvTemplate[];
};

export type CvTemplate = {
    id: string;
    name: string;
    country: string;
    description: string;
    previewUrl: string;
    structure: {
        sections: string[];
        requiredFields: string[];
        optionalFields: string[];
    };
};

export type CvTheme = {
    id: string;
    name: string;
    category: 'professional' | 'creative' | 'modern' | 'minimal';
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        textLight: string;
        border: string;
    };
    typography: {
        headerFont: string;
        bodyFont: string;
        headerSize: string;
        bodySize: string;
        fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
    };
    layout: {
        style: 'modern' | 'classic' | 'creative' | 'minimal';
        borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
        shadow: 'none' | 'small' | 'medium' | 'large';
        spacing: 'compact' | 'normal' | 'relaxed';
    };
    preview: string; // Couleur de preview
};

export type CvCustomization = {
    theme: CvTheme;
    showPhoto: boolean;
    sectionsOrder: string[];
    fontSize: 'small' | 'medium' | 'large';
    spacing: 'compact' | 'normal' | 'relaxed';
    colorScheme: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'custom';
    customColors?: {
        primary: string;
        secondary: string;
        accent: string;
    };
};

export type Experience = {
    id?: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate: string;
    description: string;
};

export type Education = {
    id?: string;
    school: string;
    degree: string;
    description: string;
    startDate: string;
    endDate: string;
};

export type Skill = {
    id?: string;
    name: string;
};

export type Language = {
    id?: string;
    language: string;
    proficiency: string; 
};

export type Hobby = {
    id?: string;
    name: string;
};

export const emptyPersonalDetails: PersonalDetails = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    photoUrl: '',
    postSeeking: '',
    description: '',
};