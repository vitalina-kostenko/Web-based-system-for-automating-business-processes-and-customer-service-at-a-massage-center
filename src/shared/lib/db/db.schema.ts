import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

const createdAt = () =>
  timestamp("created_at", { mode: "date" }).notNull().$defaultFn(() => new Date());
const updatedAt = () =>
  timestamp("updated_at", { mode: "date" }).notNull().$defaultFn(() => new Date());

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  phone: text("phone"),
  role: text("role", { enum: ["client", "admin"] }).notNull().default("client"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: "date" }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("Класичний"),
  durationMin: integer("duration_min").notNull(),
  price: integer("price").notNull(),
  active: boolean("active").notNull().default(true),
});

export const masters = pgTable("masters", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  active: boolean("active").notNull().default(true),
});

export const masterServices = pgTable(
  "master_services",
  {
    masterId: text("master_id").notNull().references(() => masters.id, { onDelete: "cascade" }),
    serviceId: text("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.masterId, t.serviceId] })],
);

export const masterSchedules = pgTable(
  "master_schedules",
  {
    masterId: text("master_id").notNull().references(() => masters.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(),
    startMin: integer("start_min").notNull(),
    endMin: integer("end_min").notNull(),
  },
  (t) => [primaryKey({ columns: [t.masterId, t.weekday] })],
);

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  serviceId: text("service_id").notNull().references(() => services.id),
  masterId: text("master_id").notNull().references(() => masters.id),
  startsAt: timestamp("starts_at", { mode: "date" }).notNull(),
  endsAt: timestamp("ends_at", { mode: "date" }).notNull(),
  status: text("status", { enum: ["pending", "confirmed", "completed", "cancelled"] })
    .notNull()
    .default("pending"),
  price: integer("price").notNull(),
  discountPercent: integer("discount_percent").notNull().default(0),
  promoCode: text("promo_code"),
  notes: text("notes"),
  createdAt: createdAt(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  read: boolean("read").notNull().default(false),
  createdAt: createdAt(),
});

export const waitlist = pgTable("waitlist", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  serviceId: text("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  masterId: text("master_id").notNull().references(() => masters.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  notified: boolean("notified").notNull().default(false),
  createdAt: createdAt(),
});

export const promoCodes = pgTable("promo_codes", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  kind: text("kind", { enum: ["percent", "fixed"] }).notNull(),
  value: integer("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  appointmentId: text("appointment_id").notNull().unique().references(() => appointments.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  masterId: text("master_id").notNull().references(() => masters.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: createdAt(),
});

export const appointmentRelations = relations(appointments, ({ one }) => ({
  service: one(services, { fields: [appointments.serviceId], references: [services.id] }),
  master: one(masters, { fields: [appointments.masterId], references: [masters.id] }),
}));
