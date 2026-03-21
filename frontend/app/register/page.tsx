"use client";

import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");

  return (
    <>
      <div className="w-100 h-200">
        <form action="" method="post">
          <input
            type="text"
            placeholder="Name"
            value={name}
            className="w-100 p-2 text-black-700 border-opacity-100 border-red-50"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Tel Number"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}
