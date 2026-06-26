"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAppStore, Customer } from "@/lib/store"
import { Skeleton } from "@/components/feedback/Skeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table"
import { Plus, Search, Building2, ExternalLink, Filter, Edit2, ArrowRight } from "lucide-react"

export default function Customers() {
  const { customers, addCustomer, updateCustomer } = useAppStore()
  
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  
  // Simulated Loading State
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  
  // Form fields
  const [name, setName] = useState("")
  const [industry, setIndustry] = useState("")
  const [website, setWebsite] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [size, setSize] = useState("10-50")
  const [status, setStatus] = useState<Customer['status']>("Active")
  const [tagsInput, setTagsInput] = useState("")

  const openAddDrawer = () => {
    setEditingCustomer(null)
    setName("")
    setIndustry("")
    setWebsite("")
    setEmail("")
    setPhone("")
    setSize("10-50")
    setStatus("Active")
    setTagsInput("")
    setShowDrawer(true)
  }

  const openEditDrawer = (cust: Customer) => {
    setEditingCustomer(cust)
    setName(cust.name)
    setIndustry(cust.industry)
    setWebsite(cust.website)
    setEmail(cust.email)
    setPhone(cust.phone)
    setSize(cust.size)
    setStatus(cust.status)
    setTagsInput(cust.tags.join(", "))
    setShowDrawer(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t !== "")
    
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name,
        industry,
        website,
        email,
        phone,
        size,
        status,
        tags
      })
    } else {
      addCustomer({
        name,
        industry,
        website,
        email,
        phone,
        size,
        status,
        tags,
        salesRep: "Alexander Sterling",
        notes: []
      })
    }
    
    setShowDrawer(false)
  }

  // Filter listings
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.industry.toLowerCase().includes(search.toLowerCase())
      
    const matchesStatus = statusFilter === "All" || cust.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Accounts Directory</h2>
          <p className="text-xs text-muted-foreground">
            Manage customer profiles, contact info, and workspace classifications.
          </p>
        </div>
        <Button variant="premium" size="sm" onClick={openAddDrawer} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground stroke-1" />
          <Input
            type="text"
            placeholder="Search accounts or industries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        
        {/* Status filters */}
        <div className="flex rounded-lg bg-secondary p-1">
          {["All", "Active", "Lead", "Inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                statusFilter === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid List or Skeletons */}
      {isLoading ? (
        <Skeleton variant="table" className="h-96" />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No Customer Accounts"
          description="Manage customer profiles, contact info, and workspace classifications. Create your first customer account to get started."
          actionLabel="Add Account"
          onAction={openAddDrawer}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Company Size</TableHead>
                  <TableHead>Primary Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                      No accounts found matching your filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((cust) => (
                    <TableRow key={cust.id}>
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <Link href={`/customers/${cust.id}`} className="hover:text-primary transition-all">
                            {cust.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{cust.industry}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{cust.size}</TableCell>
                      <TableCell className="text-xs leading-none">
                        <div>{cust.email}</div>
                        <span className="text-[10px] text-muted-foreground mt-1 block">{cust.phone}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cust.status === "Active" ? "default" : cust.status === "Lead" ? "gold" : "secondary"}>
                          {cust.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cust.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-[9px] bg-muted/20 text-muted-foreground px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1.5 h-12">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDrawer(cust)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/customers/${cust.id}`}>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Slide-over Form Overlay Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel border border-border rounded-lg shadow-2xl p-6 relative">
            <h3 className="text-base font-bold mb-4">
              {editingCustomer ? "Edit Customer Account" : "Add New Customer Account"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Account Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Industry</label>
                  <Input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. SaaS"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Company Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none"
                  >
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="500-1000">500-1000 Employees</option>
                    <option value="10,000+">10,000+ Employees</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Website URL</label>
                <Input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="primary@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Phone</label>
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Lead">Lead</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Tags (comma-separated)</label>
                  <Input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Enterprise, High-Priority"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowDrawer(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  {editingCustomer ? "Save Details" : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
