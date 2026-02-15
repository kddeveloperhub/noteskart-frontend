const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">₹100 Only</h1>

      <ul className="mb-6 text-lg space-y-2">
        <li>✔ All Semesters</li>
        <li>✔ All Subjects</li>
        <li>✔ One Time Payment</li>
      </ul>

      <button className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700">
        Pay ₹100
      </button>
    </div>
  );
};

export default Pricing;
