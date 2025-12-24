import { authClient } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const onClick = async () => {
    const response = await authClient.signUp.email({
      email: "toheebeji@gmail.com",
      password: "hello123",
      name: "Toheeb Eji",
    });
    console.log(response);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <button onClick={onClick} type="submit">
        Click
      </button>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
}
