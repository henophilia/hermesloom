export default function Body({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col md:flex-row gap-4">{children}</div>;
}
