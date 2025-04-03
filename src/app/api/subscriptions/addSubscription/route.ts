import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Log incoming request data
    const body = await request.json();
    console.log("Received request body:", body);

    // Send the request to your backend to set subscriptions
    const subscriptions = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/set-subscriptions`,
      body
    );

    // Log the response from the backend
    console.log("Response from backend:", subscriptions);

    // Check if the response status is 500 and handle it
    if (subscriptions.status === 500) {
      console.error("Backend error:", subscriptions.data);
      return NextResponse.json(
        { success: false, error: subscriptions.data },
        { status: 500 }
      );
    }

    // Log the successful response
    console.log("Subscription added successfully:", subscriptions.data);
    return NextResponse.json(subscriptions.data);
  } catch (error) {
    // Handle and log errors in the process
    console.error("Error occurred during subscription process:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
