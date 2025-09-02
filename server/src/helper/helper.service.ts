import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Pagination } from "src/types";

@Injectable()
export class HelperService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   *check if a string is null or empty
   * @param text - The string to be tested.
   */
  isStringEmptyOrNull(text: string): boolean {
    return text === null || text === undefined || text.trim().length === 0;
  }

  /**
   *convert the date string to the date object
   * @param dateString - Format YYYY-MM-DD.
   * @returns A date object.
   */
  convertDateString(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    } else {
      throw new Error("Date Format is not correct, Use yyyy-mm-dd format");
    }
  }

  convertToMilliseconds(time: string): number {
    const timeValue = parseInt(time.slice(0, -1));
    const timeUnit = time.slice(-1).toLowerCase();

    switch (timeUnit) {
      case "d":
        return timeValue * 24 * 60 * 60 * 1000; // days to milliseconds
      case "h":
        return timeValue * 60 * 60 * 1000; // hours to milliseconds
      case "m":
        return timeValue * 60 * 1000; // minutes to milliseconds
      case "s":
        return timeValue * 1000; // seconds to milliseconds
      default:
        throw new Error("Invalid time format");
    }
  }

  /**
   * add days, hours, minutes, seconds to the date
   * @param date - The date to be modified, derived from the @param convertDateString function.
   * @param days - The number of days to be added to the date.
   * @param hours - The number of hours to be added to the date.
   * @param minutes - The number of minutes to be added to the date.
   * @param seconds - The number of seconds to be added to the date.
   * @returns A new date with the added days, hours, minutes, and seconds.
   */
  addDate(
    date: Date,
    days = 0,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
  ): Date {
    const newDate: Date = new Date(date.getTime());
    newDate.setDate(date.getDate() + days);
    newDate.setHours(date.getHours() + hours);
    newDate.setMinutes(date.getMinutes() + minutes);
    newDate.setSeconds(date.getSeconds() + seconds);
    return newDate;
  }

  //generate random n digits
  /**
   * Generate a random number with n digits.
   * @param n - The number of digits to be generated.
   * @returns A random number with n digits.
   * @throws An error if n is less than 1.
   */
  generateRandomNDigits(n: number): number {
    if (n < 1 || n > 16) throw new Error("n should be between 1 and 16");
    const lowerLimit: number = Math.pow(10, n - 1);
    const upperLimit: number = Math.pow(10, n) - 1;
    const randomNumber = Math.floor(
      Math.random() * (upperLimit - lowerLimit + 1) + lowerLimit,
    );
    return randomNumber;
  }

  /**
   * Generate a random string with a specified length.
   * @param length - The length of the string to be generated.
   * @returns A random string with the specified length.
   */

  generateString(length: number): string {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    let otp = "";

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      otp += characters[index];
    }

    return otp;
  }

  /**
   * Generate a random OTP with a specified length.
   * @param length - The length of the OTP to be generated.
   * @returns A random OTP with the specified length.
   */
  generateOTP(length: number): string {
    const characters = "0123456789";
    let otp = "";

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      otp += characters[index];
    }

    return otp;
  }

  convertStringToObject(
    text: string,
    separator: string,
    subSeparator: string,
  ): any {
    if (!text || text.trim().length === 0) {
      return null;
    }
    const items = text.split(separator);
    const result = items.reduce((acc, item) => {
      if (item) {
        const keyValuePair = item.split(subSeparator);
        const key = keyValuePair[0]?.trim();
        const value = keyValuePair[1];
        if (key && value !== undefined) {
          acc[key] = value;
        }
      }
      return acc;
    }, {});
    return result;
  }

  /**
   * Paginate a list of items
   * @param total - The total number of items.
   * @param page - The current page number.
   * @param limit - The number of items per page.
   * @param hasMore - Shows if there is more data in the table to be fetched
   * @returns Pagination details.
   */
  paginate(
    totalItems: number,
    page: number = 1,
    limit: number = 10,
  ): Pagination {
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);

    return {
      totalItems,
      page: currentPage,
      limit,
      totalPages,
      hasMore: currentPage < totalPages,
      pageSize: limit,
    };
  }

  async getConnections<T extends keyof PrismaService>(
    table: T,
    names: string[],
  ): Promise<Array<{ id: string }>> {
    // Use a type assertion to ensure TypeScript understands the structure
    const model = this.prisma[table] as unknown as {
      findMany: (args: {
        where: { name: { in: string[]; mode: "insensitive" } };
        select: { id: true };
      }) => Promise<Array<{ id: string }>>;
    };

    const results = await model.findMany({
      where: { name: { in: names, mode: "insensitive" } },
      select: { id: true },
    });

    return results.filter((result) => result !== undefined);
  }
}
