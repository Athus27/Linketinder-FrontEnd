export interface Like {
	id: string;
	candidateId: string;
	companyId: string;
	jobId: string;
	candidateLiked: boolean;
	companyLiked: boolean;
}

export type LikeStatus = "liked" | "already-liked" | "match" | "not-found" | "invalid-job";

export interface LikeResult {
	status: LikeStatus;
	like?: Like;
}
