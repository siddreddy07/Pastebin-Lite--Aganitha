import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const pastes = pgTable('pastes', {
  id: uuid('id').primaryKey(),
  content: text('content').notNull(),
  expiresAt: timestamp('expires_at'), // null = never expires by time
  maxViews: integer('max_views'), // null = unlimited views
  views: integer('views').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
