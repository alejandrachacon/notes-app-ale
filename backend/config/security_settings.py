"""
Production security settings for Django
These settings are applied when ENVIRONMENT=production
"""

from decouple import config

def apply_production_security(settings_dict):
    """
    Apply production security settings to Django settings
    """
    # HTTPS/SSL Settings
    settings_dict['SECURE_SSL_REDIRECT'] = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
    settings_dict['SECURE_PROXY_SSL_HEADER'] = ('HTTP_X_FORWARDED_PROTO', 'https')
    
    # Cookie Security
    settings_dict['SESSION_COOKIE_SECURE'] = config('SESSION_COOKIE_SECURE', default=True, cast=bool)
    settings_dict['CSRF_COOKIE_SECURE'] = config('CSRF_COOKIE_SECURE', default=True, cast=bool)
    settings_dict['SESSION_COOKIE_HTTPONLY'] = True
    settings_dict['CSRF_COOKIE_HTTPONLY'] = True
    
    # HSTS Settings
    settings_dict['SECURE_HSTS_SECONDS'] = 31536000  # 1 year
    settings_dict['SECURE_HSTS_INCLUDE_SUBDOMAINS'] = True
    settings_dict['SECURE_HSTS_PRELOAD'] = True
    
    # Security Headers
    settings_dict['SECURE_CONTENT_TYPE_NOSNIFF'] = True
    settings_dict['SECURE_BROWSER_XSS_FILTER'] = True
    settings_dict['X_FRAME_OPTIONS'] = 'DENY'
    
    # Content Security Policy
    settings_dict['CSP_DEFAULT_SRC'] = ("'self'",)
    settings_dict['CSP_SCRIPT_SRC'] = ("'self'",)
    settings_dict['CSP_STYLE_SRC'] = ("'self'", "'unsafe-inline'")
    settings_dict['CSP_IMG_SRC'] = ("'self'", "data:", "https:")
    settings_dict['CSP_FONT_SRC'] = ("'self'",)
    settings_dict['CSP_CONNECT_SRC'] = ("'self'",)
    
    return settings_dict


def apply_development_security(settings_dict):
    """
    Apply development security settings (disable most security features)
    """
    settings_dict['SECURE_SSL_REDIRECT'] = False
    settings_dict['SESSION_COOKIE_SECURE'] = False
    settings_dict['CSRF_COOKIE_SECURE'] = False
    
    return settings_dict
