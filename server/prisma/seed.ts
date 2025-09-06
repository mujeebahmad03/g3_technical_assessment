import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";
import { PrismaClient, User } from "./generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with users...");

  const userPromises: Promise<User>[] = [];

  for (let i = 0; i < 10; i++) {
    const password = await argon2.hash("password123"); // default password for seeded users

    userPromises.push(
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username(),
          hashedPassword: password,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          profileImage: faker.image.avatar(),
          bio: faker.lorem.sentence(),
          lastLogin: faker.date.recent({ days: 10 }),
        },
      }),
    );
  }

  await Promise.all(userPromises);

  console.log("✅ Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma
      .$disconnect()
      .then(() => {
        console.log("Disconnected from database");
      })
      .catch((e) => {
        console.error(e);
      });
  });
