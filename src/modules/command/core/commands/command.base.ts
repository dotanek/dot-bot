export abstract class Command {
  abstract execute(): string;

  protected toFailure(reason: string): string {
    return `error: ${reason}`;
  }
}
