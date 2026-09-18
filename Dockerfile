FROM nginx:alpine

# Create writable temporary directories.
# OpenShift may run the container with an arbitrary non-root UID,
# so these directories must be writable by that UID.
RUN mkdir -p /tmp/nginx/client_temp \
             /tmp/nginx/proxy_temp \
             /tmp/nginx/fastcgi_temp \
             /tmp/nginx/uwsgi_temp \
             /tmp/nginx/scgi_temp && \
    chmod -R 777 /tmp/nginx

# Replace the default Nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf && \
    cat > /etc/nginx/nginx.conf <<'EOF'
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /dev/stdout;
    error_log /dev/stderr;

    sendfile on;

    # Writable temporary locations for OpenShift
    client_body_temp_path /tmp/nginx/client_temp;
    proxy_temp_path       /tmp/nginx/proxy_temp;
    fastcgi_temp_path     /tmp/nginx/fastcgi_temp;
    uwsgi_temp_path       /tmp/nginx/uwsgi_temp;
    scgi_temp_path        /tmp/nginx/scgi_temp;

    server {
        listen 8080;
        server_name _;

        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ =404;
        }
    }
}
EOF

# Create the test page
RUN cat > /usr/share/nginx/html/index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docker Test Page</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            background: #f4f4f5;
            color: #18181b;
        }

        .card {
            padding: 40px;
            text-align: center;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        h1 {
            margin-top: 0;
        }

        .status {
            color: #16a34a;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Docker Test Page</h1>
        <p class="status">✓ Container is running</p>
        <p>Hello from Nginx!</p>
    </div>
</body>
</html>
EOF

# Nginx listens on an unprivileged port
EXPOSE 8080

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]