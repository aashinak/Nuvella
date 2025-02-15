function Page() {
  return (
    <div className="flex-grow overflow-y-auto w-full p-5 bg-yellow-100">
       {Array.from({ length: 50 }).map((_, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-md p-4 border border-gray-200"
        >
          <h2 className="text-lg font-bold">Item {index + 1}</h2>
          <p>
            This is some example content for item {index + 1}. You can add more
            text here to make the content longer if needed.
          </p>
        </div>
      ))}
    </div>
  );
}

export default Page;
