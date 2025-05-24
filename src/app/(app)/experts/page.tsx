import { ExpertCard } from '@/components/ExpertCard';
import { mockExperts } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// This would typically come from an API call
async function getExperts() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockExperts;
}

export default async function ExpertsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const experts = await getExperts();

  const searchTerm = typeof searchParams?.q === 'string' ? searchParams.q.toLowerCase() : '';
  const specialtyFilter = typeof searchParams?.specialty === 'string' ? searchParams.specialty : '';

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = searchTerm ? 
      expert.name.toLowerCase().includes(searchTerm) || 
      expert.specialty.toLowerCase().includes(searchTerm) ||
      expert.bio.toLowerCase().includes(searchTerm)
      : true;
    const matchesSpecialty = specialtyFilter ? expert.specialty === specialtyFilter : true;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = Array.from(new Set(experts.map(e => e.specialty)));

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 rounded-lg shadow">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Find Your Perfect Home Service Expert</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated list of skilled professionals in Thrissur. Rated and reviewed by your neighbors.
          </p>
        </div>
      </section>

      {/* Filters Section - Basic implementation */}
      <section className="sticky top-16 bg-background/90 backdrop-blur-md z-10 py-4 rounded-lg shadow-sm border">
        <form className="container mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              name="q"
              defaultValue={searchTerm}
              placeholder="Search by name, service..." 
              className="pl-10 w-full" 
            />
          </div>
          <Select name="specialty" defaultValue={specialtyFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="">All Specialties</SelectItem> Removed this line */}
              {specialties.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </form>
      </section>
      
      {/* Mobile Filter Sheet (Example of progressive disclosure) */}
      <div className="md:hidden container mx-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Experts</SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect expert.
              </SheetDescription>
            </SheetHeader>
            <form className="grid gap-4 py-4">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="search" 
                  name="q"
                  defaultValue={searchTerm}
                  placeholder="Search..." 
                  className="pl-10 w-full" 
                />
              </div>
              <Select name="specialty" defaultValue={specialtyFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="">All Specialties</SelectItem> Removed this line */}
                  {specialties.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Apply Filters</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>


      {filteredExperts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No experts found matching your criteria.</p>
          <p className="mt-2">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
