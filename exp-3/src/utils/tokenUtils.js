import { jwtDecode } from "jwt-decode";

export function createToken(username, role) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const currentTime = Math.floor(
    Date.now() / 1000
  );

  const payload = {
    userId: Date.now().toString(),
    username: username,
    role: role,
    iat: currentTime,

    // Token expires after 5 minutes
    exp: currentTime + 300,
  };

  const encodedHeader = btoa(
    JSON.stringify(header)
  );

  const encodedPayload = btoa(
    JSON.stringify(payload)
  );

  // Simulated signature for educational purposes
  const simulatedSignature = btoa(
    "experiment-3-secure-signature"
  );

  return `${encodedHeader}.${encodedPayload}.${simulatedSignature}`;
}

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token) {
  try {
    const decodedToken = jwtDecode(token);

    const currentTime = Math.floor(
      Date.now() / 1000
    );

    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
}