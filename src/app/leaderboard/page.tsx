"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeaderboard } from "@/hooks/get-leaderboard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { toast } from "sonner";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/loader";

// Mock leaderboard data
const leaderboardEntries = [
  {
    id: 1,
    rank: 1,
    username: "user1",
    score: 10000,
    lastUpdated: "2023-06-15",
  },
  { id: 2, rank: 2, username: "user2", score: 9500, lastUpdated: "2023-06-14" },
  // Add more mock leaderboard entries as needed
];

export default function LeaderboardManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paginatedLeaderboard, setPaginatedLeaderboard] = useState<any>([]);
  const [leaderboard, setLeaderboard] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [previousPageDisabled, setPreviousPageDisabled] = useState(true);
  const [nextPageDisabled, setNextPageDisabled] = useState(false);
  let rank = 0;
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

  const filteredEntries = leaderboard.filter((entry: any) =>
    entry.User.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = async (action: string) => {
    let pageLimit = Object.keys(paginatedLeaderboard).length;
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

  const paginatedLeaderboardProvider = () => {
    return paginatedLeaderboard[page];
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

  useEffect(() => {
    const setAllUsers = async () => {
      let allLeaderboard = await getLeaderboard();
      allLeaderboard = allLeaderboard.map((item: any, index: number) => {
        return { ...item, rank: (index += 1) };
      });
      let paginatedUsers: any = {};
      if (allLeaderboard.length > 20) {
        setNextPageDisabled(false);
        let page = 1;
        const chunkSize = 20;
        for (let i = 0; i < allLeaderboard.length; i += chunkSize) {
          const chunk = allLeaderboard.slice(i, i + chunkSize);
          paginatedUsers[page] = chunk;
          page++;
        }
        console.log(paginatedUsers);
        setPaginatedLeaderboard(paginatedUsers);
      } else {
        setNextPageDisabled(true);
        setPaginatedLeaderboard({ 1: allLeaderboard });
      }
      setLeaderboard(allLeaderboard);
    };
    setAllUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Leaderboard Management</h2>

      <div className="flex justify-between">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white sm:w-64"
        />
        <Button>Reset Leaderboard</Button>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Coins</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchTerm !== "" &&
            filteredEntries.map((entry: any) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.rank}</TableCell>
                <TableCell>{entry.User.userName}</TableCell>
                <TableCell>{entry.score}</TableCell>
                <TableCell>{entry.lastUpdated}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setUserToSuspend(entry);
                      setSuspendUserIsOpen(!suspendUserIsOpen);
                    }}
                    variant={"destructive"}
                    size="sm"
                    className="mr-2"
                  >
                    Suspend
                  </Button>
                  <Button
                    onClick={() => {
                      setUserToDelete(entry);
                      setDeleteUserIsOpen(true);
                    }}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {searchTerm === "" &&
            Object.keys(paginatedLeaderboard).length >= 1 &&
            paginatedLeaderboardProvider().map((entry: any) => {
              return (
                <TableRow key={entry.id}>
                  <TableCell>{entry.rank}</TableCell>
                  <TableCell>{entry.User.userName}</TableCell>
                  <TableCell>{entry.gameLevel}</TableCell>
                  <TableCell>{entry.gameBalance}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setUserToSuspend(entry);
                        setSuspendUserIsOpen(!suspendUserIsOpen);
                      }}
                      variant={"destructive"}
                      size="sm"
                      className="mr-2"
                    >
                      Suspend
                    </Button>
                    <Button
                      onClick={() => {
                        setUserToDelete(entry);
                        setDeleteUserIsOpen(true);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
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
  );
}
