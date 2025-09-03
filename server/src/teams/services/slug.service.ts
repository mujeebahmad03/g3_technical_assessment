import { Injectable } from "@nestjs/common";
import slugify from "slugify";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SlugService {
  constructor(private readonly prisma: PrismaService) {}

  async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await this.slugExists(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  private async slugExists(slug: string): Promise<boolean> {
    const team = await this.prisma.team.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !!team;
  }
}
