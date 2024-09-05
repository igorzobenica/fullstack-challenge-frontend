import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { getProfile, saveProfile } from "@/services/profileApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(35, {
      message: "Name can't be more than 35 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Email is invalid"),
});

const ProfilePage: React.FC<{ user: User }> = ({ user }) => {
  const [fetching, setFetching] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.displayName || "",
      email: user.email || "",
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      setFetching(true);
      try {
        const token = await user.getIdToken();
        const data = await getProfile(token);
        form.setValue("name", data.name);
        form.setValue("email", data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Failed to fetch profile data.",
          description:
            error instanceof Error
              ? error.message
              : "Please try again later, and if issue still persist please contact the support",
        });
      } finally {
        setFetching(false);
      }
    };

    if (user.phoneNumber) {
      fetchProfileData();
    }
  }, [user, form, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      await saveProfile(
        token,
        values.name,
        values.email,
        user.phoneNumber || ""
      );
      toast({
        title: "Name and email are successfully saved!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to save profile",
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              {user?.phoneNumber
                ? `User: ${user?.phoneNumber}`
                : "Update Your Profile"}
            </CardTitle>
            <CardDescription>You can update your name and email address below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          disabled={fetching}
                          {...field}
                        />
                      </FormControl>
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
                        <Input
                          placeholder="Enter your email"
                          disabled={fetching}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" loading={loading} disabled={fetching}>
                  Save
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;
