import { ApiProperty } from "@nestjs/swagger";

export class UserResponseModel {
  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "Unique identifier of the user",
  })
  id: string;

  @ApiProperty({
    example: "user@example.com",
    description: "Email address of the user",
  })
  email: string;

  @ApiProperty({
    example: "john_doe",
    description: "Username of the user",
  })
  username: string;

  @ApiProperty({
    example: "John",
    description: "First name of the user",
  })
  firstName: string;

  @ApiProperty({
    example: "Doe",
    description: "Last name of the user",
  })
  lastName: string;

  @ApiProperty({
    example: "https://example.com/avatar.png",
    description: "Profile image URL (nullable)",
    nullable: true,
  })
  profileImage: string | null;

  @ApiProperty({
    example: "Software engineer and open-source enthusiast",
    description: "Short biography of the user (nullable)",
    nullable: true,
  })
  bio: string | null;

  @ApiProperty({
    example: "2025-09-01T12:34:56.789Z",
    description: "Last login timestamp (nullable)",
    nullable: true,
    type: String,
    format: "date-time",
  })
  lastLogin: Date | null;

  @ApiProperty({
    example: "2025-08-20T10:15:30.000Z",
    description: "Timestamp when the user was created",
    type: String,
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2025-09-01T14:20:00.000Z",
    description: "Timestamp when the user was last updated",
    type: String,
    format: "date-time",
  })
  updatedAt: Date;
}

export class AuthResponseModel {
  @ApiProperty({
    type: () => UserResponseModel,
    description: "Authenticated user details",
  })
  user: UserResponseModel;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",
    description: "Access token (JWT)",
  })
  accessToken: string;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",
    description: "Refresh token (JWT)",
  })
  refreshToken: string;
}
