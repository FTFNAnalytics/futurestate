import library from "../../data/phase-122-verification-playbook-library.json";

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(library, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
