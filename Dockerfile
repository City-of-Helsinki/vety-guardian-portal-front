FROM registry.access.redhat.com/ubi9/nodejs-24 AS build

WORKDIR /opt/app-root/src

COPY --chown=1001:0 package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY --chown=1001:0 . .
RUN npm run build

FROM helsinki.azurecr.io/ubi9/nginx-126

COPY docker/nginx-default.conf "${NGINX_DEFAULT_CONF_PATH}/spa.conf"
COPY --from=build --chown=1001:0 /opt/app-root/src/dist /opt/app-root/src

# Runtime configuration: env-config.sh regenerates env-config.js from the
# container's environment at startup (see src/config.ts). The script lives
# outside the web root so nginx doesn't serve it.
COPY docker/nginx-start/env-config.sh "${NGINX_CONTAINER_SCRIPTS_PATH}/nginx-start/"
RUN chmod g+w /opt/app-root/src/env-config.js

EXPOSE 8080

CMD ["/usr/libexec/s2i/run"]
