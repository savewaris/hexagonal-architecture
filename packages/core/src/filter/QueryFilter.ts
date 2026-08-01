export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';

export interface FilterRule {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Advanced First-Principles Core Engine: Dynamic Query Filter & Rule Engine.
 * Evaluates filter rule trees against in-memory objects.
 */
export class QueryFilter {
  public static evaluateRule<T extends Record<string, any>>(item: T, rule: FilterRule): boolean {
    const itemValue = item[rule.field];
    const targetValue = rule.value;

    switch (rule.operator) {
      case 'eq':
        return itemValue === targetValue;
      case 'ne':
        return itemValue !== targetValue;
      case 'gt':
        return itemValue > (targetValue as any);
      case 'gte':
        return itemValue >= (targetValue as any);
      case 'lt':
        return itemValue < (targetValue as any);
      case 'lte':
        return itemValue <= (targetValue as any);
      case 'contains':
        if (typeof itemValue === 'string' && typeof targetValue === 'string') {
          return itemValue.toLowerCase().includes(targetValue.toLowerCase());
        }
        return false;
      default:
        return false;
    }
  }

  public static filterItems<T extends Record<string, any>>(items: T[], rules: FilterRule[]): T[] {
    if (rules.length === 0) return items;

    return items.filter(item => rules.every(rule => this.evaluateRule(item, rule)));
  }
}
