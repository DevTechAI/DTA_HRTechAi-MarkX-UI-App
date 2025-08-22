
import { PanelLeft } from "lucide-react";
import * as React from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "./button";

// Sidebar context and provider
type SidebarContextType = {
	state: "expanded" | "collapsed";
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isMobile: boolean;
	openMobile: boolean;
	setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
	toggleSidebar: () => void;
};
const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);
export function useSidebar(): SidebarContextType {
	const context = React.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React.useState(false);
	const [open, setOpen] = React.useState(true);
	const toggleSidebar = () => (isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o));
	const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";
	const value = React.useMemo(() => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }), [state, open, isMobile, openMobile]);
	return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

// SidebarTrigger button
export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
	function SidebarTrigger(props, ref) {
		const { toggleSidebar } = useSidebar();
		return (
			<Button ref={ref} variant="ghost" size="icon" onClick={toggleSidebar} {...props}>
				<PanelLeft />
				<span className="sr-only">Toggle Sidebar</span>
			</Button>
		);
	}
);

// Sidebar and related components
export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	function Sidebar({ children, ...props }, ref) {
		return (
			<div ref={ref} className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground" {...props}>
				{children}
			</div>
		);
	}
);
export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	function SidebarContent({ children, ...props }, ref) {
		return (
			<div ref={ref} className="flex flex-col gap-2 p-2" {...props}>
				{children}
			</div>
		);
	}
);
export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	function SidebarGroup({ children, ...props }, ref) {
		return (
			<div ref={ref} className="flex flex-col gap-2" {...props}>
				{children}
			</div>
		);
	}
);
export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	function SidebarGroupLabel({ children, ...props }, ref) {
		return (
			<div ref={ref} className="text-xs font-medium text-sidebar-foreground/70 px-2" {...props}>
				{children}
			</div>
		);
	}
);
export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	function SidebarGroupContent({ children, ...props }, ref) {
		return (
			<div ref={ref} className="w-full text-sm" {...props}>
				{children}
			</div>
		);
	}
);
export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
	function SidebarMenu({ children, ...props }, ref) {
		return (
			<ul ref={ref} className="flex flex-col gap-1" {...props}>
				{children}
			</ul>
		);
	}
);
export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
	function SidebarMenuItem({ children, ...props }, ref) {
		return (
			<li ref={ref} className="relative" {...props}>
				{children}
			</li>
		);
	}
);
export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
	function SidebarMenuButton({ children, ...props }, ref) {
		return (
			<button ref={ref} className="flex items-center gap-2 rounded-md p-2 text-sm" {...props}>
				{children}
			</button>
		);
	}
);
