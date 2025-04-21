import { redirect } from "react-router-dom";

export const handleGoogleCallback = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/google/",
        {
          method: "POST",
          body: JSON.stringify({ code }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to exchange code");
      }

      const jwtData = await response.json();

      // Store tokens in localStorage or context
      localStorage.setItem("access", jwtData.access);
      localStorage.setItem("refresh", jwtData.refresh);

      return redirect("/");
    } catch (error) {
      console.error("Error exchanging code:", error);
      return redirect("/login?error=oauth");
    }
  }

  return redirect("/login?error=missing_code");
};
