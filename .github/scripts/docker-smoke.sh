#!/usr/bin/env bash
# Use only a locally built image and disposable synthetic data. Never deploy it.
set -euo pipefail

image="${1:?Pass the locally built image tag}"
suffix="${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}-$$"
network="survey-smoke-$suffix"
mongo="survey-mongo-$suffix"
app="survey-app-$suffix"

cleanup() {
  status=$?
  if [ "$status" -ne 0 ]; then
    docker logs "$app" 2>&1 || true
    docker logs "$mongo" 2>&1 || true
  fi
  docker rm --force --volumes "$app" "$mongo" >/dev/null 2>&1 || true
  docker network rm "$network" >/dev/null 2>&1 || true
  exit "$status"
}
trap cleanup EXIT

# No published ports, existing volumes, registry login, image push, or deployment.
docker run --rm --network none "$image" sh -ec '
  test "$(node --version)" = "v18.20.8"
  test "$(npm --version)" = "10.9.9"
  cd /xiaoju-survey/server
  test "$(npm config get engine-strict)" = "true"
  nginx -t
  node --version
  npm --version
'
docker pull mongo:4.4.29
docker network create --internal "$network"
docker run --detach --name "$mongo" --network "$network" --network-alias mongo \
  mongo:4.4.29
for attempt in $(seq 1 60); do
  if docker exec "$mongo" mongo --quiet --eval \
    'quit(db.adminCommand({ping: 1}).ok === 1 ? 0 : 1)' >/dev/null 2>&1; then
    break
  fi
  if [ "$attempt" -eq 60 ]; then
    echo 'MongoDB did not become ready' >&2
    exit 1
  fi
  sleep 2
done

docker run --detach --name "$app" --network "$network" \
  --env PORT=3000 \
  --env XIAOJU_SURVEY_MONGO_URL=mongodb://mongo:27017 \
  --env XIAOJU_SURVEY_MONGO_DB_NAME=survey_ci \
  --env XIAOJU_SURVEY_JWT_SECRET=synthetic-ci-only-not-a-production-secret \
  --env XIAOJU_SURVEY_JWT_EXPIRES_IN=1h \
  --env XIAOJU_SURVEY_RESPONSE_AES_ENCRYPT_SECRET_KEY=synthetic-ci-only \
  --env XIAOJU_SURVEY_LOGGER_FILENAME=/tmp/survey-ci.log \
  "$image"
for attempt in $(seq 1 60); do
  if docker exec "$app" node -e '
    fetch("http://127.0.0.1:8080/api/auth/verifyToken")
      .then(async r => { if (!r.ok) throw Error(r.status); return r.json(); })
      .then(body => { if (body.code !== 200 || body.data !== false) throw Error("Unexpected API response"); })
      .catch(() => process.exit(1));
  ' >/dev/null 2>&1; then
    break
  fi
  if [ "$(docker inspect --format '{{.State.Running}}' "$app")" != true ] || [ "$attempt" -eq 60 ]; then
    echo 'Application did not become ready' >&2
    exit 1
  fi
  sleep 2
done

docker exec -i "$app" node <<'JS'
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:8080';
(async () => {
  for (const path of ['/management/', '/render/smoke']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    const script = html.match(/<script\b[^>]*\bsrc="([^"]+)"/i);
    assert.ok(script, `Missing built script in ${path}`);
    const url = new URL(script[1], base + path);
    assert.equal(url.origin, base);
    const asset = await fetch(url);
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get('content-type'), /javascript/);
    assert.ok((await asset.text()).length > 0);
    console.log(`PASS static HTML and JavaScript: ${path}`);
  }
  const auth = await fetch(base + '/api/auth/verifyToken');
  assert.equal(auth.status, 200);
  assert.deepEqual(await auth.json(), { code: 200, data: false });
  const response = await fetch(base + '/api/auth/captcha', { method: 'POST' });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.code, 200);
  assert.match(body.data.id, /^[0-9a-f]{24}$/i);
  assert.match(body.data.img, /<svg\b/);
  console.log('PASS API response and captcha creation');
})().catch(error => { console.error(error); process.exit(1); });
JS
docker exec "$mongo" mongo --quiet survey_ci --eval \
  'assert.eq(1, db.captcha.countDocuments({})); print("PASS isolated MongoDB write");'
echo 'PASS Node 18.20.8 / npm 10.9.9 Docker startup and HTTP smoke (linux/amd64)'
