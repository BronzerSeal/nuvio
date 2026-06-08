import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

const RegisterPage = () => {
  return (
    <>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="reg-email">email</Label>
          <Input
            required
            id="reg-email"
            name="email"
            placeholder="some@gmail.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reg-name">name</Label>
          <Input required id="reg-name" placeholder="Bob" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tabs-demo-new">password</Label>
          <Input
            required
            id="tabs-demo-new"
            type="password"
            placeholder="123"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tabs-demo-new">confirm password</Label>
          <Input
            required
            id="tabs-demo-new"
            type="password"
            placeholder="123"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Create</Button>
      </CardFooter>
    </>
  );
};

export default RegisterPage;
