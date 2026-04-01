import type { Metadata } from 'next';
import { getProperty } from '@/services/mockProperties';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const property = await getProperty(params.id);
    if (!property) {
      return {
        title: 'Finca non atopada | FincAirbnb',
        description: 'Esta finca non existe ou foi eliminada.',
      };
    }
    return {
      title: `${property.title} | FincAirbnb`,
      description:
        property.shortDescription ||
        property.description?.slice(0, 155) ||
        `Finca en ${property.location?.city}, ${property.location?.province}. ${property.size?.land ?? 0} ha.`,
      openGraph: {
        title: property.title,
        description:
          property.shortDescription ||
          property.description?.slice(0, 155) ||
          `Finca en ${property.location?.city}`,
        images: property.photos?.[0]?.url ? [{ url: property.photos[0].url }] : [],
        type: 'website',
      },
    };
  } catch {
    return { title: 'FincAirbnb' };
  }
}

export default function FincaDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
