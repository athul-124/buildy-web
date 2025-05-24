import Link from 'next/link';
import { Shield, Home, Users, Settings, BarChart3, Power, CalendarClock } from 'lucide-react'; // Added Power, CalendarClock
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// In a real app, this would come from auth state
const adminUser = {
  name: "Admin User",
  email: "admin@homejoy.com",
  avatar: "https://placehold.co/40x40.png"
};


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary">
            <Shield className="h-7 w-7" />
            <span className="group-data-[collapsible=icon]:hidden">Admin Panel</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2 flex-1"> {/* flex-1 to push footer down */}
          <SidebarMenu>
            {/* <SidebarMenuItem>
              <SidebarMenuButton href="/admin/dashboard" tooltip="Dashboard">
                <BarChart3 />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem> */}
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/scheduler" tooltip="AI Scheduler">
                <CalendarClock />
                AI Scheduler
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* <SidebarMenuItem>
              <SidebarMenuButton href="/admin/settings" tooltip="Settings">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
            <SidebarMenuButton href="/" tooltip="Back to Site">
                <Home />
                Back to Site
            </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
          <SidebarTrigger className="sm:hidden" /> {/* Only show on mobile */}
          <div className="flex-1">
            {/* Breadcrumbs or Page Title can go here */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={adminUser.avatar} alt={adminUser.name} data-ai-hint="person avatar" />
                  <AvatarFallback>{adminUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{adminUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                 <Power className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-6 md:gap-8 bg-muted/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
