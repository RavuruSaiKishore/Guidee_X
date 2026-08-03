const PricingPreview = () => {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Pricing</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="border rounded-xl p-8">Basic</div>

          <div className="border-2 border-blue-600 rounded-xl p-8">Pro</div>

          <div className="border rounded-xl p-8">Premium</div>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
