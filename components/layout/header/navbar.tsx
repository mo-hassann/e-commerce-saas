import { cn } from "@/lib/utils";

export default function Navbar() {
  const activeId = 1;
  const items = [
    { id: 1, name: "shirts" },
    { id: 2, name: "jeans" },
    { id: 3, name: "boxers" },
    { id: 4, name: "shirts" },
  ];
  return (
    <nav className="w-full bg-muted/70">
      <ul className="container flex items-center justify-center gap-10 py-3 capitalize font-semibold text-muted-foreground">
        {items.map((item) => (
          <li key={item.id} className={cn("flex items-center gap-1 cursor-pointer", activeId === item.id && "text-primary")}>
            <span className={cn("block size-1.5 border border-muted-foreground/40 rounded-full", activeId === item.id && "border-primary")} />
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
