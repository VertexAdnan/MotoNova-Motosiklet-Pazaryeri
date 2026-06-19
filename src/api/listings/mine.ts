import { getDashboardStatusLabel, listUserListings } from "../../helpers/listings-service";

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!req.session) {
    return Response.json(
      { error: "Unauthorized", message: "Paneli görmek için giriş yapmalısın." },
      { status: 401 }
    );
  }

  try {
    const listings = await listUserListings(String(req.session.data.userId));
    const dashboardListings = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      status: getDashboardStatusLabel(listing.status),
      price: listing.price,
      views: 0,
      messages: 0,
    }));

    const publishedCount = listings.filter((item) => item.status === "published").length;
    const pendingCount = listings.filter((item) => item.status === "pending").length;

    return Response.json({
      success: true,
      listings: dashboardListings,
      stats: {
        activeListings: publishedCount,
        pendingListings: pendingCount,
        totalListings: listings.length,
      },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "İlanların yüklenemedi." },
      { status: 500 }
    );
  }
}
