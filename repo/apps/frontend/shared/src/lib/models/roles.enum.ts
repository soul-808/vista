/**
 * Application user role definitions
 * This enum is shared across the application for role-based access control
 */
export enum UserRole {
  EXECUTIVE = "executive",
  ENGINEER = "engineer",
  COMPLIANCE = "compliance",
}

/**
 * Helper functions for working with roles
 */
export class RoleUtils {
  /**
   * Determines if a role has executive-level access (can access everything)
   */
  static isExecutiveRole(role: string): boolean {
    return role?.toLowerCase() === UserRole.EXECUTIVE.toLowerCase();
  }

  /**
   * Converts a string role to the enum value
   */
  static fromString(role: string): UserRole | undefined {
    const normalizedRole = role?.toLowerCase();
    return Object.values(UserRole).find(
      (r) => r.toLowerCase() === normalizedRole
    );
  }
}
