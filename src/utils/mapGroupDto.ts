export function mapGroupDto(dto: Record<string, unknown>, meId: string | number) {
  const id = dto.id ?? dto.groupId ?? dto.groupid
  const ownerId = dto.ownerId ?? dto.owner_userid ?? dto.ownerUserId
  const createdAt = dto.createdAt ?? dto.created_at

  return {
    id: String(id),
    name: String(dto.name || ''),
    description: String(dto.description || ''),
    ownerId: String(ownerId),
    createdAt: String(createdAt || new Date().toISOString()),
    isOwner: String(ownerId) === String(meId),
  }
}
