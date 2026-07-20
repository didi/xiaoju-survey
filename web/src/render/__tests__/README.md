# C 端单测（SUR-29 / answer-time-limit）

QA / 本地开发自跑：

```bash
cd web
npm i -D vitest@^1 @vue/test-utils@^2 jsdom@^24
cat > vitest.config.ts <<'EOF'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@render': fileURLToPath(new URL('./src/render', import.meta.url))
    }
  },
  test: { environment: 'jsdom', include: ['src/**/__tests__/*.spec.ts'] }
})
EOF
npx vitest run
```

预期：3 个 spec 文件 / 32 个用例全部通过。

| Spec | 用例 | 覆盖 |
|------|------|------|
| `answerTimeStore.spec.ts` | 12 | T-FE-R-01 / FR-036 / C-009 |
| `AnswerTimeLimitDialog.spec.ts` | 9 | T-FE-R-02 / CL-012 / CL-015 |
| `CountdownHeader.spec.ts` | 11 | T-FE-R-03 / CL-013 / visibilitychange 校准 |

> `vitest.config.ts` 不入仓避免污染 `tsc` 扫描（vitest 非生产依赖）；按上述命令一次性生成即可。
