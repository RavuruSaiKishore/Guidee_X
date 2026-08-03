const Stats = () => {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-center">
        <div>
          <h2 className="text-5xl font-bold">10K+</h2>
          <p>Students</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold">500+</h2>
          <p>Mentors</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold">150+</h2>
          <p>Courses</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold">50K+</h2>
          <p>Sessions</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
