# DOC-FULL-NR Smart Worksheet — Final Firebase Hosting Edition

This is the final deployment-oriented edition for Firebase project:

`doc-full-nr`

## Existing Firestore data is preserved

The `subjects` collection already contains the semester subjects. This edition
does **not** seed subjects automatically during setup or deployment.

`firebase deploy` for Hosting, Firestore Rules, and indexes does not delete
existing Firestore documents.

## Live website

After running:

`00_FINAL_SETUP_AND_DEPLOY.bat`

the production website is:

`https://doc-full-nr.web.app/login`

Firebase Hosting is used for the live React/Vite SPA. `firebase.json` rewrites
all application routes to `dist/index.html`, so direct routes such as `/login`
and `/admin` work correctly.

## Admin

- Email: `pisite.2543nac@gmail.com`
- Firestore Login ID: `pisit2000`
- Password is managed only by Firebase Authentication

## Included

- React + Vite
- Firebase Authentication
- Cloud Firestore
- Firestore Security Rules
- Firestore indexes
- Admin dashboard
- System settings
- Users view
- Existing subjects view / CRUD
- Classrooms CRUD
- Worksheets Draft / Publish / Close
- Firebase Hosting deployment
- local development and production preview scripts
- clean GitHub source push helper

## Deployment

First production deployment:

`00_FINAL_SETUP_AND_DEPLOY.bat`

Website only:

`02_DEPLOY_WEBSITE_ONLY.bat`

Rules/indexes only:

`03_DEPLOY_RULES_ONLY.bat`

Production build test:

`04_TEST_PRODUCTION_BUILD.bat`

## GitHub

GitHub is optional for hosting. Firebase Hosting serves the live application.

Recommended clean repository:

`doc-full-nr-smart-worksheet`

Then run:

`06_GITHUB_PUSH_CLEAN_SOURCE.bat`

`.gitignore` excludes environment files, build output, dependencies, and
service-account/private-key material.


---

## GitHub repository

Source repository:

`https://github.com/pisite2543nac-netizen/doc-full-nr-smart-worksheet.git`

The production website is **not served by GitHub Pages**. The live application is:

`https://doc-full-nr.web.app/login`

Use `00_PUSH_TO_GITHUB.bat` for the first push and `01_UPDATE_GITHUB.bat` for later source updates.
