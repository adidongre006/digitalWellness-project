# integration tests

Reserved for tests that exercise the Next.js app against a real (not
mocked) Neon database and a real FastAPI backend — e.g. "seed the database,
then confirm the comparison page server-renders exactly ten rows." None are
implemented yet; see docs/TESTING_AND_QA.md for current test coverage
(unit tests in tests/unit/, end-to-end tests in tests/e2e/,
backend tests in backend/tests/).
