# hooks

No cross-cutting custom hooks were needed yet — component-local state
(useState/useTransition) covered everything built so far (see
src/components/chatbot/chat-shell.tsx and src/components/admin/dashboard-shell.tsx
for the most stateful examples). Add a hook here if logic needs to be shared
across three or more components.
