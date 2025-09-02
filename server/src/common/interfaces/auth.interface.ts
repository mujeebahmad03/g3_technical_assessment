import { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import { TeamMemberWithRelations, UserSelect } from "src/types/auth.types";

export interface AuthRequest extends Request {
  user: UserSelect;
  teamMember?: TeamMemberWithRelations;
}

export type AuthParams = ParamsDictionary;

export type AuthQuery = ParsedQs;

export interface AuthBody {
  teamId?: string;
  taskId?: string;
  [key: string]: unknown;
}

export interface TypedAuthRequest<
  TParams extends ParamsDictionary = AuthParams,
  TQuery extends ParsedQs = AuthQuery,
  TBody = AuthBody,
> extends Request<TParams, any, TBody, TQuery> {
  user: UserSelect;
  teamMember?: TeamMemberWithRelations;
}
