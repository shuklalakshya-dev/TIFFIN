import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const col = db.collection("products");
    const totalProducts = await col.countDocuments();
    const inStockProducts = await col.countDocuments({ inStock: true });
    const outOfStockProducts = await col.countDocuments({ inStock: false });

    return NextResponse.json({
      totalProducts,
      inStockProducts,
      outOfStockProducts,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}