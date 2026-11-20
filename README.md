# File_Uploader
building a stripped down version of Google Drive (or any other personal storage service).

# File Uploader

A personal file storage web application inspired by Google Drive, built with Node.js, Express, EJS, PostgreSQL, Prisma, and Passport.js.

## Features

- **Authentication & Sessions**: User sign-up, login, and logout using `passport-local`, `bcrypt`, and `express-session` backed by PostgreSQL via `@quixo3/prisma-session-store`.
- **Folder Management**: Create folders, view folder contents, and delete folders.
- **File Uploads & Validation**: Upload files via `multer` with file-size limits and MIME-type validation, view file metadata/details, download files, and delete files.
- **Public Folder Sharing (Extra Credit)**: Generate shareable links with a configurable expiration duration (e.g., 1, 7, or 30 days) so unauthenticated visitors can view and download files in a shared folder before it expires.
- **Dashboard UI**: Server-rendered EJS views styled with custom CSS (`public/css/style.css`).

## Tech Stack

- **Runtime & Framework**: Node.js, Express
- **Database & ORM**: PostgreSQL, Prisma (`@prisma/client`, `@prisma/adapter-pg`)
- **Templating & Styling**: EJS, CSS
- **Auth & Security**: Passport.js (`passport-local`), `express-session`, `bcrypt`, `express-validator`
- **File Handling**: Multer

## Project Structure

- `app.js` — Express app setup, session/Passport middleware, routes, and error handlers
- `config/passport.js` — Passport local authentication strategy and session serialization
- `db/prisma.js` — Prisma client setup with PostgreSQL adapter
- `prisma/schema.prisma` — Database models (`User`, `Folder`, `File`, `Session`)
- `routes/` — Route definitions (`indexRouter.js`, `authRouter.js`, `folderRouter.js`, `fileRouter.js`, `shareRouter.js`)
- `controllers/` — Request handlers for auth, folders, and files
- `middleware/uploadMiddleware.js` — Multer storage, file-type filter, and size limit configuration
- `views/` — EJS templates and partials (`index.ejs`, `sign-up.ejs`, `log-in.ejs`, `folder-details.ejs`, `file-details.ejs`, `shared-folder.ejs`, `404.ejs`, `partials/`)
- `public/` — Static assets (`css/style.css`, `js/`)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
2.install the core packages used by this project manually:
   ```bash
   npm install express express-session pg passport passport-local ejs express-validator dotenv bcrypt multer prisma @prisma/client @prisma/adapter-pg @quixo3/prisma-session-store

3. These packages provide:

- `express` — Web server and routing.
- `express-session` — Session management.
- `pg` — PostgreSQL database connection.
- `passport` — Authentication middleware.
- `passport-local` — Username and password authentication.
- `ejs` — Server-side HTML templates.
- `express-validator` — Form validation.
- `dotenv` — Loads environment variables from `.env`.
- `bcrypt` — Password hashing.
Configure .env with DATABASE_URL and SESSION_SECRET.

Run Prisma migrations and generate the client:

npx prisma migrate dev
npx prisma generate
Start the development server:

npm run dev or node app.js
