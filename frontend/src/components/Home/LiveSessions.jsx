const LiveSessions = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center">
          Upcoming Live Sessions
        </h2>

        <div className="mt-10 bg-white shadow rounded-xl p-8">
          <h3>React Masterclass</h3>

          <p>Tomorrow • 6 PM</p>

          <button className="mt-4 bg-green-600 text-white px-5 py-2 rounded">
            Join
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveSessions;
