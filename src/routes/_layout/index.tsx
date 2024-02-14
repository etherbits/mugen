import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl">Mugen</h1>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/43289097?s=160&v=4" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <ThemeToggle />
        </div>
      </div>
      <Card className="flex gap-6 items-center w-fit px-6 py-4">
        <Checkbox />
        <AlertDialog>
          <AlertDialogTrigger>
            <Button>Click me</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
