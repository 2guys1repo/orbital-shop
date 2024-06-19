"use client"

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// main search bar on the nav
export default function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const params = new URLSearchParams({
      query: query
    })
    // directs the user to Search page to view their queried results
    if (query === "") params.delete("query")
    router.push(`/search/?${params}`)
  }
  return (
    <form
      className="relative w-1/2 mr-auto flex gap-4 items-center min-w-fit"
      onSubmit={e => handleSubmit(e)}
    >
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-8 focus-visible:ring-transparent rounded-xl border-gray-800 border-2"
        placeholder="Search for anything..."
        onChange={e => setQuery(e.target.value)}
        value={query}
      />
      <Button size="sm" type="submit" className="hidden sm:block">Search</Button>
    </form>
  )
};
