/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

const PROXY_URL = "https://bvltra-proxy.onrender.com/api/fatsecret-token";

export const getFatSecretToken = async () => {
  try {
    const response = await fetch(PROXY_URL);
    if (!response.ok) throw new Error("Failed to fetch token from proxy");

    const data = await response.json();
    // FatSecret returns an object with { access_token, expires_in, token_type }
    return data.access_token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// To do: Understand proxy server