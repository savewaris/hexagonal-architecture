export interface OffsetPaginationResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CursorPaginationResult<T> {
  data: T[];
  meta: {
    nextCursor: string | null;
    prevCursor: string | null;
    pageSize: number;
    hasMore: boolean;
  };
}

/**
 * Advanced First-Principles Core Engine: Offset & Cursor Pagination Engine.
 * Generates type-safe pagination metadata and base64 cursor tokens for database APIs.
 */
export class Paginator {
  public static paginateOffset<T>(items: T[], page = 1, pageSize = 10): OffsetPaginationResult<T> {
    const currentPage = Math.max(1, page);
    const limit = Math.max(1, pageSize);
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const offset = (currentPage - 1) * limit;
    const data = items.slice(offset, offset + limit);

    return {
      data,
      meta: {
        totalItems,
        currentPage,
        pageSize: limit,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  }

  public static encodeCursor(value: string | number): string {
    return Buffer.from(String(value), 'utf8').toString('base64url');
  }

  public static decodeCursor(cursor: string): string {
    return Buffer.from(cursor, 'base64url').toString('utf8');
  }
}
