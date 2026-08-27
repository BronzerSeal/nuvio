import { useQuery } from "@tanstack/react-query";
import { getServerStatus } from "../model/get-server-status";

export const useServerStatus = () => {
  return useQuery({
    queryKey: ["server-status"],
    queryFn: () => getServerStatus(),
  });
};
