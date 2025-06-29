const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/api/users";
export async function getAllUsers(token) {
  const res = await fetch(`${API_URL}/list`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
  return res.json();
}

export async function cambiarRolUsuario(userId, newRole, token) {
  const res = await fetch(`${API_URL}/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role: newRole }),
  });
  if (!res.ok) throw new Error("No se pudo cambiar el rol");
  return res.text();
}