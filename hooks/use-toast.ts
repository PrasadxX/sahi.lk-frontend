// Simple toast implementation
export function toast({ title, description }: { title: string; description?: string }) {
  // For now, use a simple alert. You can replace this with a proper toast library later
  if (typeof window !== 'undefined') {
    console.log(`${title}: ${description}`);
    // You can add a proper toast UI library like sonner or react-hot-toast later
  }
}
