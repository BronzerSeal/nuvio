"use client";
import { useCompanyMemberships } from "@/entity/company";
import { Button } from "@/shared/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer/drawer";
import { SidebarMenuButton, SidebarMenuItem } from "@/shared/ui/sidebar";
import { User, X } from "lucide-react";
import { useParams } from "next/navigation";
import { UserCard } from "./user-card";
import React from "react";
import AddUserFrom from "./add-user-form";
import SearchResults from "./search-results";

export function MemberDrawer() {
  const { companyId } = useParams() as { companyId: string | undefined };
  const { data: memberships } = useCompanyMemberships(companyId!, !!companyId);
  const [showForm, setShowForm] = React.useState(false);
  const [query, setQuery] = React.useState("");
  return (
    <SidebarMenuItem>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <SidebarMenuButton asChild className="w-full" tooltip="Members">
            <div className="flex w-full items-center">
              <User />
              <span>Members</span>
            </div>
          </SidebarMenuButton>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Members</DrawerTitle>
                <DrawerDescription>All company members</DrawerDescription>
              </div>

              <Button onClick={() => setShowForm(true)}>Add member</Button>
            </div>
          </DrawerHeader>
          <div className="flex flex-col gap-1">
            {showForm && (
              <AddUserFrom
                onClose={() => {
                  setShowForm(false);
                  setQuery("");
                }}
                onSearch={(value) => setQuery(value)}
              />
            )}

            {query ? (
              <SearchResults query={query} />
            ) : (
              memberships?.map((member) => (
                <UserCard key={member.id} user={member.user} />
              ))
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </SidebarMenuItem>
  );
}
