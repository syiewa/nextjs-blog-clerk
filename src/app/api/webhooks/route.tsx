import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id, first_name, last_name, image_url, email_addresses, username } =
    evt?.data as unknown as {
      id: string;
      first_name: string;
      last_name: string;
      image_url: string;
      email_addresses: {
        email_address: string;
        id: string;
        verification: { status: string; strategy: string };
        object: string;
        linked_to: string[];
      }[];
      username: string;
    };

  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  if (eventType === "user.created" || eventType === "user.updated") {
    // Do something with user.created event\
    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses[0].email_address,
        username
      );
      if (user && eventType === "user.created") {
        try {
          const clerk = await clerkClient();
          await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
              isAdmin: user.isAdmin,
              userMongoId: user._id.toString(),
            },
          });
        } catch (error) {
          console.log("Error creating user metadata: ", error);
        }
      } else if (user && eventType === "user.updated") {
        console.log("User updated successfully");
      }
      return new Response("User created or updated", {
        status: 200,
      });
    } catch (error) {
      console.log("Erorr creating or updating user: ", error);
      return new Response("Error creating or updating user", {
        status: 400,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await deleteUser(id);

      return new Response("User deleted", {
        status: 200,
      });
    } catch (error) {
      console.log("Erorr deleting user: ", error);

      return new Response("Error deleting user", {
        status: 400,
      });
    }
  }
  return new Response("Webhook received", { status: 200 });
}
