import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Unique email of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "john_doe",
    description: "Unique username for the user",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: "StrongP@ssw0rd",
    description: "Password with minimum 6 characters",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "John",
    description: "First name of the user",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: "Doe",
    description: "Last name of the user",
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "StrongP@ssw0rd",
    description: "User password",
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",
    description: "JWT refresh token",
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
