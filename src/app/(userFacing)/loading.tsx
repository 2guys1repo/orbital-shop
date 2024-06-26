export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="w-24 h-24 border-4 border-solid border-gray-500 border-t-transparent rounded-full animate-spin"
        style={{
          borderWidth: '5px',
        }}
      ></div>
    </div>
  )
};
