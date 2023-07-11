export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      myVariable: string;
    }
  }
}
