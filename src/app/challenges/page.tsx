"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getChallenges } from "@/hooks/get-all-challenges";
import { LoadingSpinner } from "@/components/loader";
import { CalendarDaysIcon } from "lucide-react";
import { format, parseISO, set } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Custom function to format date to the desired format
const formatDateToCustom = (date: Date) => {
  const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss.SSS");
  const timezoneOffset = "+00";
  return `${formattedDate}${timezoneOffset}`;
};

export default function ChallengeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paginatedChallenges, setPaginatedChallenges] = useState<any>([]);
  const [challenges, setChallenges] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [previousPageDisabled, setPreviousPageDisabled] = useState(true);
  const [nextPageDisabled, setNextPageDisabled] = useState(false);
  const [addNewChallengeIsOpen, setAddNewChallengeIsOpen] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [gameId, setGameId] = useState(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [addChallengeButtonLoading, setAddChallengeButtonLoading] =
    useState(false);
  const [editChallengeButtonLoading, setEditChallengeButtonLoading] =
    useState(false);
  const [reward, setReward] = useState(10);
  const [requirements, setRequirements] = useState({
    agent: "",
    deaths: 0,
    region: "",
    assists: 0,
    headshot: 0,
    game_mode: "",
    damage_done: 0,
    team_scores: 0,
    total_kills: 0,
    damage_taken: 0,
    match_status: false,
    spikes_defuse: 0,
    spikes_planted: 0,
  });
  const [inSameGame, setInSameGame] = useState(false);
  const [challengeType, setChallengeType] = useState("daily");
  const [challengeToEdit, setChallengeToEdit] = useState<any>(null);
  const [editChallengeIsOpen, setEditChallengeIsOpen] = useState(false);

  const handleRequirementChange = (key: string, value: any) => {
    setRequirements((prev) => {
      let newValue: any = value;
      if (typeof prev[key as keyof typeof prev] === "number") {
        newValue = parseInt(value, 10);
      } else if (typeof prev[key as keyof typeof prev] === "boolean") {
        newValue = value === "true";
      }
      return { ...prev, [key]: newValue };
    });
    console.log(requirements);
  };

  const filteredChallenges = challenges.filter(
    (challenge: any) =>
      challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const games = {
    1: "Dota",
    2: "Valorant",
    3: "Call Of Duty",
    4: "PUBG",
    5: "Fall Guys",
    6: "Fortnite",
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const handleStartDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
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

  const handleEndDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

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

  const addNewChallengeHandler = async () => {
    setAddChallengeButtonLoading(true);
    if (challengeName === "" || gameId === 0 || reward === 0) {
      setAddChallengeButtonLoading(false);
      return toast.warning(
        "Please fill the required challenge details before proceeding."
      );
    } else {
      const body = {
        name: challengeName,
        type: challengeType,
        startTime: startDate,
        endTime: endDate,
        reward: reward,
        requirements: requirements,
        gameId: gameId,
        inSameGame: inSameGame,
      };
      try {
        const response = await axios.post("/api/challenges/addChallenge", {
          gameId: gameId,
          data: [body],
        });
        if (response.status === 200) {
          setAddNewChallengeIsOpen(false);
          setChallengeName("");
          setChallengeType("daily");
          setStartDate(new Date());
          setEndDate(new Date());
          setReward(10);
          setRequirements({
            agent: "",
            deaths: 0,
            region: "",
            assists: 0,
            headshot: 0,
            game_mode: "",
            damage_done: 0,
            team_scores: 0,
            total_kills: 0,
            damage_taken: 0,
            match_status: false,
            spikes_defuse: 0,
            spikes_planted: 0,
          });
          setGameId(0);
          setInSameGame(false);
          setAddChallengeButtonLoading(false);
          return toast.success("Successfully added new challenge! 🔥");
        } else {
          setAddChallengeButtonLoading(false);
          return toast.error(response.data);
        }
      } catch (error) {
        setAddChallengeButtonLoading(false);
        return toast.error("An error occurred while adding the challenge.");
      }
    }
  };

  const editChallengeHandler = async () => {};

  useEffect(() => {
    const setAllChallenges = async () => {
      let allChallenges = await getChallenges();
      allChallenges = allChallenges.map((item: any, index: number) => {
        return { ...item, sNo: (index += 1) };
      });
      let arg_challenges: any = {};
      if (allChallenges.length > 20) {
        setNextPageDisabled(false);
        let page = 1;
        const chunkSize = 20;
        for (let i = 0; i < allChallenges.length; i += chunkSize) {
          const chunk = allChallenges.slice(i, i + chunkSize);
          arg_challenges[page] = chunk;
          page++;
        }
        console.log(arg_challenges);
        setPaginatedChallenges(arg_challenges);
      } else {
        setNextPageDisabled(true);
        setPaginatedChallenges({ 1: allChallenges });
      }
      setChallenges(allChallenges);
    };
    setAllChallenges();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold md:text-3xl">Challenge Management</h2>

      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
        <Input
          placeholder="Search challenges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white sm:w-64"
        />
        <Button
          onClick={() => {
            setAddNewChallengeIsOpen(!addNewChallengeIsOpen);
          }}
        >
          Add New Challenge
        </Button>
      </div>

      {addNewChallengeIsOpen && (
        <Card className="w-[60%]  absolute z-10 right-10">
          <CardHeader>
            <CardTitle>Add a new challenge</CardTitle>
            <CardDescription>
              Enter details of the new challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="challenge-name">Challenge Name</Label>
                <Input
                  required={true}
                  id="challenge-name"
                  value={challengeName}
                  onChange={(e) => setChallengeName(e.target.value)}
                  placeholder="ChallengeABC"
                />
              </div>
              <div>
                <Label htmlFor="challenge-type">Type</Label>
                <Input
                  required={true}
                  id="challenge-type"
                  value={challengeType}
                  onChange={(e) => setChallengeType(e.target.value)}
                  placeholder="daily"
                />
              </div>
              <div>
                <Label>Start Date & Time</Label>
                <Popover
                  open={isStartDateOpen}
                  onOpenChange={setIsStartDateOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "MM/dd/yyyy hh:mm")
                      ) : (
                        <span>MM/DD/YYYY hh:mm</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleStartDateSelect}
                        initialFocus
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {hours.reverse().map((hour) => (
                              <Button
                                key={hour}
                                size="icon"
                                variant={
                                  startDate && startDate.getHours() === hour
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleStartTimeChange("hour", hour.toString())
                                }
                              >
                                {hour}
                              </Button>
                            ))}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    startDate &&
                                    startDate.getMinutes() === minute
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleStartTimeChange(
                                      "minute",
                                      minute.toString()
                                    )
                                  }
                                >
                                  {minute.toString().padStart(2, "0")}
                                </Button>
                              )
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date & Time</Label>
                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "MM/dd/yyyy hh:mm")
                      ) : (
                        <span>MM/DD/YYYY hh:mm</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateSelect}
                        initialFocus
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {hours.reverse().map((hour) => (
                              <Button
                                key={hour}
                                size="icon"
                                variant={
                                  endDate && endDate.getHours() === hour
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleEndTimeChange("hour", hour.toString())
                                }
                              >
                                {hour}
                              </Button>
                            ))}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    endDate && endDate.getMinutes() === minute
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleEndTimeChange(
                                      "minute",
                                      minute.toString()
                                    )
                                  }
                                >
                                  {minute.toString().padStart(2, "0")}
                                </Button>
                              )
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="game">Game</Label>
                <Select
                  onValueChange={(value: string) => {
                    setGameId(value as unknown as number);
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
                <Label>In same game</Label>
                <Select
                  value={inSameGame ? "true" : "false"}
                  onValueChange={(value: string) => {
                    setInSameGame(value as unknown as boolean);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="False" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Requirements</Label>
              <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(requirements).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col space-y-2 min-w-[150px] w-full"
                  >
                    <Label htmlFor={key} className="text-sm font-medium">
                      {key}
                    </Label>
                    <Input
                      className="w-full border border-gray-300 rounded-md p-2"
                      id={key}
                      value={value as unknown as string}
                      disabled={key === "match_status"}
                      type={typeof value === "number" ? "number" : "text"}
                      onChange={(e) =>
                        handleRequirementChange(key, e.target.value)
                      }
                      placeholder={key}
                    />
                  </div>
                ))}
                <div>
                  <Label htmlFor="reward">Reward</Label>
                  <Input
                    className="w-[180px]"
                    type="number"
                    required={true}
                    id="reward"
                    value={reward}
                    min={10}
                    onChange={(e) => {
                      let value: unknown = e.target.value;
                      setReward(value as number);
                    }}
                    placeholder="Ex: 200"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => {
                  setAddNewChallengeIsOpen(false);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              {addChallengeButtonLoading ? (
                <LoadingSpinner />
              ) : (
                <Button onClick={addNewChallengeHandler}>Submit</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      {editChallengeIsOpen && (
        <Card className="w-[60%]  absolute z-10 right-10">
          <CardHeader>
            <CardTitle>Edit {challengeToEdit?.name}</CardTitle>
            <CardDescription>
              Enter new details of the challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="challenge-name">Challenge Name</Label>
                <Input
                  required={true}
                  id="challenge-name"
                  value={challengeToEdit?.name}
                  onChange={(e) => setChallengeName(e.target.value)}
                  placeholder="ChallengeABC"
                />
              </div>
              <div>
                <Label htmlFor="challenge-type">Type</Label>
                <Input
                  required={true}
                  id="challenge-type"
                  value={challengeToEdit.type}
                  onChange={(e) => setChallengeType(e.target.value)}
                  placeholder="daily"
                />
              </div>
              <div>
                <Label>Start Date & Time</Label>
                <Popover
                  open={isStartDateOpen}
                  onOpenChange={setIsStartDateOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !challengeToEdit.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      {challengeToEdit.startDate ? (
                        format(challengeToEdit.startDate, "MM/dd/yyyy hh:mm")
                      ) : (
                        <span>MM/DD/YYYY hh:mm</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleStartDateSelect}
                        initialFocus
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {hours.reverse().map((hour) => (
                              <Button
                                key={hour}
                                size="icon"
                                variant={
                                  startDate && startDate.getHours() === hour
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleStartTimeChange("hour", hour.toString())
                                }
                              >
                                {hour}
                              </Button>
                            ))}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    startDate &&
                                    startDate.getMinutes() === minute
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleStartTimeChange(
                                      "minute",
                                      minute.toString()
                                    )
                                  }
                                >
                                  {minute.toString().padStart(2, "0")}
                                </Button>
                              )
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date & Time</Label>
                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !challengeToEdit.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      {challengeToEdit.endDate ? (
                        format(challengeToEdit.endDate, "MM/dd/yyyy hh:mm")
                      ) : (
                        <span>MM/DD/YYYY hh:mm</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateSelect}
                        initialFocus
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {hours.reverse().map((hour) => (
                              <Button
                                key={hour}
                                size="icon"
                                variant={
                                  endDate && endDate.getHours() === hour
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleEndTimeChange("hour", hour.toString())
                                }
                              >
                                {hour}
                              </Button>
                            ))}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    endDate && endDate.getMinutes() === minute
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleEndTimeChange(
                                      "minute",
                                      minute.toString()
                                    )
                                  }
                                >
                                  {minute.toString().padStart(2, "0")}
                                </Button>
                              )
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="game">Game</Label>
                <Select
                  onValueChange={(value: string) => {
                    setGameId(value as unknown as number);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={
                        games[challengeToEdit?.game_id as keyof typeof games]
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
                <Label>In same game</Label>
                <Select
                  value={challengeToEdit.inSameGame ? "true" : "false"}
                  onValueChange={(value: string) => {
                    setInSameGame(value as unknown as boolean);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="False" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Requirements</Label>
              <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(challengeToEdit.requirements).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col space-y-2 min-w-[150px] w-full"
                    >
                      <Label htmlFor={key} className="text-sm font-medium">
                        {key}
                      </Label>
                      <Input
                        className="w-full border border-gray-300 rounded-md p-2"
                        id={key}
                        value={value as unknown as string}
                        disabled={key === "match_status"}
                        type={`${
                          typeof value === "number" ? "number" : "text"
                        }`}
                        onChange={(e) =>
                          handleRequirementChange(key, e.target.value)
                        }
                        placeholder={key}
                      />
                    </div>
                  )
                )}
                <div>
                  <Label htmlFor="reward">Reward</Label>
                  <Input
                    type="number"
                    required={true}
                    id="reward"
                    value={challengeToEdit.reward}
                    min={10}
                    onChange={(e) => {
                      let value: unknown = e.target.value;
                      setReward(value as number);
                    }}
                    placeholder="Ex: 200"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button
                onClick={() => {
                  setEditChallengeIsOpen(false);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              {editChallengeButtonLoading ? (
                <LoadingSpinner />
              ) : (
                <Button onClick={editChallengeHandler}>Submit</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChallenges.map((challenge: any) => (
              <TableRow key={challenge.id}>
                <TableCell>{challenge.name}</TableCell>
                <TableCell>{challenge.type}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"}>See all requirements</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <ScrollArea className="w-full">
                        {Object.entries(challenge.requirements).map(
                          ([key, value]) => (
                            <div className="flex justify-between" key={key}>
                              <div className="whitespace-nowrap text-sm font-medium text-gray-900">
                                {key}
                              </div>
                              <div className="whitespace-nowrap text-sm text-gray-500">
                                {value as string}
                              </div>
                            </div>
                          )
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>{challenge.game}</TableCell>
                <TableCell>{challenge.reward}</TableCell>
                <TableCell>
                  {format(parseISO(challenge.startTime), "MM/dd/yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {format(parseISO(challenge.endTime), "MM/dd/yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChallengeToEdit(challenge);
                        setEditChallengeIsOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
