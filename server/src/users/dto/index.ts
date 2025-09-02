import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateUserProfileDto {
  @ApiProperty({
    example: "John",
    description: "First name of the user",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({
    example: "Doe",
    description: "Last name of the user",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({
    example: "https://example.com/avatar.png",
    description: "Profile image URL",
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: "Profile image must be a valid URL" })
  profileImage?: string;

  @ApiProperty({
    example: "Passionate software engineer and open-source contributor",
    description: "Short biography of the user",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bio?: string;
}
