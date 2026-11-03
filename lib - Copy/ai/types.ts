export type TutorContext = "tutor" | "quiz-hint" | "troubleshooting";
export type TutorRequest = { prompt: string; context: TutorContext };

export interface AiProvider {
  readonly mode: "mock" | "openai";
  respond(input: TutorRequest): Promise<string>;
}
