export type Permission = string;

export interface RoleDefinition {
  name: string;
  permissions: Permission[];
  inherits?: string[];
}

export interface UserContext {
  id: string;
  roles: string[];
  attributes?: Record<string, unknown>;
}

/**
 * First-Principles Core Engine: Role-Based Access Control (RBAC) Evaluator.
 * Handles permission inheritance, wildcard matching (e.g. "users:*"), and rule evaluation.
 */
export class RBACEvaluator {
  private readonly roles: Map<string, RoleDefinition> = new Map();

  constructor(roleDefinitions: RoleDefinition[] = []) {
    roleDefinitions.forEach(role => this.registerRole(role));
  }

  public registerRole(role: RoleDefinition): void {
    this.roles.set(role.name, role);
  }

  public hasPermission(user: UserContext, requiredPermission: Permission): boolean {
    const userPermissions = this.getUserPermissions(user);

    return userPermissions.some(perm => this.matchPermission(perm, requiredPermission));
  }

  public getUserPermissions(user: UserContext): Permission[] {
    const permissions = new Set<Permission>();

    const collectPermissions = (roleName: string, visited = new Set<string>()) => {
      if (visited.has(roleName)) return; // Prevent circular inheritance loops
      visited.add(roleName);

      const role = this.roles.get(roleName);
      if (!role) return;

      role.permissions.forEach(p => permissions.add(p));

      if (role.inherits) {
        role.inherits.forEach(parentRole => collectPermissions(parentRole, visited));
      }
    };

    user.roles.forEach(roleName => collectPermissions(roleName));
    return Array.from(permissions);
  }

  private matchPermission(granted: string, required: string): boolean {
    if (granted === '*' || granted === required) return true;

    // Wildcard matching: e.g. "users:*" matches "users:read", "users:write"
    if (granted.endsWith(':*')) {
      const prefix = granted.slice(0, -2);
      return required.startsWith(prefix + ':') || required === prefix;
    }

    return false;
  }
}
