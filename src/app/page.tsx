import { supabase } from "@/utils/supabase/Client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const page = async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    notFound();
  }
  console.log(data);
  return (
    <div>
      <main>
        <div className="flex gap-x-12">
          {data.map((item) => {
            return (
              <Link
                href={`/products/${item.id}`}
                key={item.id}
                className="border w-48 h-auto"
              >
                <div className="w-full h-48 relative">
                  <Image src={item.image_url} alt={item.name} fill />
                </div>
                <div className="flex flex-col gap-y-1 text-sm font-semibold p-2">
                  <div>상품명: {item.name}</div>
                  <div>가격: {item.price}원</div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default page;
