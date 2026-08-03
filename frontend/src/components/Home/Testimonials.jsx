const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Testimonials</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white shadow rounded-xl p-6">
              ⭐⭐⭐⭐⭐
              <p className="mt-4">Amazing mentorship platform.</p>
              <h4 className="mt-4 font-bold">Student</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
