import "dotenv/config";
import { prisma } from "../db/prisma";
import { hashPassword } from "../utils/password";

async function seed() {
  const adminEmail = "admin@helpdesk.local";
  const agentEmail = "agent1@helpdesk.local";

  const adminPass = "Admin12345";
  const agentPass = "Agent12345";

  const [adminHash, agentHash] = await Promise.all([
    hashPassword(adminPass),
    hashPassword(agentPass),
  ]);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: agentEmail },
    update: {},
    create: {
      email: agentEmail,
      name: "Agent One",
      passwordHash: agentHash,
      role: "AGENT",
    },
  });

  await prisma.team.upsert({
    where: { name: "Support" },
    update: {},
    create: { name: "Support" },
  });

  console.log("Seed done:");
  console.log(`ADMIN  ${adminEmail} / ${adminPass}`);
  console.log(`AGENT  ${agentEmail} / ${agentPass}`);
}

seed()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
