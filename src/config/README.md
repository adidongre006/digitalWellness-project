# config

Reserved for app-wide constants that aren't environment variables (e.g. a
future feature-flag map or a nav-link registry shared between the desktop
and mobile nav). Currently, the small amount of configuration this project
needs lives directly next to its one consumer (e.g. NAV_LINKS in
src/components/layout/site-nav.tsx) rather than being abstracted here
prematurely.
