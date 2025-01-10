export class MessageSanitizationUtil {
  private static readonly allowedCharactersRegex = new RegExp(/[^!A-Za-z0-9\s\-%_]/g);

  static sanitize(message: string): string {
    return message.replace(this.allowedCharactersRegex, '');
  }
}
