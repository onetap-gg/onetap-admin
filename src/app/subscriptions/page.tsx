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

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, convertDateToIST } from "@/lib/utils";
import { format } from "date-fns";
import axios from "axios";
import { getAllSubscriptions } from "@/hooks/get-all-subscription";

// Mock subscription data
// const subscriptions = [
//   {
//     id: 1,
//     username: "user1",
//     plan: "Premium",
//     price: 9.99,
//     startDate: "2023-01-01",
//     endDate: "2023-12-31",
//     status: "Active",
//   },
//   {
//     id: 2,
//     username: "user2",
//     plan: "Basic",
//     price: 4.99,
//     startDate: "2023-06-01",
//     endDate: "2023-07-01",
//     status: "Cancelled",
//   },
//   // Add more mock subscriptions as needed
// ];

export default function SubscriptionManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const [addNewUserIsOpen, setAddNewUserIsOpen] = useState(false);
  const [editNewUserIsOpen, setEditNewUserIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [benefit, setBenefit] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [addUserButtonLoading, setAddUserButtonLoading] = useState(false);
  const [editUserButtonLoading, setEditUserButtonLoading] = useState(false);
  const [nextPageDisabled, setNextPageDisabled] = useState(false);

  const [inPlanGame, setInPlanGame] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [paginatedSubscriptions, setPaginatedSubscriptions] = useState<any>([]);
  const [paginatedChallengesss, setPaginatedSubscriptionss] = useState<any>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const addNewUserHandler = async () => {
    setAddUserButtonLoading(true);
    if (userName === "") {
      setAddUserButtonLoading(false);
      return toast.warning(
        "Please fill the required challenge details before proceeding."
      );
    } else {
      const body = {
        tier: inPlanGame ? "Basic" : "Premium",
        cost: price,
        benefits: [
          {
            benefit: benefit,
            description: description,
          },
        ],
      };
      try {
        const response = await axios.post(
          "/api/subscriptions/addSubscription",

          body
        );
        if (response.status === 200) {
          setAddNewUserIsOpen(false);
          setUserName("");
          setStartDate(new Date());
          setEndDate(new Date());

          setAddUserButtonLoading(false);
          return toast.success("Successfully added new challenge! 🔥");
        } else {
          setAddUserButtonLoading(false);
          return toast.error(response.data);
        }
      } catch (error) {
        setAddUserButtonLoading(false);
        return toast.error("An error occurred while adding the challenge.");
      }
    }
  };

  const editNewUserHandler = async () => {
    setAddUserButtonLoading(true);
    if (userName === "") {
      setAddUserButtonLoading(false);
      return toast.warning(
        "Please fill the required challenge details before proceeding."
      );
    } else {
      const body = {
        tier: inPlanGame ? "Basic" : "Premium",
        cost: price,
        benefits: [
          {
            benefit: benefit,
            description: description,
          },
        ],
      };
      try {
        const response = await axios.post(
          "/api/subscriptions/editSubscription",

          body
        );
        if (response.status === 200) {
          setAddNewUserIsOpen(false);
          setUserName("");
          setStartDate(new Date());
          setEndDate(new Date());

          setAddUserButtonLoading(false);
          return toast.success("Successfully added new challenge! 🔥");
        } else {
          setAddUserButtonLoading(false);
          return toast.error(response.data);
        }
      } catch (error) {
        setAddUserButtonLoading(false);
        return toast.error("An error occurred while adding the challenge.");
      }
    }
  };

  const formatDateToCustom = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss.SSS");
    const timezoneOffset = "+00";
    return `${formattedDate}${timezoneOffset}`;
  };

  const handleStartTimeChange = (type: "hour" | "minute", value: string) => {
    if (startDate) {
      const newDate = new Date(startDate);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      setStartDate(newDate);
      console.log("start date", formatDateToCustom(newDate));
    }
  };

  const handleStartDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleEndTimeChange = (type: "hour" | "minute", value: string) => {
    if (endDate) {
      const newDate = new Date(endDate);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      setEndDate(newDate);
      console.log("end time", formatDateToCustom(newDate));
    }
  };

  const handleEndDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  useEffect(() => {
    const setAllSubscriptions = async () => {
      let allSubscriptions = await getAllSubscriptions();

      if (!allSubscriptions || allSubscriptions.length === 0) {
        console.log("No subscriptions found:", allSubscriptions);
        return;
      }

      allSubscriptions = allSubscriptions.map((item: any, index: number) => ({
        ...item,
        sNo: index + 1,
      }));

      console.log("Fetched subscriptions:", allSubscriptions);
      setSubscriptions(allSubscriptions);
    };

    setAllSubscriptions();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSubscriptions(subscriptions);
      return;
    }

    const filtered = subscriptions.filter((subscription: any) => {
      console.log("Checking subscription:", subscription);

      if (!subscription || typeof subscription !== "object") {
        console.log("Invalid subscription:", subscription);
        return false;
      }

      const matchesTier = subscription.tier
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCost = subscription.cost?.toString().includes(searchTerm);
      const matchesBenefits = subscription.benefits?.some((benefit: string) =>
        benefit.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log("Matches Tier:", matchesTier);
      console.log("Matches Cost:", matchesCost);
      console.log("Matches Benefits:", matchesBenefits);

      return matchesTier || matchesCost || matchesBenefits;
    });

    console.log("Filtered Subscriptions:", filtered);
    setFilteredSubscriptions(filtered);
  }, [searchTerm, subscriptions]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Subscription Management</h2>

      <div className="flex justify-between">
        <Input
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Button
          onClick={() => {
            setAddNewUserIsOpen(!addNewUserIsOpen);
          }}
        >
          Add New Plan
        </Button>
      </div>

      {addNewUserIsOpen && (
        <Card className="w-[60%]  absolute z-10 right-10">
          <CardHeader>
            <CardTitle>Add a New User</CardTitle>
            <CardDescription>Enter details of the New User</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Plan</Label>
                <Select
                  value={inPlanGame ? "true" : "false"}
                  onValueChange={(value: string) => {
                    setInPlanGame(value as unknown as boolean);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="False" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Basic</SelectItem>
                    <SelectItem value="false">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="challenge-name">Price</Label>
                <Input
                  required
                  id="challenge-name"
                  value={price}
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="ChallengeABC"
                />
              </div>

              <div>
                <Label htmlFor="benefit">Benefits</Label>
                <Input
                  required
                  id="benefit"
                  value={benefit}
                  type="text"
                  onChange={(e) => setBenefit(e.target.value)}
                  placeholder="ChallengeABC"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  required
                  id="description"
                  value={description}
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ChallengeABC"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => setAddNewUserIsOpen(false)}
                variant="outline"
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

      {editNewUserIsOpen && (
        <Card className="w-[60%]  absolute z-10 right-10">
          <CardHeader>
            <CardTitle>Edit a New User</CardTitle>
            <CardDescription>Enter details of the Edit User</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Plan</Label>
                <Select
                  value={inPlanGame ? "true" : "false"}
                  onValueChange={(value: string) => {
                    setInPlanGame(value as unknown as boolean);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="False" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Basic</SelectItem>
                    <SelectItem value="false">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="challenge-name">Price</Label>
                <Input
                  required
                  id="challenge-name"
                  value={price}
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="ChallengeABC"
                />
              </div>

              <div>
                <Label htmlFor="benefit">Benefits</Label>
                <Input
                  required
                  id="benefit"
                  value={benefit}
                  type="text"
                  onChange={(e) => setBenefit(e.target.value)}
                  placeholder="ChallengeABC"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  required
                  id="description"
                  value={description}
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ChallengeABC"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => setEditNewUserIsOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              {editUserButtonLoading ? (
                <LoadingSpinner />
              ) : (
                <Button onClick={addNewUserHandler}>Submit</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Benefits</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubscriptions.map((subscription: any) => (
            <TableRow key={subscription.id} className="border-b">
              <TableCell className="hidden sm:table-cell">
                {subscription.id}
              </TableCell>
              <TableCell>{subscription.tier}</TableCell>
              <TableCell>${subscription.cost}</TableCell>
              <TableCell className="hidden md:table-cell">
                {convertDateToIST(subscription.startTime)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {subscription.endTime
                  ? convertDateToIST(subscription.endTime)
                  : "NA"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {subscription.benefits[0].benefit}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {subscription.benefits[0].description}
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditNewUserIsOpen(!editNewUserIsOpen)}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Renew
                  </Button>
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
