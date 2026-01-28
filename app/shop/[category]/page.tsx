export default function CategoryPage({ params }: { params: { category: string } }) {
    const categoryNames: Record<string, string> = {
      'all': 'shop all',
      'polos-t-shirts': 'polos & t-shirts',
      'hoodies-zips': 'hoodies & zips',
      'hats-accessories': 'hats & accessories'
    };
  
    const title = categoryNames[params.category] || 'collection';
  
    return (
      /* We add a light gray background to the main area to make the white cards pop */
      <main className="min-h-screen bg-[#fcfcfc] pt-32 pb-20"> 
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Page Header */}
          <header className="mb-12 border-b border-gray-100 pb-12">
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-4">
                Heather & Hickory
              </span>
              <h1 className="text-5xl md:text-7xl font-bodoni italic text-hickory lowercase">
                {title}.
              </h1>
            </div>
          </header>
  
          {/* Product Grid placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {/* Your products will go here */}
             <div className="h-96 bg-gray-100 animate-pulse rounded-sm"></div>
             <div className="h-96 bg-gray-100 animate-pulse rounded-sm"></div>
             <div className="h-96 bg-gray-100 animate-pulse rounded-sm"></div>
          </div>
        </div>
      </main>
    );
  }