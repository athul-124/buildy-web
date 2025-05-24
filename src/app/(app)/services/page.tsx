import { ServiceCard } from '@/components/ServiceCard';
import { mockServices } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Search } from 'lucide-react';

// This would typically come from an API call
async function getServices() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockServices;
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const services = await getServices();

  const searchTerm = typeof searchParams?.q === 'string' ? searchParams.q.toLowerCase() : '';
  const categoryFilter = typeof searchParams?.category === 'string' ? searchParams.category : '';

  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm ? 
      service.name.toLowerCase().includes(searchTerm) || 
      service.description.toLowerCase().includes(searchTerm)
      : true;
    const matchesCategory = categoryFilter ? service.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-secondary/10 to-primary/10 py-12 rounded-lg shadow">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Our Home Services & Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore a wide range of home services offered by Thrissur's finest professionals. Know the cost upfront.
          </p>
        </div>
      </section>

      {/* Filters Section */}
       <section className="sticky top-16 bg-background/90 backdrop-blur-md z-10 py-4 rounded-lg shadow-sm border">
        <form className="container mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              name="q"
              defaultValue={searchTerm}
              placeholder="Search services..." 
              className="pl-10 w-full" 
            />
          </div>
          <Select name="category" defaultValue={categoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Placeholder for price range slider */}
          {/* <div className="w-full md:w-[200px]">
             <Label htmlFor="price-range" className="sr-only">Price Range</Label>
             <Slider defaultValue={[50]} max={100} step={1} className="w-full" id="price-range" /> 
             <p className="text-xs text-muted-foreground text-center mt-1">Price Range (Drag to adjust)</p>
          </div> */}
          <Button type="submit" className="w-full md:w-auto">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </form>
      </section>

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No services found matching your criteria.</p>
          <p className="mt-2">Please try different filters or search terms.</p>
        </div>
      )}
    </div>
  );
}
