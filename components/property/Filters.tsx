'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by keyword..."
          defaultValue={searchParams.get('query') || ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
        <select
          name="type"
          defaultValue={searchParams.get('type') || ''}
          onChange={handleFilterChange}
          className="w-full p-3 border rounded-md bg-white"
        >
          <option value="">All Types</option>
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Land">Land</option>
        </select>
        <select
          name="status"
          defaultValue={searchParams.get('status') || ''}
          onChange={handleFilterChange}
          className="w-full p-3 border rounded-md bg-white"
        >
          <option value="">Any Status</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
        </select>
        <select
          name="location"
          defaultValue={searchParams.get('location') || ''}
          onChange={handleFilterChange}
          className="w-full p-3 border rounded-md bg-white"
        >
          <option value="">All Locations</option>
          <option value="Kathmandu">Kathmandu</option>
          <option value="Pokhara">Pokhara</option>
          <option value="Lalitpur">Lalitpur</option>
        </select>
      </div>
    </div>
  );
}
