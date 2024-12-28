"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { getAllUsers } from "@/hooks/get-all-users";
import axios from "axios";
import { PasswordInput } from "@/components/customPassword";
import { LoadingSpinner } from "@/components/loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addNewUserIsOpen, setAddNewUserIsOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [addUserButtonLoading, setAddUserButtonLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [previousPageDisabled, setPreviousPageDisabled] = useState(true);
  const [nextPageDisabled, setNextPageDisabled] = useState(false);
  const [paginatedUsers, setPaginatedUsers] = useState<any>({});
  const [suspendUserIsOpen, setSuspendUserIsOpen] = useState(false);
  const [deleteUserIsOpen, setDeleteUserIsOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<any>({});
  const [userToDelete, setUserToDelete] = useState<any>({});
  const [suspendUserButtonLoading, setSuspendUserButtonLoading] =
    useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  const filteredUsers = users.filter(
    (user: any) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addNewUserHandler = async () => {
    setAddUserButtonLoading(true);
    if (
      username === "" ||
      profileName === "" ||
      email === "" ||
      password === ""
    ) {
      return toast.warning("Please fill all user details before proceeding.");
    } else {
      const response = await axios.post("/api/addNewUser", {
        profileName: profileName,
        username: username,
        email: email,
        password: password,
      });

      if (response.status === 500) {
        return toast.error(response.data);
      } else {
        setAddNewUserIsOpen(false);
        setEmail("");
        setPassword("");
        setProfileName("");
        setUsername("");
        setAddUserButtonLoading(false);
        return toast.success("Successfully added new user! 🔥");
      }
    }
  };

  const deleteUserHandler = (authId: string) => {
    axios.post("/api/deleteUser", { authId: authId }).then((responese) => {
      return console.log("delete user");
    });
  };

  const suspendUserHandler = async () => {
    setSuspendUserButtonLoading(true);
    if (date?.from && date.to) {
      const duration = (date.to.getTime() - date.from.getTime()) / 1000;
      const response = await axios.post("/api/suspendUser", {
        authId: userToSuspend.Auth,
        banDuration: `${duration}s`,
      });

      if (response.status === 500) {
        setSuspendUserButtonLoading(false);
        return toast.error(response.data);
      } else {
        setSuspendUserButtonLoading(false);
        setUserToSuspend({});
        setSuspendUserIsOpen(false);
        return toast.success("Successfully suspended user!");
      }
    } else {
      setSuspendUserButtonLoading(false);
      return toast.warning(
        "Please select the duration of suspension before proceeding."
      );
    }
  };

  const handlePageChange = async (action: string) => {
    let pageLimit = Object.keys(paginatedUsers).length;
    console.log(pageLimit, action);
    if (searchTerm === "") {
      if (page === 1) {
        if (page < pageLimit && action === "next") {
          if (page === pageLimit - 1) {
            setNextPageDisabled(true);
          }
          setPage(page + 1);
          setPreviousPageDisabled(false);
          console.log("next triggered");
        } else if (page === pageLimit) {
          setNextPageDisabled(true);
        }
      } else if (page > 1) {
        if (page === pageLimit) {
          setNextPageDisabled(true);
        }
        if (action === "next" && page < pageLimit) {
          if (page === pageLimit - 1) {
            setNextPageDisabled(true);
          }
          console.log("next triggered");
          setPage(page + 1);
        }
        if (action === "previous") {
          setNextPageDisabled(false);
          setPage(page - 1);
          if (page === 2) {
            setPreviousPageDisabled(true);
          }
        }
      }
    } else {
      setPage(1);
      setPreviousPageDisabled(true);
      setNextPageDisabled(true);
    }
  };

  const paginatedUsersProvider = () => {
    return paginatedUsers[page];
  };

  useEffect(() => {
    const setAllUsers = async () => {
      const allUsers = await getAllUsers();
      let paginatedUsers: any = {};
      if (allUsers.length > 20) {
        setNextPageDisabled(false);
        let page = 1;
        const chunkSize = 20;
        for (let i = 0; i < allUsers.length; i += chunkSize) {
          const chunk = allUsers.slice(i, i + chunkSize);
          paginatedUsers[page] = chunk;
          page++;
        }

        console.log(paginatedUsers);
        setPaginatedUsers(paginatedUsers);
      } else {
        setNextPageDisabled(true);
        setPaginatedUsers({ 1: allUsers });
      }
      setUsers(allUsers);
    };
    setAllUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold md:text-3xl">User Management</h2>

      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white sm:w-64"
        />
        <Button
          onClick={() => {
            setAddNewUserIsOpen(!addNewUserIsOpen);
          }}
        >
          Add New User
        </Button>
      </div>

      <Dialog open={deleteUserIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-black">
              This action cannot be undone. This will permanently delete the
              account of
              <b> {userToDelete.userName}</b>.
            </DialogDescription>
            <div className="flex gap-4">
              <Button
                variant={"default"}
                onClick={() => {
                  setDeleteUserIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  deleteUserHandler(userToDelete.Auth);
                }}
              >
                Confirm
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {addNewUserIsOpen && (
        <Card className="w-1/3 absolute z-10 right-5">
          <CardHeader>
            <CardTitle>Add a new user</CardTitle>
            <CardDescription>Enter details of the new user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  required={true}
                  id="profile-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  required={true}
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="janedoe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  required={true}
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="janedoe@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  required={true}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => {
                  setAddNewUserIsOpen(false);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              {addUserButtonLoading ? (
                <LoadingSpinner />
              ) : (
                <Button onClick={addNewUserHandler}>Submit</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      {suspendUserIsOpen && (
        <Card className="w-1/3 absolute z-10 right-5">
          <CardHeader>
            <CardTitle>Suspend {userToSuspend.userName}</CardTitle>
            <CardDescription>Confirm suspension of user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Label htmlFor="profile-name">
                Select the duration of suspension
              </Label>
              <div className={cn("grid gap-2")}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => {
                  setUserToSuspend({});
                  setSuspendUserIsOpen(false);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              {suspendUserButtonLoading ? (
                <LoadingSpinner />
              ) : (
                <Button onClick={suspendUserHandler}>Submit</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subsciption type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchTerm !== "" &&
              filteredUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.profileName}</TableCell>
                  <TableCell>{user.premiumUser ? "Premium" : "Free"}</TableCell>
                  <TableCell>
                    {/* <div className="flex flex-wrap gap-2"> */}
                    <Button
                      onClick={() => {
                        setUserToSuspend(user);
                        setSuspendUserIsOpen(!suspendUserIsOpen);
                      }}
                      variant={"destructive"}
                      size="sm"
                    >
                      Suspend
                    </Button>
                    <Button
                      onClick={() => {
                        setUserToDelete(user);
                        setDeleteUserIsOpen(true);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                    {/* </div> */}
                  </TableCell>
                </TableRow>
              ))}
            {searchTerm === "" &&
              Object.keys(paginatedUsers).length >= 1 &&
              paginatedUsersProvider().map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.profileName}</TableCell>
                  <TableCell>{user.premiumUser ? "Premium" : "Free"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={() => {
                          setUserToSuspend(user);
                          setSuspendUserIsOpen(!suspendUserIsOpen);
                        }}
                        variant={"destructive"}
                        size="sm"
                      >
                        Suspend
                      </Button>
                      <Button
                        onClick={() => {
                          setUserToDelete(user);
                          setDeleteUserIsOpen(true);
                        }}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent className="flex my-4">
            <PaginationItem>
              <Button
                disabled={previousPageDisabled}
                onClick={() => {
                  handlePageChange("previous");
                }}
                variant={"outline"}
              >
                <PaginationPrevious />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                disabled={nextPageDisabled}
                variant={"outline"}
                onClick={() => {
                  handlePageChange("next");
                }}
              >
                <PaginationNext />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
