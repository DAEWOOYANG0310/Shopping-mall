"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/Client";
import { useRouter } from "next/navigation";

// Review 타입 정의
type Review = {
  id: string;
  content: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // 필요한 다른 필드들도 여기에 추가하세요
};

export const Content: React.FC = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("로그인하세요");
        router.push(`/auth/signup/login`);
        return;
      }

      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching reviews:", error);
        return;
      }

      setReviews(reviews as Review[]);
      console.log(reviews);
    };

    fetchData();
  }, [router]);

  if (!reviews) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {reviews.map((review: Review) => (
        <div key={review.id}>{review.content}</div>
      ))}
    </div>
  );
};

export default Content;
