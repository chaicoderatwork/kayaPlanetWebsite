import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/anniversary",
  title: "10th Anniversary Membership",
  description:
    "Kaya Planet's 10th anniversary membership information, registration details and terms for the Govind Nagar salon in Kanpur.",
});

export default function AnniversaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
