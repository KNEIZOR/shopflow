export type ReviewUser = {
    id: string;
    firstName: string | null;
    lastName: string | null;
};

export type Review = {
    id: string;
    rating: number;
    comment: string | null;
    user: ReviewUser;
    createdAt: string;
    updatedAt: string;
};

export type ReviewSummary = {
    averageRating: number;
    count: number;
};

export type ReviewListResponse = {
    items: Review[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    summary: ReviewSummary;
};

export type CreateReviewInput = {
    rating: number;
    comment: string | null;
};

export type UpdateReviewInput = {
    rating?: number;
    comment?: string | null;
};
