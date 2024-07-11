// app/_components/Header.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabase/Client";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(data);
      setUser(session?.user || null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-2 flex justify-between items-center gap-x-2">
      <Link href="/">Home</Link>
      <div className="flex items-center gap-x-2">
        {user ? (
          <>
            <div>{user.email}</div>
            <button onClick={logout}>로그아웃</button>
            <br />
            <Link href="/myprofile">마이프로필</Link>
          </>
        ) : (
          <>
            <Link href="/auth/signup/login">로그인</Link>
            <Link href="/auth/signup">회원가입</Link>
          </>
        )}
      </div>
    </div>
  );
}
