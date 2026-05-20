# Project Rules

Read this file before editing anything in this project.

All frontend code must follow these rules strictly.

<!-- BEGIN:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This project uses the App Router under src/app.
Keep className as a prop in reusable components when it makes sense.
Always use <><Container>...</Container></> at the top level when writing JSX in components if wrapping is needed.
Use next/image and next/link instead of plain <img> or plain <a> for internal navigation.
If any custom numbers or anything custom is added in Tailwind or CSS utilities, add it to tailwind.config.js.
Auth is currently modal-based from src/components/LoginPopover.js, not full login/signup route pages.
Shared layout parts live in src/layout, reusable UI in src/components, and Shadcn-based primitives in src/components/ui.
Always use Shadcn if anything is good from there, but ask first before introducing a new Shadcn piece.
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in node_modules/next/dist/docs/ before writing any code. Heed deprecation notices.
any popups or toggles should have a better transition.
<!-- END:nextjs-agent-rules -->

<!-- END:nextjs-agent-rules -->
