export type UserType = "candidate" | "company" | "recruiter";

export interface AuthenticatedUser {
	id: string;
	name: string;
	type: UserType;
	companyId?: string;
}
