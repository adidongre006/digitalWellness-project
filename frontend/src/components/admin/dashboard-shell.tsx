"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, CheckCircle2, Database, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateResource, deleteResource, toggleGuidePublished, changeAdminPassword } from "@/app/admin/dashboard/actions";
import type { Resource, Guide, AuditLog } from "@/db/schema";

interface Props {
  resources: Resource[];
  guides: Guide[];
  auditLogs: AuditLog[];
  overview: {
    resourceCount: number;
    guideCount: number;
    categoryCount: number;
    lastVerification: { verifiedOn: Date; name: string } | null;
  };
  adminEmail: string;
}

export function DashboardShell({ resources, guides, auditLogs, overview, adminEmail }: Props) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="guides">Guides</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="audit">Audit History</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-8">
        <OverviewTab overview={overview} />
      </TabsContent>
      <TabsContent value="resources" className="mt-8">
        <ResourcesTab resources={resources} resourceCount={overview.resourceCount} />
      </TabsContent>
      <TabsContent value="guides" className="mt-8">
        <GuidesTab guides={guides} />
      </TabsContent>
      <TabsContent value="settings" className="mt-8">
        <SettingsTab adminEmail={adminEmail} />
      </TabsContent>
      <TabsContent value="audit" className="mt-8">
        <AuditTab logs={auditLogs} />
      </TabsContent>
    </Tabs>
  );
}

function OverviewTab({ overview }: { overview: Props["overview"] }) {
  const stats = [
    { label: "Total resources", value: overview.resourceCount, warn: overview.resourceCount !== 10 },
    { label: "Categories", value: overview.categoryCount },
    { label: "Total guides", value: overview.guideCount },
    {
      label: "Last verification",
      value: overview.lastVerification
        ? new Date(overview.lastVerification.verifiedOn).toLocaleDateString()
        : "—",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-subtle-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{s.value}</p>
            {"warn" in s && s.warn && (
              <p className="mt-2 flex items-center gap-1 text-xs text-warning">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Should be exactly 10
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      <Card className="sm:col-span-2 lg:col-span-4">
        <CardContent className="flex items-center gap-3 p-6">
          <Database className="h-5 w-5 text-success" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Database connection</p>
            <p className="text-xs text-muted-foreground">
              Connected to Neon PostgreSQL via Drizzle ORM — this page rendered live data, so the connection is
              healthy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResourcesTab({ resources, resourceCount }: { resources: Resource[]; resourceCount: number }) {
  return (
    <div>
      {resourceCount !== 10 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          The catalog currently has {resourceCount} resources. The project requires exactly ten published
          resources at all times.
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Pricing</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell className="text-muted-foreground">{r.category}</TableCell>
              <TableCell>
                <Badge>{r.pricing}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(r.verifiedOn).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditResourceDialog resource={r} />
                  <DeleteResourceDialog resource={r} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EditResourceDialog({ resource }: { resource: Resource }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateResource(formData);
      if (!result.ok) setError(result.error);
      else {
        setSuccess(true);
        setTimeout(() => setOpen(false), 800);
      }
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="secondary">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-display text-lg font-semibold">Edit {resource.name}</Dialog.Title>
            <Dialog.Close className="text-subtle-foreground hover:text-foreground" aria-label="Close">
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <form action={handleSubmit} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={resource.id} />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pricing">Pricing classification</Label>
              <select
                id="pricing"
                name="pricing"
                defaultValue={resource.pricing}
                className="h-11 rounded-xl border border-border bg-background-secondary px-4 text-sm"
              >
                <option>Free</option>
                <option>Freemium</option>
                <option>Paid</option>
                <option>Open Source</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="officialWebsite">Official website URL</Label>
              <Input id="officialWebsite" name="officialWebsite" defaultValue={resource.officialWebsite} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="officialDocsUrl">Official docs URL</Label>
              <Input id="officialDocsUrl" name="officialDocsUrl" defaultValue={resource.officialDocsUrl} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="limitationsText">Limitations (one per line)</Label>
              <textarea
                id="limitationsText"
                name="limitationsText"
                defaultValue={(resource.limitations as string[]).join("\n")}
                rows={4}
                className="rounded-xl border border-border bg-background-secondary p-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="verifiedOn">Verification date</Label>
              <Input
                id="verifiedOn"
                name="verifiedOn"
                type="date"
                defaultValue={new Date(resource.verifiedOn).toISOString().slice(0, 10)}
                required
              />
            </div>

            {error && <p role="alert" className="text-sm text-error">{error}</p>}
            {success && (
              <p className="flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Saved.
              </p>
            )}

            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Save changes
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DeleteResourceDialog({ resource }: { resource: Resource }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await deleteResource(formData);
      if (!result.ok) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="secondary" className="text-error hover:border-error/50">
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-error/40 bg-card p-6 shadow-2xl">
          <Dialog.Title className="flex items-center gap-2 font-display text-lg font-semibold text-error">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" /> Delete {resource.name}?
          </Dialog.Title>
          <p className="mt-2 text-sm text-muted-foreground">
            This removes the resource permanently and will take the catalog below the required ten entries
            until a replacement is added. Type the resource&apos;s exact name to confirm.
          </p>
          <form action={handleSubmit} className="mt-4 flex flex-col gap-3">
            <input type="hidden" name="id" value={resource.id} />
            <Input
              name="confirmName"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={resource.name}
            />
            {error && <p role="alert" className="text-sm text-error">{error}</p>}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending || confirmText !== resource.name}
                className="flex-1 bg-error text-white hover:brightness-110"
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                Delete permanently
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function GuidesTab({ guides }: { guides: Guide[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(id: string, nextPublished: boolean) {
    setPendingId(id);
    const formData = new FormData();
    formData.set("id", id);
    formData.set("published", String(nextPublished));
    startTransition(async () => {
      await toggleGuidePublished(formData);
      setPendingId(null);
    });
  }

  return (
    <div className="grid gap-4">
      {guides.map((g) => (
        <Card key={g.id}>
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">{g.title}</p>
              <p className="text-xs text-muted-foreground">{g.objective}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={g.published ? "success" : "outline"}>{g.published ? "Published" : "Unpublished"}</Badge>
              <Button
                size="sm"
                variant="secondary"
                disabled={pendingId === g.id}
                onClick={() => handleToggle(g.id, !g.published)}
              >
                {g.published ? "Unpublish" : "Publish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SettingsTab({ adminEmail }: { adminEmail: string }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await changeAdminPassword(formData);
      if (!result.ok) setError(result.error);
      else setSuccess(true);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-base font-semibold">Change password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {adminEmail}.</p>
          <form action={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" name="newPassword" type="password" minLength={12} required autoComplete="new-password" />
            </div>
            {error && <p role="alert" className="text-sm text-error">{error}</p>}
            {success && (
              <p className="flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Password changed. All sessions were
                signed out — sign in again next time.
              </p>
            )}
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-base font-semibold">Active session</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You are currently signed in on this device. Sessions expire automatically after 8 hours, and
            changing your password immediately invalidates every session, including this one.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AuditTab({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">No administrative actions recorded yet.</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {new Date(log.createdAt).toLocaleString()}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{log.action}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{log.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
