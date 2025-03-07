export type User  = {
    username: string;
    emailAddress: string;
    auth: string;
    id: number;
    role: string;
    isLoggedIn: boolean;
}

export type Course = {
    id: number;
    title: string | null;
    description: string | null;
    lecturerName: string | null;
    studyMaterials: [];
}

export type StudyMaterial = {
    id: number;
    title: string | null;
    description: string | null;
}
