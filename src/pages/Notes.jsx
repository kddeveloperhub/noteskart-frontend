const Notes = () => {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        BCA Notes (Sample)
      </h1>

      <ul className="max-w-xl mx-auto space-y-4">
        <li className="bg-white p-4 shadow rounded">
          BCA Sem 1 – Programming Basics 🔒
        </li>
        <li className="bg-white p-4 shadow rounded">
          BCA Sem 2 – Data Structures 🔒
        </li>
        <li className="bg-white p-4 shadow rounded">
          BCA Sem 3 – DBMS 🔒
        </li>
        <li className="bg-white p-4 shadow rounded">
          BCA Sem 4 – Operating Systems 🔒
        </li>
      </ul>
    </div>
  );
};

export default Notes;
