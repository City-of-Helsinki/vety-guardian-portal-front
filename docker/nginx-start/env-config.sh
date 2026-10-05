# Sourced by the ubi9/nginx image's run script at container start.
# Writes the allowlisted runtime variables into env-config.js, which index.html
# loads before the app bundle. Only names listed here are exposed to the browser.

write_env_config() {
  local name value
  printf 'window.__ENV__ = {\n'
  for name in VITE_API_BASE_URL VITE_LOCIZE_PROJECT_ID; do
    if [ -n "${!name:-}" ]; then
      value=$(printf '%s' "${!name}" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')
      printf '  %s: "%s",\n' "$name" "$value"
    fi
  done
  printf '};\n'
}

write_env_config > /opt/app-root/src/env-config.js
unset -f write_env_config
