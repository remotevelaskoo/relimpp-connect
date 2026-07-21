# AGENTS.md

## Cursor Cloud specific instructions

### Repository state (read this first)

Relimpp Connect is currently a **documentation-only repository** in the discovery/architecture phase. There is **no application code, no dependencies, no build system, no tests, and no lint configuration** committed yet.

- `backend/`, `frontend/`, `database/`, and `infrastructure/` contain only placeholder `README.md` files. Per those READMEs (and the root `README.md`), the NestJS backend, Next.js frontend, and PostgreSQL schema are only created **after** the corresponding architecture / design-system ADRs are approved. Do not scaffold these projects unless a task explicitly asks for it.
- The stack listed in `README.md` (Next.js, NestJS, PostgreSQL, S3-compatible storage, Docker) is **proposed**, not yet implemented.
- The real "product" today is the documentation set under `docs/` plus the root Markdown files.

### What "running" / "testing" means today

- There is nothing to `npm install`, build, or serve as an application. The update script is intentionally a near no-op and only installs dependencies once real manifests (e.g. `backend/package.json`, `frontend/package.json`) exist.
- To sanity-check the docs product, you can validate that internal relative Markdown links resolve, and optionally render the Markdown to a browsable HTML preview (e.g. `pip install --user markdown` + `python3 -m http.server`). These renderer tools are one-off and should NOT be added to the update script.
- Runtimes available on the VM: Node 22 and Python 3.12. Docker is not installed.

### When real code lands

Once `backend/` / `frontend/` gain `package.json` files, update the update script to run the matching package manager (check for the lockfile: `package-lock.json`→npm, `pnpm-lock.yaml`→pnpm, `yarn.lock`→yarn) and document the real lint/test/build/run commands here.
