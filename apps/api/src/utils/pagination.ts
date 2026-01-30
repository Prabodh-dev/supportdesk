export function parsePagination(q: any) {
  const page = Math.max(1, Number(q.page ?? 1));
  const limitRaw = Number(q.limit ?? 20);
  const limit = Math.min(50, Math.max(1, limitRaw));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
