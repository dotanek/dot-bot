export class ChatMessage {
  constructor(
    readonly content: string,
    readonly isCommand: boolean,
  ) {}
}