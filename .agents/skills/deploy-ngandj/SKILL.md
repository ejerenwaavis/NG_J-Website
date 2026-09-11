---
name: deploy-ngandj
description: Step-by-step deployment workflow for NG & J Swift Haulage & Logistics, including pre-flight checks, git push, and Namecheap remote restart via ssh ngandj.
---

# Deploy NG & J Swift

Use this skill whenever you need to deploy the NG & J Swift Haulage & Logistics project to production.

## Deployment Workflow

Follow these exact steps in order when the user asks you to deploy or run the build process:

1. **Pre-flight Safety Check**:
   - Run backend syntax check: `node --check server.js` to ensure the server will not crash on boot.
   - Run syntax checks across route and model files:
     `Get-ChildItem -Path "routes", "models", "config" -Filter "*.js" -Recurse | ForEach-Object { node --check $_.FullName }`
   - **CRITICAL**: If any check fails, HALT the deployment immediately. Do not push. Fix the errors before proceeding.
2. **Commit & Push**:
   - Commit the latest changes to Git.
   - Run `git push origin main`.
3. **Deploy to Namecheap**:
   - Run SSH command to pull and restart the app on the remote server via configured `ngandj` SSH alias:
     `ssh -o BatchMode=yes ngandj "source /home/ngankmnx/nodevenv/website/20/bin/activate && cd /home/ngankmnx/website && PREV_REV=$(git rev-parse HEAD) && git pull origin main && NEW_REV=$(git rev-parse HEAD) && CHANGED=$(git diff --name-only $PREV_REV $NEW_REV | grep package) && if [ -n \"$CHANGED\" ]; then echo \"Dependencies changed, running npm ci...\"; npm ci --omit=dev; fi && touch tmp/restart.txt"`
4. **Verify**:
   - Verify live endpoint responds: `curl.exe -I -s https://ngandjswift.org`
   - Confirm to the user that the app has been safely checked, pushed, pulled, and restarted remotely on Namecheap.
