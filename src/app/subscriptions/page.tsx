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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
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

  const [addNewSubscriptionIsOpen, setAddNewSubscriptionIsOpen] =
    useState(false);
  const [editSubscriptionIsOpen, setEditSubscriptionIsOpen] = useState(false);

  const [addSubscriptionButtonLoading, setAddSubscriptionButtonLoading] =
    useState(false);
  const [editSubscriptionButtonLoading, setEditSubscriptionButtonLoading] =
    useState(false);
  const [
    deactivateSubscriptionButtonLoading,
    setDeactivateSubscriptionButtonLoading,
  ] = useState(false);
  const [deleteSubscriptionButtonLoading, setDeleteSubscriptionButtonLoading] =
    useState(false);

  const [subscriptionId, setSubscriptionId] = useState(0);
  const [plan, setPlan] = useState("");
  const [price, setPrice] = useState("");
  const [benefit, setBenefit] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState<
    { benefit: string; description: string }[]
  >([]);

  const [filteredSubscriptions, setFilteredSubscriptions] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

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

  const addNewSubscriptionHandler = async () => {
    setAddSubscriptionButtonLoading(true);

    const body = {
      tier: plan,
      cost: price,
      benefits: benefits,
    };
    try {
      const response = await axios.post(
        "/api/subscriptions/addSubscription",
        body
      );
      if (response.status === 200) {
        setAddNewSubscriptionIsOpen(false);
        setAddSubscriptionButtonLoading(false);
        setSubscriptions([]);
        setAllSubscriptions();
        return toast.success("Successfully added new subscription! 🔥");
      } else {
        setAddSubscriptionButtonLoading(false);
        return toast.error(response.data);
      }
    } catch (error) {
      setAddSubscriptionButtonLoading(false);
      return toast.error("An error occurred while adding the subscription.");
    }
  };

  const editSubscriptionHandler = async () => {
    setEditSubscriptionButtonLoading(true);

    const body = {
      id: subscriptionId,
      tier: plan,
      cost: price,
      benefits: benefits,
    };
    try {
      const response = await axios.post(
        `/api/subscriptions/editSubscription`,
        body
      );
      if (response.status === 200) {
        setEditSubscriptionIsOpen(false);
        setEditSubscriptionButtonLoading(false);
        setSubscriptions([]);
        setAllSubscriptions();

        return toast.success("Successfully updated Subscription! 🔥");
      } else {
        setEditSubscriptionIsOpen(false);
        setEditSubscriptionButtonLoading(false);
        return toast.error(response.data);
      }
    } catch (error) {
      setEditSubscriptionIsOpen(false);
      setEditSubscriptionButtonLoading(false);
      return toast.error("An error occurred while adding the subscription.");
    }
  };

  const deactivateSubscriptionHandler = async (id: number) => {
    setDeactivateSubscriptionButtonLoading(true);

    const body = {
      id: id,
    };
    try {
      const response = await axios.post(`/api/subscriptions/deactivate`, body);
      if (response.status === 200) {
        setDeactivateSubscriptionButtonLoading(false);
        setSubscriptions([]);
        setAllSubscriptions();

        return toast.success("Successfully deactivated Subscription! 🔥");
      } else {
        setDeactivateSubscriptionButtonLoading(false);
        return toast.error(response.data);
      }
    } catch (error) {
      setDeactivateSubscriptionButtonLoading(false);
      return toast.error(
        "An error occurred while deactivated the subscription."
      );
    }
  };

  const deleteSubscriptionHandler = async (id: number) => {
    setDeleteSubscriptionButtonLoading(true);

    const body = {
      id: id,
    };
    try {
      const response = await axios.post(
        `/api/subscriptions/deleteSubscription`,
        body
      );
      if (response.status === 200) {
        setDeleteSubscriptionButtonLoading(false);
        setSubscriptions([]);
        setAllSubscriptions();

        return toast.success("Successfully deleted Subscription! 🔥");
      } else {
        setDeleteSubscriptionButtonLoading(false);
        return toast.error(response.data);
      }
    } catch (error) {
      setDeleteSubscriptionButtonLoading(false);
      return toast.error("An error occurred while deleted the subscription.");
    }
  };

  useEffect(() => {
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

      console.log("Matches Tier:", matchesTier);
      console.log("Matches Cost:", matchesCost);

      return matchesTier || matchesCost;
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
            setPlan("");
            setPrice("");
            setBenefit("");
            setDescription("");
            setBenefits([]);
            setAddNewSubscriptionIsOpen(!addNewSubscriptionIsOpen);
          }}
        >
          Add New Plan
        </Button>
      </div>

      {addNewSubscriptionIsOpen && (
        <Card className="w-[60%] absolute z-10 right-10">
          <CardHeader>
            <CardTitle>Add a New Subscription</CardTitle>
            <CardDescription>Enter details of the Subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Plan</Label>
                  <Select
                    value={plan}
                    onValueChange={(value: string) => {
                      console.log("Selected value:", value);
                      setPlan(value as string);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={"Select Plan"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
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
                    placeholder="Enter Price"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <h3 className="font-bold">Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="benefit">Benefits</Label>
                    <Input
                      required
                      id="benefit"
                      value={benefit}
                      type="text"
                      onChange={(e) => setBenefit(e.target.value)}
                      placeholder="Enter Benefit"
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
                      placeholder="Enter Description"
                    />
                  </div>

                  <Button
                    onClick={() => {
                      if (!benefit || !description) {
                        return toast.error(
                          "Please enter both benefit and description."
                        );
                      }

                      setBenefits((prev: any) => [
                        ...prev,
                        {
                          benefit: benefit,
                          description: description,
                        },
                      ]);
                      setBenefit("");
                      setDescription("");
                      toast.success("Benefit added successfully!");
                    }}
                  >
                    Add Benefit
                  </Button>
                </div>
              </div>

              {benefits.length > 0 && (
                <div className="bg-gray-100 min-h-[200px] w-full rounded-md border border-input p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benefit</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {benefits.map((item: any, index: number) => (
                        <TableRow key={index} className="border-b">
                          <TableCell>{item.benefit}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updatedBenefits = benefits.filter(
                                  (_, i) => i !== index
                                );
                                setBenefits(updatedBenefits);
                                toast.success("Benefit removed successfully!");
                              }}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => {
                  setPlan("");
                  setPrice("");
                  setBenefit("");
                  setDescription("");
                  setBenefits([]);
                  setAddNewSubscriptionIsOpen(false);
                }}
                variant="outline"
              >
                Cancel
              </Button>
              {addSubscriptionButtonLoading ? (
                <Button>
                  <LoadingSpinner />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (!plan || !price || benefits.length === 0) {
                      return toast.error("Please fill all the fields.");
                    } else {
                      addNewSubscriptionHandler();
                    }
                  }}
                >
                  Submit
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      {editSubscriptionIsOpen && (
        <Card className="w-[60%]  absolute z-10 right-10">
          <CardHeader>
            <CardTitle>Edit a Subscription</CardTitle>
            <CardDescription>Enter details of the Subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Plan</Label>
                  <Select
                    value={plan}
                    onValueChange={(value: string) => {
                      console.log("Selected value:", value);
                      setPlan(value as string);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={"Select Plan"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
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
                    placeholder="Enter Price"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <h3 className="font-bold">Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="benefit">Benefits</Label>
                    <Input
                      required
                      id="benefit"
                      value={benefit}
                      type="text"
                      onChange={(e) => setBenefit(e.target.value)}
                      placeholder="Enter Benefit"
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
                      placeholder="Enter Description"
                    />
                  </div>

                  <Button
                    onClick={() => {
                      if (!benefit || !description) {
                        return toast.error(
                          "Please enter both benefit and description."
                        );
                      }

                      setBenefits((prev: any) => [
                        ...prev,
                        {
                          benefit: benefit,
                          description: description,
                        },
                      ]);
                      setBenefit("");
                      setDescription("");
                      toast.success("Benefit added successfully!");
                    }}
                  >
                    Add Benefit
                  </Button>
                </div>
              </div>

              {benefits.length > 0 && (
                <div className="bg-gray-100 min-h-[200px] w-full rounded-md border border-input p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benefit</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {benefits.map((item: any, index: number) => (
                        <TableRow key={index} className="border-b">
                          <TableCell>{item.benefit}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updatedBenefits = benefits.filter(
                                  (_, i) => i !== index
                                );
                                setBenefits(updatedBenefits);
                                toast.success("Benefit removed successfully!");
                              }}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => {
                  setSubscriptionId(0);
                  setPlan("");
                  setPrice("");
                  setBenefit("");
                  setDescription("");
                  setBenefits([]);
                  setEditSubscriptionIsOpen(false);
                }}
                variant="outline"
              >
                Cancel
              </Button>
              {editSubscriptionButtonLoading ? (
                <Button>
                  <LoadingSpinner />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (!plan || !price || benefits.length === 0) {
                      return toast.error("Please fill all the fields.");
                    } else {
                      editSubscriptionHandler();
                    }
                  }}
                >
                  Update
                </Button>
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
            {/* <TableHead>End Date</TableHead> */}
            <TableHead>Benefits</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map((subscription: any) => (
              <TableRow key={subscription.id} className="border-b">
                <TableCell className="hidden sm:table-cell">
                  {subscription.id}
                </TableCell>
                <TableCell>{subscription.tier}</TableCell>
                <TableCell>${subscription.cost}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {convertDateToIST(subscription.startTime)}
                </TableCell>
                {/* <TableCell className="hidden md:table-cell">
                {subscription.endTime ? convertDateToIST(subscription.endTime) : "NA"}
              </TableCell> */}
                <TableCell className="hidden lg:table-cell">
                  <ol style={{ listStyleType: "decimal" }}>
                    {subscription.benefits && subscription.benefits.length > 0
                      ? subscription.benefits.map(
                          (benefit: any, index: number) => (
                            <li key={index}>{benefit.benefit}</li>
                          )
                        )
                      : "No benefits available"}
                  </ol>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <ol style={{ listStyleType: "decimal" }}>
                    {subscription.benefits && subscription.benefits.length > 0
                      ? subscription.benefits.map(
                          (benefit: any, index: number) => (
                            <li key={index}>{benefit.description}</li>
                          )
                        )
                      : "No Description available"}
                  </ol>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSubscriptionId(subscription.id);
                        setPlan(subscription.tier);
                        setPrice(subscription.cost);
                        setBenefits(subscription.benefits);

                        setEditSubscriptionIsOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        deactivateSubscriptionButtonLoading ? true : false
                      }
                      onClick={() => {
                        deactivateSubscriptionHandler(subscription.id);
                      }}
                    >
                      Deactivate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteSubscriptionButtonLoading ? true : false}
                      onClick={() => {
                        deleteSubscriptionHandler(subscription.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-b">
              <TableCell
                colSpan={7}
                className="text-center py-4 text-gray-600 font-semibold"
              >
                Fetching subscriptions... Please wait.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
