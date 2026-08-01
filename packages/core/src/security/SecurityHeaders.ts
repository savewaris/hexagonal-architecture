export interface SecurityHeadersConfig {
  enableHsts?: boolean;
  contentSecurityPolicy?: string;
  allowedCorsOrigins?: string[];
  frameOptions?: 'DENY' | 'SAMEORIGIN';
}

/**
 * Advanced First-Principles Core Engine: Security Headers Policy Builder.
 * OWASP Top 10 mitigation: generates HTTP security headers and CORS policies for API servers.
 */
export class SecurityHeaders {
  public static generateHeaders(config: SecurityHeadersConfig = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': config.frameOptions || 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    if (config.enableHsts !== false) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    }

    if (config.contentSecurityPolicy) {
      headers['Content-Security-Policy'] = config.contentSecurityPolicy;
    } else {
      headers['Content-Security-Policy'] = "default-src 'self'";
    }

    if (config.allowedCorsOrigins && config.allowedCorsOrigins.length > 0) {
      headers['Access-Control-Allow-Origin'] = config.allowedCorsOrigins.join(', ');
      headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Correlation-ID';
    }

    return headers;
  }
}
