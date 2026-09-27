export type ReviewUser = {
    id: string;
    firstName: string | null;
    lastName: string | null;
};

export type ReviewResponse = {
    id: string;
    rating: number;
    comment: string | null;
    user: ReviewUser;
    createdAt: Date;
    updatedAt: Date;
};

export type ReviewSummary = {
    averageRating: number;
    count: number;
};

export type ReviewListResponse = {
    items: ReviewResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    summary: ReviewSummary;
};
