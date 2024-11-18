import { NextResponse } from "next/server";

export const success = (data?: object) => {
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const failure = (status: number, message: string) => {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
