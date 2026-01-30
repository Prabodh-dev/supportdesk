import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as s from "./tickets.service";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await s.createTicket(req.user!.id, req.body);
  res.status(201).json({ ticket });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  // AGENT/ADMIN: all tickets
  // CUSTOMER: own tickets
  const role = req.user!.role;

  if (role === "CUSTOMER") {
    const data = await s.listTicketsCustomer(req.user!.id, req.query);
    return res.json(data);
  }

  const data = await s.listTicketsAgent(req.query);
  res.json(data);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await s.getTicketByIdForUser(req.params.id, req.user!);
  res.json({ ticket });
});

export const setStatus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await s.updateStatus(req.params.id, req.body.status);
  res.json({ ticket: updated });
});

export const assign = asyncHandler(async (req: Request, res: Response) => {
  const updated = await s.assign(req.params.id, req.body);
  res.json({ ticket: updated });
});
