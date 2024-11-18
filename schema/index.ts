import {
  pgTable,
  index,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name").notNull(),
    email: varchar("email").notNull().unique(),
    phone: varchar("phone"),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("email_idx").on(table.email)],
);

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    name: varchar("name").notNull(),
    description: text("description"),
    image: text("image"),
    isPrivate: boolean("is_private").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("name_idx").on(table.name)],
);

export const userCredentials = pgTable("user_credentials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  password: text("password").notNull(),
  twoFactorMethod: varchar("two_factor_method", { enum: ["PHONE", "EMAIL"] }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  token: text("token").notNull(),
  region: text("region").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name").notNull(),
  type: varchar("type", { enum: ["PILL", "INJECTION", "SPRAY"] })
    .notNull()
    .default("PILL"),
  dosage: varchar("dosage").notNull(),
  frequency: varchar("frequency", {
    enum: [
      "AS NEEDED",
      "ONCE DAILY",
      "TWICE DAILY",
      "ONCE WEEKLY",
      "ONCE MONTHLY",
    ],
  })
    .notNull()
    .default("ONCE DAILY"),
  usage: varchar("usage", { enum: ["PREVENTATIVE", "RESCUE"] }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const headaches = pgTable(
  "headaches",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    startedAt: timestamp("started_at").notNull(),
    endedAt: timestamp("ended_at"),
    severity: integer("severity"),
    isAborted: boolean("is_aborted").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("started_at_idx").on(table.startedAt),
    index("ended_at_idx").on(table.endedAt),
  ],
);

export const headacheMedications = pgTable("headache_medications", {
  id: serial("id").primaryKey(),
  headacheId: integer("headache_id")
    .notNull()
    .references(() => headaches.id),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
