export type CategoryResponse = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
};
