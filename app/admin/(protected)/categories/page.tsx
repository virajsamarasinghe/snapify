import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import CategoryManagement from "@/app/components/admin/CategoryManagement";

// Ensure model registration
import "@/models/Category"; 

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await dbConnect();
  
  // We need to serialize the Mongoose documents to plain objects
  // lean() returns POJOs, but we also have virtuals we might want.
  // However, for the Client Component, we need standard JSON-serializable data.
  // The 'image' field and 'name' are straightforward.
  // The '_id' needs to be converted to string 'id'.
  
  const categoriesDocs = await Category.find().sort({ createdAt: -1 }).lean();
  
  // Need to get product counts manually if we want them, or populate.
  // Since we are using lean(), virtuals aren't populated automatically unless handled.
  // Let's manually fetch counts or just ignore for now to keep it simple, 
  // OR we can use aggregation.
  
  // Let's do a simple aggregation to get counts if needed, or just map.
  // For simplicity:
  const categories = categoriesDocs.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name,
    image: doc.image || null,
    _count: { products: 0 } // Placeholder or implement count logic
  }));

  return <CategoryManagement initialCategories={categories} />;
}
