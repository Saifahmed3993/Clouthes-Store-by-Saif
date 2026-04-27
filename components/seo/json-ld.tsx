import Script from "next/script";
import { APP_NAME } from "@/utils/constants";

export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: APP_NAME,
    url: siteUrl,
    description: "Premium t-shirt storefront",
    sameAs: ["https://www.instagram.com/"]
  };

  return <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
