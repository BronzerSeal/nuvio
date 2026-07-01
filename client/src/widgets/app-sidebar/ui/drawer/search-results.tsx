"use client";
import { useFindUsers } from "@/entity/user";
import { UserAddCard } from "./user-add-card";
import { useParams } from "next/navigation";

const SearchResults = ({ query }: { query: string }) => {
  const { companyId } = useParams() as { companyId: string | undefined };
  const { data: users } = useFindUsers(query, companyId!, !!companyId);

  if (!users || users.length == 0) return <p className="px-2">no users</p>;
  return users?.map((user) => <UserAddCard key={user.id} user={user} />);
};

export default SearchResults;
