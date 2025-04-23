// src/components/Authentication/TabNavigation.jsx
const TabNavigation = ({ activeTab, setActiveTab, setError, resetForms }) => {
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    resetForms(tab);
  };

  return (
    <div className='mb-6'>
      {activeTab === "reset" ? (
        <button
          className='text-blue-500 text-sm font-semibold hover:underline'
          onClick={() => handleTabChange("login")}
        >
          Back to Login
        </button>
      ) : (
        <div className='flex space-x-8'>
          <button
            className={`pb-2 text-xl font-semibold ${
              activeTab === "login"
                ? "text-blue-600 border-b-3 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("login")}
          >
            Login
          </button>
          <button
            className={`pb-2 text-xl font-semibold ${
              activeTab === "signup"
                ? "text-blue-600 border-b-3 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("signup")}
          >
            Signup
          </button>
        </div>
      )}
    </div>
  );
};

export default TabNavigation;
