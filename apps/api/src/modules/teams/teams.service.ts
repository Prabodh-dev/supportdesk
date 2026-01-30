import { prisma } from "../../db/prisma";

export async function createTeam(name: string) {
  const exists = await prisma.team.findUnique({ where: { name } });
  if (exists) {
    const err: any = new Error("Team already exists");
    err.statusCode = 409;
    throw err;
  }
  return prisma.team.create({ data: { name } });
}

export async function listTeams() {
  return prisma.team.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, isActive: true, createdAt: true },
  });
}

export async function addMember(teamId: string, userId: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    const err: any = new Error("Team not found");
    err.statusCode = 404;
    throw err;
  }
  return prisma.teamMember.upsert({
    where: { teamId_userId: { teamId, userId } },
    update: {},
    create: { teamId, userId },
  });
}
