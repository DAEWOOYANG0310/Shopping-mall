"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";

import { useRouter } from "next/navigation";
import { supabase } from "../../../../utils/supabase/Client";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordconfirm] = useState("");
  const router = useRouter();

  const emailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const passwordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const passwordconfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordconfirm(e.target.value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return alert(error.message);
    } else {
      router.push(`/auth/signup/login`);
      return alert("회원가입 완료");
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
        비밀번호확인:
        <input
          type="text"
          value={passwordconfirm}
          onChange={passwordconfirmChange}
          className="border border-black"
        />
        <br />
        <button className="border border-black">회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;
