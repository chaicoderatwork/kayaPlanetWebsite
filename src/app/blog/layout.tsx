import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    path: "/blog",
    title: "Bridal Makeup Tips & Guides in Kanpur",
    description: "Bridal makeup tips and guides from Kaya Planet in Kanpur. Learn how Bhawna and Rashika plan wedding looks, skincare prep and makeup finishes.",
});

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
