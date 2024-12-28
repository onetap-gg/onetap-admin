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

// Mock subscription data
const subscriptions = [
  { id: 1, username: 'user1', plan: 'Premium', price: 9.99, startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active' },
  { id: 2, username: 'user2', plan: 'Basic', price: 4.99, startDate: '2023-06-01', endDate: '2023-07-01', status: 'Cancelled' },
  // Add more mock subscriptions as needed
]

export default function SubscriptionManagement() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <Button>Add New Plan</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubscriptions.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell>{sub.username}</TableCell>
              <TableCell>{sub.plan}</TableCell>
              <TableCell>${sub.price}</TableCell>
              <TableCell>{sub.startDate}</TableCell>
              <TableCell>{sub.endDate}</TableCell>
              <TableCell>{sub.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                <Button variant="outline" size="sm" className="mr-2">Renew</Button>
                <Button variant="destructive" size="sm">Cancel</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

