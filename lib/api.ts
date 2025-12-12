//api.ts
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const api = {
  async post(path: string, body: any) {
    const url = `${process.env.NEXT_PUBLIC_API_URI}${path}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    return { ok: res.ok, status: res.status, data };
  },

  async get(path: string) {
    const url = `${process.env.NEXT_PUBLIC_API_URI}${path}`;
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));

    return { ok: res.ok, status: res.status, data };
  },

  // 👇👇👇 Asegúrate de que ESTO esté agregado
  async registrarUsuario(payload: any) {
     return api.post("/auth/register", payload);
  },
};


