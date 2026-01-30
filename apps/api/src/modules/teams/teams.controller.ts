import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as s from "./teams.service";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const team = await s.createTeam(req.body.name);
  res.status(201).json({ team });
});

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await s.listTeams();
  res.json({ teams });
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await s.addMember(req.params.id, req.body.userId);
  res.status(201).json({ member });
});
