export * from "./user"

export interface CheckOnboardingResponse {
  started: boolean;
  completed: boolean;
  steps: number;
}