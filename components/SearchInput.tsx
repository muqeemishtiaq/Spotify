"use client";

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation"; // 👈 use `next/navigation` in App Router
import React, { useEffect, useState } from "react";
import qs from "query-string";
import Input from "./Input";

const SearchInputClient = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");

  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    const url = qs.stringifyUrl({
      url: "/search",
      query: query,
    });

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      id="search"
      placeholder="What do you want to listen to?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchInputClient;
