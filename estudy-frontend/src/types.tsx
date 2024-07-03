export type User  = {
    username: string | null;
    auth: string | null;
    id: number | null;
    isLoggedIn: boolean| null;
}

export type Lecturer = {
    id: number;
    name: string | null;
    emailAddress: string | null;
}

export type Course = {
    id: number | null;
    title: string | null;
    description: string | null;
    lecturer: Lecturer | null;
    studyMaterials: [];
}

export type StudyMaterial = {
    id: number | null;
    title: string | null;
    description: string | null;
}
