import { Education, Experience, Hobby, Language, PersonalDetails, Skill } from '@/type';

export const personalDetailsPreset: PersonalDetails = {
    fullName: 'Tenena',
    email: 'tenena@example.com',
    phone: '+33678901234',
    address: '45, Rue des Développeurs, Lyon, France',
    photoUrl: '/profile.jpg',
    postSeeking: 'Développeur Web Full Stack',
    description: 'Développeur web passionné avec trois ans d’expérience dans la création d’applications web modernes et performantes. Expert en JavaScript, React, et Node.js, avec un solide bagage en bases de données et déploiement cloud. Toujours motivé à résoudre des problèmes complexes et à apprendre de nouvelles technologies.'
};

export const experiencesPreset: Experience[] = [
    {
        id: 'uuid-1',
        jobTitle: 'Développeur Web Full Stack',
        companyName: 'Digital Innovators',
        startDate: '2021-06-01',
        endDate: '2023-12-01',
        description: 'Conception et développement d’applications web responsives en utilisant React, Node.js, et MongoDB. Collaboration avec les équipes UI/UX pour optimiser l’expérience utilisateur.'
    },
    {
        id: 'uuid-2',
        jobTitle: 'Développeur Front-End',
        companyName: 'Creative Code',
        startDate: '2020-01-01',
        endDate: '2021-05-31',
        description: 'Développement d’interfaces utilisateur dynamiques et accessibles en utilisant HTML, CSS, JavaScript et React. Implémentation de tests unitaires et fonctionnels pour assurer la qualité du code.'
    }
];

export const educationsPreset: Education[] = [
    {
        id: 'uuid-3',
        degree: 'Licence en Informatique',
        school: 'Université de Technologie de Compiègne',
        startDate: '2017-09-01',
        endDate: '2020-06-01',
        description: 'Formation spécialisée en développement web, algorithmique, et bases de données.'
    },
    {
        id: 'uuid-0',
        degree: 'Licence en systeme d\'informations',
        school: 'Université de Technologie de Compiègne',
        startDate: '2017-09-01',
        endDate: '2020-06-01',
        description: 'Formation spécialisée en développement web, algorithmique, et bases de données.'
    }
];

export const skillsPreset: Skill[] = [
    { id: 'uuid-4', name: 'JavaScript' },
    { id: 'uuid-5', name: 'React.js' },
    { id: 'uuid-6', name: 'Node.js' },
    { id: 'uuid-7', name: 'MongoDB' },
    { id: 'uuid-8', name: 'Git & GitHub' },
    { id: 'uuid-9', name: 'Docker' },
    { id: 'uuid-10', name: 'TypeScript' }
];

export const languagesPreset: Language[] = [
    { id: 'uuid-6', language: 'Français', proficiency: 'Maternelle' },
    { id: 'uuid-7', language: 'Anglais', proficiency: 'Intermédiaire' }
];

export const hobbiesPreset: Hobby[] = [
    { id: 'uuid-8', name: 'Développement de projets personnels' },
    { id: 'uuid-9', name: 'Jouer aux échecs' },
    { id: 'uuid-10', name: 'Contribuer à des projets open-source' }
];
