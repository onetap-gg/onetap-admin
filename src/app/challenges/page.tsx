"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Mock challenge data
const challenges = [
  { id: 1, name: 'Daily Login', type: 'Daily', objective: 'Log in for 7 consecutive days', reward: '100 coins', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active' },
  { id: 2, name: 'Win 10 Matches', type: 'Weekly', objective: 'Win 10 matches in any game mode', reward: '500 coins', startDate: '2023-06-01', endDate: '2023-06-07', status: 'Inactive' },
  // Add more mock challenges as needed
]

export default function ChallengeManagement() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChallenges = challenges.filter(challenge => 
    challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold md:text-3xl">Challenge Management</h2>

        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <Input 
            placeholder="Search challenges..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <DialogTrigger asChild>
            <Button>Create New Challenge</Button>
          </DialogTrigger>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Objective</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChallenges.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>{challenge.name}</TableCell>
                  <TableCell>{challenge.type}</TableCell>
                  <TableCell>{challenge.objective}</TableCell>
                  <TableCell>{challenge.reward}</TableCell>
                  <TableCell>{challenge.startDate}</TableCell>
                  <TableCell>{challenge.endDate}</TableCell>
                  <TableCell>{challenge.status}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">
                        {challenge.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="destructive" size="sm">Remove</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
          <DialogDescription>
            Set up a new challenge for your players.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="game" className="text-right">
              Game
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rpg">RPG Adventure</SelectItem>
                <SelectItem value="fps">FPS Shooter</SelectItem>
                <SelectItem value="racing">Racing Simulator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kill">Kill</SelectItem>
                <SelectItem value="headshot">Headshot</SelectItem>
                <SelectItem value="time">Time in game</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prize" className="text-right">
              Prize
            </Label>
            <Input id="prize" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input id="startDate" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <Input id="endDate" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit">Create Challenge</Button>
      </DialogContent>
    </Dialog>
  )
}

