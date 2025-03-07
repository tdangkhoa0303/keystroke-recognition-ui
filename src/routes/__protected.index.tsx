import { createFileRoute } from '@tanstack/react-router';
import { faker } from '@faker-js/faker';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/__protected/')({
  component: () => <Index />,
});

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
};

function ProductCard({ product }: { product: Product }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card className="max-w-sm shadow-md light:border-none">
      <div className="relative aspect-video">
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setIsImageLoaded(true)}
          className="object-cover rounded-lg aspect-video"
        />
        {!isImageLoaded && (
          <Skeleton className="rounded-lg aspect-video absolute top-0 left-0 bottom-0 right-0" />
        )}
      </div>
      <CardHeader>
        <CardTitle className="mt-2 text-lg font-bold">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{product.category}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-end justify-between">
        <div>
          <p className="text-xl font-semibold mt-2">
            ${product.price.toFixed(2)}
          </p>
          {product.stock > 0 ? (
            <p className="text-green-500 text-sm mt-1">
              {product.stock} in stock
            </p>
          ) : (
            <p className="text-red-500 text-sm mt-1">Out of stock</p>
          )}
        </div>
        <Button disabled={product.stock === 0}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

const generateShopData = (count = 10): Product[] =>
  Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(
      faker.commerce.price({
        min: 10,
        max: 500,
        dec: 2,
      })
    ), // Prices between $10 and $500
    category: faker.commerce.department(),
    image: faker.image.urlPicsumPhotos({
      width: 512,
      height: 512 * 0.75,
      blur: 0,
      grayscale: false,
    }), // Random placeholder images
    stock: faker.number.int({ min: 0, max: 100 }), // Random stock count
  }));

function Index() {
  const products = useMemo(() => generateShopData(10), []);

  return (
    <div className="space-y-4 max-w-screen-2xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight">Shop</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
