"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/Client";
import Image from "next/image";
import Link from "next/link";
type Product = {
  description: string | null;
  id: string;
  image_url: string;
  name: string;
  price: number;
};

export const Main = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const getSupabase = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) {
        setProducts(data);
      }
    };
    getSupabase();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <Link href={`/detail/${product.id}`}>
            <Image
              src={product.image_url}
              width={200}
              height={200}
              alt=""
            ></Image>
            <p> {product.name}</p>
            <p> {product.price}</p>
            <p> {product.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};
