const BASE_URL = "http://localhost:3000";

async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed.");
    }

    if (data?.status && data.status !== "OK") {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function signUpUser(name, email, password) {
  return fetchWithTimeout(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });
}

export async function signInUser(email, password) {
  return fetchWithTimeout(`${BASE_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });
}

export async function updateUser(token, name, password) {
  return fetchWithTimeout(`${BASE_URL}/users/update`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      name,
      password
    })
  });
}

export async function getCart(token) {
  return fetchWithTimeout(`${BASE_URL}/cart`, {
    method: "GET",
    headers: authHeaders(token)
  });
}

export async function updateCart(token, items) {
  return fetchWithTimeout(`${BASE_URL}/cart`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({
      items
    })
  });
}

export async function getOrders(token) {
  return fetchWithTimeout(`${BASE_URL}/orders/all`, {
    method: "GET",
    headers: authHeaders(token)
  });
}

export async function createNewOrder(token, items) {
  return fetchWithTimeout(`${BASE_URL}/orders/neworder`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      items
    })
  });
}

export async function updateOrderStatus(token, orderID, isPaid, isDelivered) {
  return fetchWithTimeout(`${BASE_URL}/orders/updateorder`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      orderID,
      isPaid,
      isDelivered
    })
  });
}