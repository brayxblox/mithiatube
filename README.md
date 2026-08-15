# MithiaTube (YouView Style)

HTML frontend + Supabase backend.

## Setup

1. Put your logo as `assets/logo.png`
2. Run this SQL in Supabase SQL Editor (policies for write operations):

```sql
create policy "public_insert_video" on video for insert to public with check (true);
create policy "public_update_video" on video for update to public using (true) with check (true);
create policy "public_delete_video" on video for delete to public using (true);

create policy "public_insert_profiles" on profiles for insert to public with check (true);
create policy "public_update_profiles" on profiles for update to public using (true) with check (true);
create policy "public_delete_profiles" on profiles for delete to public using (true);
```

3. Open `index.html` or serve with:
```bash
python -m http.server 8080
```

## Default user
- Username: **Tomodacho**
- Avatar: already set
- Login with username only (no real password yet)

## Pages
- index.html – Home / Featured
- videos.html – Video list + search
- watch.html?v=ID – Player + comments
- upload.html – Upload (login required)
- login.html / signup.html
- settings.html – Change name, avatar, delete channel
- channel.html?u=username
- channels.html
