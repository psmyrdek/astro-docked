# Supabase - Local Development

## Prerequisites

1. Run Docker Desktop
2. Run `npm run db:start` to download Docker imagesand initialize the local database

## How to connect using PG Admin

1. Open PG Admin on your computer
2. Right-click on "Servers" in the left sidebar and select "Create" > "Server..."
3. In the "General" tab:
   - Name: Enter any name (e.g., "Supabase Local")
4. In the "Connection" tab:
   - Host name/address: 127.0.0.1
   - Port: 54322
   - Maintenance database: postgres
   - Username: postgres
   - Password: postgres
5. Click "Save" to connect
6. You should now see your local Supabase database in the servers list
7. Expand the server to view and manage your database objects
