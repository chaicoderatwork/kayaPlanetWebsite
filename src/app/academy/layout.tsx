import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/academy",
  title: "Makeup Artist Course in Kanpur",
  titleSuffix: "Kaya Planet Academy",
  description:
    "Explore makeup, hair, nail and beauty courses at Kaya Planet Academy in Govind Nagar, Kanpur. See student work and enquire about course details and enrolment.",
});

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
