# allinonehomeinspections-v2 — deploy runbook (staging only, NO DNS)

Run from ~/Sites/clients/allinonehomeinspections-v2 — one command at a time (Tab 3):

1.  git init -b main && git add -A && git commit -m "v2 duplication from live Elementor extraction"
2.  gh repo create moximarketing/allinonehomeinspections-v2 --private --source=. --push
3.  vercel link   (scope: Moxi Marketing team → create new project "allinonehomeinspections-v2")
4.  vercel --prod
5.  Verify the preview URL, then Claude runs the post-deploy audit.

NOT yet: env vars (Resend/Sheets keys are cutover-day), DNS, GSC.
