export const siteConfig = {
  name: "Calma",
  description: "Онлайн-запис та керування масажним центром",
  workHours: { start: 9, end: 20, stepMin: 30 },
  isClerkEnabled: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
};
