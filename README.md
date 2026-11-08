# NCS Candidates Protest Command Centre

Mobile-first PWA MVP for independent campaign information and peaceful participation guidance.

## Included
- Responsive public information hub
- Organiser-submitted itinerary presented as a reference guide (not live crowd routing)
- Campaign demands and a copyable press statement
- Peaceful participation and privacy guidance
- Web Share support with clipboard fallback
- Installable PWA manifest and service worker for basic offline caching

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Important launch checklist
- Confirm event details, assembly location, exact itinerary, stopping point and dispersal plan with organisers.
- Add only verified public documents, spokesperson contacts and emergency contacts after explicit approval.
- The current build has no admin publishing backend, database, participant registration, personal-data collection or live location tracking.
- The itinerary is organiser-provided and must not be treated as independent confirmation of access, permission or safety.
- This independent platform is not an official NCS or government website.

## Deployment
Import this repository into Vercel. Framework preset: Vite. Build command: `npm run build`; output directory: `dist`.
