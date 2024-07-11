import React from "react";
import { supabase } from "../../../../utils/supabase/Client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Reviews } from "../../../../components/Reviews/Reviews";

const page = async ({ params }: { params: { id: string } }) => {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    notFound();
  }
  return (
    <div>
      <p>{product.name}</p>
      <p>{product.price}</p>
      <p>{product.description}</p>
      <Image
        src={product.image_url}
        width={200}
        height={200}
        alt="product"
      ></Image>
      <div>수량1</div>
      <br />
      <Reviews />
    </div>
  );
};

export default page;
