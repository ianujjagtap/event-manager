# Mini Event Manager

## How to Run

Step 1 : 

```bash 
# Clone the repository
git clone <repository-url>
cd <event-manager>
```
Step 2 :
```bash
# Install dependencies at root level
pnpm install
```
Step 3 : 
```bash
# Install dependencies for web app specifically  
pnpm install --filter=web
```

Step 4 : 
``` bash
# Start development server for web app only
pnpm dev --filter=web
```

## Path of the Page

Navigate to `/events` page at `http://localhost:3000/events`

## Features
- Client-side only (no database or API routes)
- Events persist in localStorage
- Form validation with React Hook Form + Zod
- Search functionality filters events by name
- Dark theme with responsive design

### Deployment 
Verce : https://event-manager-web-eight.vercel.app/
## Screenshot
<img width="1255" height="877" alt="Screenshot 2025-08-20 232016" src="https://github.com/user-attachments/assets/1ddc1e08-6ccd-40a3-bc7a-69a794fd6add" />


