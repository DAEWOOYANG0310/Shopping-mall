"use client";

// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import React, { useRef } from "react";
// import { supabase } from "../../utils/supabase/Client";

// const Reviews = () => {
//   const params = useParams();
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const {
//     data: reviews,
//     error,
//     isPending,
//   } = useQuery({
//     queryKey: ["reviews", params.id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("reviews")
//         .select("*")
//         .eq("product_id", params.id);

//       if (error) {
//         throw new Error(error.message);
//       }

//       return data;
//     },
//   });

//   const addMutation = useMutation({
//     mutationFn: async ({ content, email, productId, userId }) => {
//       const { error } = await supabase.from("reviews").insert({
//         content,
//         product_id: productId,
//         email,
//         user_id: userId,
//       });
//     },
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { data, error } = await supabase.auth.getSession();

//     const email = data.session?.user.email;
//     const userId = data.session?.user.id;

//     if (error || !email || !userId) {
//       alert("로그인해주세요");
//       return;
//     }
//     const content = textareaRef.current?.value;

//     if (!content) {
//       alert("내용을 입력하세요");
//       return;
//     }
//     addMutation.mutate({ content, productId: params.id, email, userId });
//   };

//   return (
//     <div>
//       <div className="mt-4 flex flex-col gap-y-4">
//         <h3 className="text-xl font-bold mb-4">후기 작성</h3>
//         <form
//           // onSubmit={handleSubmit}
//           className="flex flex-col gap-4 items-end"
//         >
//           <textarea
//             ref={textareaRef}
//             className="border-2 w-full h-24 resize-none"
//           ></textarea>
//           <button className="bg-blue-500 text-white p-2 rounded-md w-12">
//             작성
//           </button>
//         </form>
//         <div className="border-2 p-4">
//           {reviews?.map((review) => (
//             <div key={review.id} className="flex flex-col gap-y-2">
//               <div>내용: {review.content}</div>
//               <div className="text-right text-neutral-500">
//                 작성자: {review.email}
//               </div>
//               <div className="flex justify-end gap-x-2">
//                 <button className="bg-green-500 text-white p-2 rounded-md">
//                   수정
//                 </button>
//                 <button
//                   // onClick={() => onDelete(review.id, review.email)}
//                   className="bg-red-500 text-white p-2 rounded-md"
//                 >
//                   삭제
//                 </button>
//               </div>
//               <hr />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reviews;

// app/products/[id]/_components/Reviews.tsx

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { supabase } from "../../utils/supabase/Client";

// TODO: api 함수들은 다른 파일로 이동 예정
async function getReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

async function addReview({
  content,
  productId,
  email,
  userId,
}: {
  content: string;
  productId: string;
  email: string;
  userId: string;
}) {
  const { error } = await supabase.from("reviews").insert({
    content,
    product_id: productId,
    email,
    user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function deleteReview(id: string) {
  const { data, error } = await supabase.from("reviews").delete().eq("id", id);
}

export function Reviews() {
  const params = useParams<{ id: string }>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: reviews } = useQuery({
    queryKey: ["reviews", params.id],
    queryFn: () => getReviews(params.id),
  });

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", params.id] });
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", params.id] });
    },
    onError: () => {
      alert("삭제 중 에러가 발생했습니다.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    const email = session?.user.email;
    const userId = session?.user.id;
    if (error || !email || !userId) {
      alert("로그인을 해주세요.");
      return;
    }

    const content = textareaRef.current?.value;

    if (!content) {
      alert("내용을 입력하세요.");
      return;
    }

    addMutation.mutate({ content, productId: params.id, email, userId });
  };

  const onDelete = async (id: string, email: string) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    const currentEmail = session?.user.email;
    const userId = session?.user.id;
    if (error || !email || !userId) {
      alert("로그인을 해주세요.");
      return;
    }

    // review의 이메일과 내 이메일과 일치하는지 확인
    if (currentEmail !== email) {
      alert("작성자가 아니라 삭제할 수 없습니다.");
      return;
    }
    const isConfirmed = confirm("정말로 삭제하시겠습니까?");
    if (!isConfirmed) {
      return;
    }

    deleteMutation.mutate(id);
  };

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <h3 className="text-xl font-bold mb-4">후기 작성</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-end">
        <textarea
          ref={textareaRef}
          className="border-2 w-full h-24 resize-none"
        ></textarea>
        <button className="bg-blue-500 text-white p-2 rounded-md w-12">
          작성
        </button>
      </form>
      <div className="border-2 p-4">
        {reviews?.map((review) => (
          <div key={review.id} className="flex flex-col gap-y-2">
            <div>내용: {review.content}</div>
            <div className="text-right text-neutral-500">
              작성자: {review.email}
            </div>
            <div className="flex justify-end gap-x-2">
              <button className="bg-green-500 text-white p-2 rounded-md">
                수정
              </button>
              <button
                onClick={() => onDelete(review.id, review.email)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                삭제
              </button>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
