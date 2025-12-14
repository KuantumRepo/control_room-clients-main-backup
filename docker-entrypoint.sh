#!/bin/sh

# Determine the public folder location
if [ -n "$APP_NAME" ]; then
    CONFIG_PATH="./apps/$APP_NAME/public/config.js"
else
    CONFIG_PATH="./public/config.js"
fi

echo "Generating runtime config at $CONFIG_PATH"

# Create directory if it doesn't exist (safety check)
mkdir -p $(dirname "$CONFIG_PATH")

# Write config.js
cat <<EOF > "$CONFIG_PATH"
window.__ENV = {
  NEXT_PUBLIC_WS_URL: "${NEXT_PUBLIC_WS_URL:-ws://localhost:8000}",
  NEXT_PUBLIC_BASE_URL: "${NEXT_PUBLIC_BASE_URL:-http://localhost:3000}"
};
EOF

echo "Config generated:"
cat "$CONFIG_PATH"

# Execute the passed command
exec "$@"
