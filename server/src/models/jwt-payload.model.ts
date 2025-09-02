export class JWTPayload {
  sub: string;
  otp?: string;
  iss?: string; // Issuer
  aud?: string; // Audience
  iat?: number; // Issued at (auto-handled by JWT library)
  exp?: number; // Expiry timestamp (auto-handled by JWT library)
  resendTime?: number;
  requestType: JWTRequestType;
}

export enum JWTRequestType {
  Login = "login",
  UserVerification = "user-verification",
  ForgotPassword = "forgot-password",
  ResetPassword = "reset-password",
  TeamMemberInvitation = "team-member-invitation",
}

export class JWTResponse extends JWTPayload {
  expiryTime: Date;
  initiationTime: Date;
  data: string;
}
