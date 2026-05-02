export function createSlug(text: string): string {
  return text
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^\w\s]/gi, '')
    .trim()
    .replaceAll(/\s+/g, '-')
    .toLowerCase()
}
