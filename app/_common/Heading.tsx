export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
      <h1 className="text-2xl font-bold">{children}</h1>
    </div>
  );
}
