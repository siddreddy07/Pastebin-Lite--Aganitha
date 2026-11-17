import { v4 } from 'uuid';
import { and,eq, gt, isNull, lt, or, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { pastes } from '../schema/index.js';

export const createPaste = async (content: string, expiresAt?: string, maxViews?: number) => {
  const [paste] = await db
    .insert(pastes)
    .values({
      id: v4(),
      content,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      maxViews: maxViews ?? null,
    })
    .returning();
  return paste!;
};

// Read-only: same facts as viewPaste but never counts a view and never returns the content.
export const getPasteStatus = async (id: string) => {
  const [paste] = await db.select().from(pastes).where(eq(pastes.id, id));
  if (!paste) return null;

  const expired = paste.expiresAt !== null && paste.expiresAt <= new Date();
  const usedUp = paste.maxViews !== null && paste.views >= paste.maxViews;

  return {
    id: paste.id,
    views: paste.views,
    maxViews: paste.maxViews,
    expiresAt: paste.expiresAt,
    createdAt: paste.createdAt,
    active: !expired && !usedUp,
  };
};

// Atomically counts a view and returns the paste, or null if missing/expired/out of views.
export const viewPaste = async (id: string) => {
  const [paste] = await db
    .update(pastes)
    .set({ views: sql`${pastes.views} + 1` })
    .where(
      and(
        eq(pastes.id, id),
        or(isNull(pastes.expiresAt), gt(pastes.expiresAt, new Date())),
        or(isNull(pastes.maxViews), lt(pastes.views, pastes.maxViews)),
      ),
    )
    .returning();
  return paste ?? null;
};
