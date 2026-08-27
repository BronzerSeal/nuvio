"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import { useFindMe, useUpdateMe } from "@/entity/user";
import React from "react";
import { profileFormSchema, ProfileFormValues } from "../consts/schema";

export function ProfileForm() {
  //BD
  const { data: user } = useFindMe();
  const { mutate: updateUser } = useUpdateMe();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      urls: [],
    },
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  React.useEffect(() => {
    if (!user) return;

    form.reset({
      name: user?.name ?? "",
      email: user.email ?? "",
      bio: user?.bio ?? "",
      urls: user.urls ?? [],
    });
  }, [user, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateUser(data))}
        className="space-y-6 bg-background p-4 rounded-lg"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="a@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl className={cn(index !== 0 && "mt-1.5")}>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div>
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
