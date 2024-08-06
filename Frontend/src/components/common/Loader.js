const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 flex-col gap-6">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <div className="text-[30px]">Loading...</div>
        </div>
    );
};

export default Loader;
