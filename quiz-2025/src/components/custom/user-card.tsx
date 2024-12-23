import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export const UserForm = z.object({
  name: z.string().min(3),
});

export const UserCard = ({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof UserForm>) => void;
}) => {
  const form = useForm<z.infer<typeof UserForm>>({
    resolver: zodResolver(UserForm),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Card className="w-full bg-black/50">
      <CardContent className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-2">Start</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
