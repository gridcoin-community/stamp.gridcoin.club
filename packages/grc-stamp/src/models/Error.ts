export const BAD_PARAMETER = 470;

export class ErrorModel {
  public status: number;

  public title: string;

  public detail?: string;

  public static BAD_PARAMETER = 470;

  public static NOT_FOUND = 404;

  constructor(
    status: number,
    title: string,
    message?: string,
  ) {
    this.status = status;
    this.title = title || 'Internal Server Error';
    if (message) {
      this.detail = message;
    }
  }
}
