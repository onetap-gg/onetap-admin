"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCoupons } from "@/hooks/get-marketplace";
import { LoadingSpinner } from "@/components/loader";
import { toast } from "sonner";
import { Coupon } from "@/context/marketplace";

// Mock marketplace items
const items = [
  {
    id: 1,
    name: "Sword of Power",
    description: "A powerful sword",
    price: 100,
    game: "RPG Adventure",
    stock: 50,
  },
  {
    id: 2,
    name: "Speed Boost",
    description: "Increases speed",
    price: 50,
    game: "Racing Simulator",
    stock: 100,
  },
  // Add more mock items as needed
];

export default function MarketplaceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paginatedCoupons, setPaginatedCoupons] = useState<any>([]);
  const [coupons, setCoupons] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [previousPageDisabled, setPreviousPageDisabled] = useState(true);
  const [nextPageDisabled, setNextPageDisabled] = useState(false);
  const [addNewCouponIsOpen, setAddNewCouponIsOpen] = useState(false);
  const [couponName, setCouponName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [addCouponButtonLoading, setAddCouponButtonLoading] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(10);
  const [deleteCouponIsOpen, setDeleteCouponIsOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon>();
  const [deleteCouponButtonIsLoading, setDeleteCouponButtonLoading] =
    useState(false);
  const [couponToEdit, setCouponToEdit] = useState<Coupon>();
  const [editCouponButtonIsLoading, setEditCouponButtonIsLoading] =
    useState(false);
  const [editCouponIsOpen, setEditCouponIsOpen] = useState(false);

  const games = {
    1: "Dota",
    2: "Valorant",
    3: "Call Of Duty",
    4: "PUBG",
    5: "Fall Guys",
    6: "Fortnite",
  };

  const paginatedCouponsProvider = () => {
    return paginatedCoupons[page];
  };

  const handlePageChange = async (action: string) => {
    let pageLimit = Object.keys(paginatedCoupons).length;
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

  const addNewCouponHandler = async () => {
    setAddCouponButtonLoading(true);
    if (couponName === "" || pointsToRedeem === 0 || gameId === "") {
      return toast.warning(
        "Please fill the required coupon details before proceeding."
      );
    } else {
      const response = await axios.post("/api/marketplace/addCoupon", {
        couponName: couponName,
        description: description,
        gameId: gameId,
        pointsToRedeem: pointsToRedeem,
      });

      if (response.status === 500) {
        setAddCouponButtonLoading(false);
        return toast.error(response.data);
      } else {
        setAddNewCouponIsOpen(false);
        setCouponName("");
        setDescription("");
        setGameId("");
        setPointsToRedeem(0);
        setAddCouponButtonLoading(false);
        return toast.success("Successfully added new coupon! 🔥");
      }
    }
  };

  const deleteCouponHandler = async (couponId: number) => {
    setDeleteCouponButtonLoading(true);
    const response = await axios.post("/api/marketplace/deleteCoupon", {
      couponId: couponId,
    });

    if (response.status === 500) {
      return toast.error(response.data);
    } else {
      console.log("delete coupon");
      setDeleteCouponButtonLoading(false);
      return toast.success("Coupon deleted successfully! 🗑️");
    }
  };

  const editCouponHandler = async () => {
    setEditCouponButtonIsLoading(true);
    if (couponName === "" || pointsToRedeem === 0 || gameId === "") {
      return toast.warning(
        "Please fill the required coupon details before proceeding."
      );
    } else {
      const response = await axios.post("/api/marketplace/editCoupon", {
        id: couponToEdit?.id,
        couponName: couponName,
        description: description,
        gameId: gameId,
        pointsToRedeem: pointsToRedeem,
      });

      if (response.status === 500) {
        return toast.error(response.data);
      } else {
        setEditCouponIsOpen(false);
        setCouponName("");
        setDescription("");
        setGameId("");
        setPointsToRedeem(0);
        setEditCouponButtonIsLoading(false);
        return toast.success("Successfully updated coupon! 🔥");
      }
    }
  };

  useEffect(() => {
    const setAllCoupons = async () => {
      let allCoupons = await getCoupons();
      allCoupons = allCoupons.map((item: any, index: number) => {
        return { ...item, rank: (index += 1) };
      });
      let arg_coupons: any = {};
      if (allCoupons.length > 20) {
        setNextPageDisabled(false);
        let page = 1;
        const chunkSize = 20;
        for (let i = 0; i < allCoupons.length; i += chunkSize) {
          const chunk = allCoupons.slice(i, i + chunkSize);
          arg_coupons[page] = chunk;
          page++;
        }
        console.log(arg_coupons);
        setPaginatedCoupons(arg_coupons);
      } else {
        setNextPageDisabled(true);
        setPaginatedCoupons({ 1: allCoupons });
      }
      setCoupons(allCoupons);
    };
    setAllCoupons();
  }, []);

  const filteredItems = coupons.filter(
    (item: any) =>
      item.coupon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Marketplace Management</h2>

      <div className="flex justify-between">
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white sm:w-64"
        />
        <Button
          onClick={() => {
            setAddNewCouponIsOpen(!addNewCouponIsOpen);
          }}
        >
          Add New Coupon
        </Button>
      </div>

      {addNewCouponIsOpen && (
        <Card className="w-1/3 absolute z-10 right-5">
          <CardHeader>
            <CardTitle>Add a new coupon</CardTitle>
            <CardDescription>Enter details of the new coupon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="coupon-name">Coupon Name</Label>
                <Input
                  required={true}
                  id="coupon-name"
                  value={couponName}
                  onChange={(e) => setCouponName(e.target.value)}
                  placeholder="CouponABC"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  required={true}
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A description...(optional)"
                />
              </div>
              <div>
                <Label htmlFor="game">Game</Label>
                <Select
                  onValueChange={(value: string) => {
                    setGameId(value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(games).map(([gameId, game]) => {
                      return (
                        <SelectItem key={gameId} value={gameId as string}>
                          {game}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="points-to-redeem">Points to redeem</Label>
                <Input
                  type="number"
                  required={true}
                  id="points-to-redeem"
                  value={pointsToRedeem}
                  min={10}
                  onChange={(e) => {
                    let value: unknown = e.target.value;
                    setPointsToRedeem(value as number);
                  }}
                  placeholder="Ex: 200"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => {
                  setAddNewCouponIsOpen(false);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              {addCouponButtonLoading ? (
                <LoadingSpinner />
              ) : (
                <Button onClick={addNewCouponHandler}>Submit</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      {editCouponIsOpen && (
        <Card className="w-1/3 absolute z-10 right-5">
          <CardHeader>
            <CardTitle>Edit {couponToEdit?.coupon_name}</CardTitle>
            <CardDescription>Enter new details of the coupon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="coupon-name">Coupon Name</Label>
                <Input
                  required={true}
                  id="coupon-name"
                  defaultValue={couponToEdit?.coupon_name}
                  onChange={(e) => setCouponName(e.target.value)}
                  placeholder="CouponABC"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  required={true}
                  id="description"
                  defaultValue={couponToEdit?.description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A description...(optional)"
                />
              </div>
              <div>
                <Label htmlFor="email">Game</Label>
                <Select
                  onValueChange={(value: string) => {
                    setGameId(value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={
                        games[couponToEdit?.game_id as keyof typeof games]
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(games).map(([gameId, game]) => {
                      return (
                        <SelectItem key={gameId} value={gameId as string}>
                          {game}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="points-to-redeem">Points to redeem</Label>
                <Input
                  type="number"
                  required={true}
                  id="points-to-redeem"
                  defaultValue={couponToEdit?.points_to_redeem}
                  min={10}
                  onChange={(e) => {
                    let value: unknown = e.target.value;
                    setPointsToRedeem(value as number);
                  }}
                  placeholder="Ex: 200"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => {
                  setEditCouponIsOpen(false);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              {editCouponButtonIsLoading ? (
                <LoadingSpinner />
              ) : (
                <Button onClick={editCouponHandler}>Submit</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      <Dialog open={deleteCouponIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-black">
              This action cannot be undone. This will permanently delete the
              coupon
              <b> {couponToDelete?.coupon_name}</b>.
            </DialogDescription>
            <div className="flex gap-4">
              <Button
                variant={"default"}
                onClick={() => {
                  setDeleteCouponIsOpen(false);
                }}
              >
                Cancel
              </Button>
              {deleteCouponButtonIsLoading ? (
                <LoadingSpinner />
              ) : (
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    deleteCouponHandler(couponToDelete?.coupon_id as number);
                  }}
                >
                  Confirm
                </Button>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Game</TableHead>
            <TableHead>Points to redeem</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchTerm !== "" &&
            filteredItems.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.coupon_name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  {games[item.game_id as keyof typeof games] || "Undefined"}
                </TableCell>
                <TableCell>{item.points_to_redeem}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      setCouponToEdit(item);
                      setCouponName(item.coupon_name);
                      setDescription(item.description);
                      setPointsToRedeem(item.points_to_redeem);
                      setGameId(item.game_id);
                      setEditCouponIsOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setCouponToDelete(item);
                      setDeleteCouponIsOpen(true);
                    }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {searchTerm === "" &&
            Object.keys(paginatedCoupons).length >= 1 &&
            paginatedCouponsProvider().map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.coupon_name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  {games[item.game_id as keyof typeof games] || "Undefined"}
                </TableCell>
                <TableCell>{item.points_to_redeem}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      setCouponToEdit(item);
                      setCouponName(item.coupon_name);
                      setDescription(item.description);
                      setPointsToRedeem(item.points_to_redeem);
                      setGameId(item.game_id);
                      setEditCouponIsOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setCouponToDelete(item);
                      setDeleteCouponIsOpen(true);
                    }}
                  >
                    Remove
                  </Button>
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
  );
}
