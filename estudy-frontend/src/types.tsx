export type User  = {
    username: string | null;
    auth: string | null;
    id: number | null;
    isLoggedIn: boolean| null;
}

export type Course = {
    id: number | null;
    title: string | null;
    description: string | null;
    lecturer: string | null;
    studyMaterials: [];
}

export type StudyMaterial = {
    id: number | null;
    title: string | null;
    description: string | null;
}
