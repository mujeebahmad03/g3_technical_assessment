import z from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(50, "Team name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

export type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export const singleInviteSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
});

export const bulkInviteSchema = z.object({
  invitees: z
    .array(
      z.object({
        identifier: z.string().min(1, "Email or username is required"),
      }),
    )
    .min(1, "At least one invitee is required"),
});

export type SingleInviteFormValues = z.infer<typeof singleInviteSchema>;
export type BulkInviteFormValues = z.infer<typeof bulkInviteSchema>;
