import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { apiPost } from "./api";

export default function ButtonWithAction({
  method,
  body,
  callback,
  children,
  ...props
}: {
  method: string;
  body: any;
  callback: (data: any) => void;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      color="primary"
      {...props}
      onClick={() =>
        apiPost("/loom", { method, payload: body }, setLoading, callback)
      }
      isLoading={loading}
    >
      {children}
    </Button>
  );
}
