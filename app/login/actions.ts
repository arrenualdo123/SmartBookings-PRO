"use server";

import { api } from "@/lib/api";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await api.post("/auth/login", {
    email,
    password
  });

  return response;
}
