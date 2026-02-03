export type JobName =
  | "email.ticket_created"
  | "email.agent_replied"
  | "email.status_changed"
  | "sla.check";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export type TicketEventPayload = {
  ticketId: string;
  ticketNo: number;
  customerEmail: string;
  link?: string;
  meta?: Record<string, any>;
};
