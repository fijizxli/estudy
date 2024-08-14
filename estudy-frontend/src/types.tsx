export type User  = {
    username: string;
    emailAddress: string | null;
    auth: string | null;
    id: number | null;
    isLoggedIn: boolean| null;
}

export type Course = {
    id: number | null;
    title: string | null;
    description: string | null;
    lecturerName: string | null;
    studyMaterials: [];
}

export type StudyMaterial = {
    id: number | null;
    title: string | null;
    description: string | null;
}
