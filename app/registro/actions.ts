"use server";

import { api } from "@/lib/api";

export async function registerAction(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await api.post("/auth/register", {
    name,
    email,
    password
  });

  return response;
}
