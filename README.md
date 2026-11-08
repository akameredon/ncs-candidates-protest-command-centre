# NCS Candidates Protest Command Centre

Mobile-first PWA for independent campaign information and peaceful participation guidance.

## Public experience
- Campaign overview, demands, media briefing and peaceful participation guidance.
- Organiser-published announcements and route landmarks.
- Optional map links for landmarks only after organisers enter and verify coordinates.
- PWA installability and basic offline shell.

## Organiser studio
Open `/admin`. Approved organisers sign in with Supabase Auth. Access is granted only to user IDs explicitly inserted into `public.organiser_admins`; there is no public admin signup or self-elevation.

### Configure
1. Set Vercel environment variables:
   - `VITE_SUPABASE_URL=https://zzwcokvabqaduzirulhg.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = the project's publishable key from Supabase API settings.
2. Create the organiser account in Supabase Authentication (invite/create the user).
3. Copy that user's UUID and run this owner-only SQL in Supabase SQL Editor:
   ```sql
   insert into public.organiser_admins (user_id, display_name)
   values ('AUTH_USER_UUID', 'Campaign organiser');
   ```
4. Redeploy after adding environment variables.

## Database and security
Migration: `supabase/migrations/202611080001_campaign_content_and_admin_security.sql`.
- RLS is enabled on all campaign tables.
- Public users can read only published announcements, published route landmarks, published media metadata and the public campaign settings.
- Authenticated organisers listed in `organiser_admins` can manage campaign content.
- Storage writes are restricted to approved organisers. Public storage reads require matching published media metadata.
- No service-role key is used in the browser.
- Uploaded files start as drafts; archive instead of destructive deletion.

## Important
- Exact route coordinates are intentionally not fabricated. Enter coordinates only after organisers verify the precise public landmark and stopping point.
- The route is an organiser-submitted public itinerary, not live crowd-density, security, or tactical routing.
- Confirm access and safety arrangements with organisers. Do not enter restricted premises or obstruct roads, entrances or emergency access.
- This is an independent candidate information platform, not an official NCS or government website.
