export class AppError extends Error {
  heading: string;

  constructor(heading: string, message: string) {
    super(message);

    this.heading = heading;
  }
}
