export function getPhotoUrl(filename: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${encodeURIComponent(filename)}`;
}
