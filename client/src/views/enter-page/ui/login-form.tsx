import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

const LoginForm = () => {
  return (
    <>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="tabs-email">Email</Label>
          <Input id="tabs-email" placeholder="some@gmail.com" required />

          <Label htmlFor="tabs-password">Password</Label>
          <Input id="tabs-password" placeholder="123" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Sign In</Button>
      </CardFooter>
    </>
  );
};

export default LoginForm;
