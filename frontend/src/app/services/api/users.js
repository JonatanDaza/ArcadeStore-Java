const API_URL = "http://localhost:8085/api/users";

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

export async function getUserById(userId, token) {
  console.log(`Making request to: ${API_URL}/${userId}/show`);
  console.log("With token:", token ? "Token exists" : "No token");
  
  const res = await fetch(`${API_URL}/${userId}/show`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  
  console.log("Response status:", res.status);
  console.log("Response ok:", res.ok);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.log("Error response:", errorText);
    
    if (res.status === 404) {
      return null; // Usuario no encontrado
    }
    if (res.status === 401) {
      throw new Error("401 - Token inválido o expirado");
    }
    if (res.status === 403) {
      throw new Error("403 - Sin permisos para acceder a este usuario");
    }
    throw new Error(`${res.status} - No se pudo cargar el usuario: ${errorText}`);
  }
  
  const data = await res.json();
  console.log("User data parsed:", data);
  return data;
}

export async function updateUser(userId, userData, token) {
  const res = await fetch(`${API_URL}/${userId}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el usuario");
  return res.json();
}

export async function cambiarRolUsuario(userId, token) {
  const res = await fetch(`${API_URL}/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudo cambiar el rol");
  return res.text();
}