"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";

import { useRouter } from "next/navigation";
import { supabase } from "../../../../../utils/supabase/Client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const emailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const passwordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return alert(error.message);
    } else {
      router.push(`/`);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        이메일:
        <input
          type="text"
          value={email}
          onChange={emailChange}
          className="border border-black "
        />
        <br />
        비밀번호:
        <input
          type="text"
          value={password}
          onChange={passwordChange}
          className=" border border-black "
        />
        <br />
        <button className="border border-black">회원가입</button>
      </form>
    </div>
  );
};

export default LoginPage;
