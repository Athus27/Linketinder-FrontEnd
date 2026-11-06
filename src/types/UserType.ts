export type UserType = "candidate" | "company";

export interface AuthenticatedUser {
	id: string;
	name: string;
	type: UserType;
}
