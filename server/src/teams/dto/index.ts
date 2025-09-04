import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Role } from "prisma/generated/prisma/enums";
import { UserResponseModel } from "src/models/auth.model";

export class CreateTeamDto {
  @ApiProperty({
    example: "Development Team",
    description: "Name of the team",
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "A team focused on developing new features",
    description: "Description of the team (optional)",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class InviteUserDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email address of the user to invite",
    required: false,
  })
  @ValidateIf((o: InviteUserDto) => !o.username)
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @ApiProperty({
    example: "john_doe",
    description: "Username of the user to invite",
    required: false,
  })
  @ValidateIf((o: InviteUserDto) => !o.email)
  @IsString()
  @MaxLength(50)
  username?: string;
}

export class BulkInviteDto {
  @ApiProperty({
    description: "List of users to invite",
    type: [InviteUserDto],
    example: [{ email: "alice@example.com" }, { username: "john_doe" }],
  })
  @IsArray()
  @ArrayMinSize(1, { message: "At least one invitee must be provided" })
  @ValidateNested({ each: true })
  @Type(() => InviteUserDto)
  invitees: InviteUserDto[];
}

export class BulkRemoveUserDto {
  @ApiProperty({
    description: "List of user IDs to remove from the team",
    type: [String],
    example: [
      "1a2b3c4d-5678-90ab-cdef-1234567890ab",
      "9z8y7x6w-5432-10ba-fedc-0987654321zy",
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: "At least one user ID must be provided" })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  targetIds: string[];
}

export class TeamMemberResponseModel {
  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "Unique identifier of the team member",
  })
  id: string;

  @ApiProperty({
    example: "ADMIN",
    description: "Role of the team member",
    enum: ["ADMIN", "MEMBER"],
  })
  role: string;

  @ApiProperty({
    example: "2025-09-01T12:34:56.789Z",
    description: "When the user joined the team",
    type: String,
    format: "date-time",
  })
  joinedAt: Date;

  @ApiProperty({
    example: "2025-09-01T12:34:56.789Z",
    description: "When the user was invited (nullable)",
    type: String,
    format: "date-time",
    nullable: true,
  })
  invitedAt: Date | null;

  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "ID of the user who sent the invitation (nullable)",
    nullable: true,
  })
  invitedBy: string | null;

  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "Unique identifier of the user",
  })
  userId: string;

  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "Unique identifier of the team",
  })
  teamId: string;

  @ApiProperty({
    description: "User details",
  })
  user: UserResponseModel;
}

export class TeamResponseModel {
  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "Unique identifier of the team",
  })
  id: string;

  @ApiProperty({
    example: "Development Team",
    description: "Name of the team",
  })
  name: string;

  @ApiProperty({
    example: "dev-team",
    description: "URL-friendly slug for the team (nullable)",
    nullable: true,
  })
  slug: string | null;

  @ApiProperty({
    example: "A team focused on developing new features",
    description: "Description of the team (nullable)",
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: false,
    description: "Whether the team is archived",
  })
  isArchived: boolean;

  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "ID of the team owner",
  })
  ownerId: string;

  @ApiProperty({
    example: "2025-08-20T10:15:30.000Z",
    description: "Timestamp when the team was created",
    type: String,
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2025-09-01T14:20:00.000Z",
    description: "Timestamp when the team was last updated",
    type: String,
    format: "date-time",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Team members",
    type: [TeamMemberResponseModel],
  })
  members?: TeamMemberResponseModel[];

  @ApiProperty({
    description: "Team owner details",
  })
  owner?: UserResponseModel;
}

export class UserTeamResponseModel {
  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "Unique identifier of the team",
  })
  id: string;

  @ApiProperty({
    example: "Development Team",
    description: "Name of the team",
  })
  name: string;

  @ApiProperty({
    example: "dev-team",
    description: "URL-friendly slug for the team (nullable)",
    nullable: true,
  })
  slug: string | null;

  @ApiProperty({
    example: "A team focused on developing new features",
    description: "Description of the team (nullable)",
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: false,
    description: "Whether the team is archived",
  })
  isArchived: boolean;

  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "ID of the team owner",
  })
  ownerId: string;

  @ApiProperty({
    example: "2025-08-20T10:15:30.000Z",
    description: "Timestamp when the team was created",
    type: String,
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2025-09-01T14:20:00.000Z",
    description: "Timestamp when the team was last updated",
    type: String,
    format: "date-time",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Role of user in d team",
    enum: Role,
  })
  role?: Role;
}

export class InvitationResponseModel {
  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "Unique identifier of the invitation",
  })
  id: string;

  @ApiProperty({
    example: "user@example.com",
    description: "Email address of the invited user",
  })
  email: string;

  @ApiProperty({
    example: "PENDING",
    description: "Status of the invitation",
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
  })
  status: string;

  @ApiProperty({
    example: "2025-09-01T12:34:56.789Z",
    description: "When the invitation was sent",
    type: String,
    format: "date-time",
  })
  invitedAt: Date;

  @ApiProperty({
    example: "2025-09-01T12:34:56.789Z",
    description: "When the invitation was accepted (nullable)",
    type: String,
    format: "date-time",
    nullable: true,
  })
  acceptedAt: Date | null;

  @ApiProperty({
    example: "2025-09-01T12:34:56.789Z",
    description: "When the invitation was rejected (nullable)",
    type: String,
    format: "date-time",
    nullable: true,
  })
  rejectedAt: Date | null;

  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "ID of the team",
  })
  teamId: string;

  @ApiProperty({
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    description: "ID of the user who sent the invitation",
  })
  invitedBy: string;
}
