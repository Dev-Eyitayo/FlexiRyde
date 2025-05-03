import { useGoogleLogin } from "@react-oauth/google";
import googleIcon from "../../assets/google-icon.svg";

const GoogleAuthButton = ({
  onSuccess,
  onError,
  loading,
  action = "Login",
}) => {
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log("Google Login Success:", credentialResponse);
      onSuccess(credentialResponse);
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      onError(error);
    },
    flow: "implicit",
    scope: "openid email",
    responseType: "id_token",
  });

  return (
    <div className='mt-4'>
      <div className='flex items-center justify-between mb-3'>
        <hr className='flex-grow border-gray-300' />
        <p className='w-auto text-center text-gray-500 text-sm mx-4'>
          or {action.toLowerCase()} with
        </p>
        <hr className='flex-grow border-gray-300' />
      </div>
      <button
        onClick={() => login()}
        disabled={loading}
        className={`mt-4 w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
        }`}
        aria-label={
          loading
            ? `Processing ${action.toLowerCase()} with Google`
            : `${action} with Google`
        }
      >
        {loading ? (
          <div className='flex items-center'>
            <div className='w-6 h-6 border-4 border-t-transparent border-gray-800 rounded-full animate-spin mr-3'></div>
            <span className='text-gray-800 font-semibold text-base'>
              signing you in...
            </span>
          </div>
        ) : (
          <>
            <img src={googleIcon} alt='Google icon' className='mr-3 w-6 h-6' />
            <span className='text-gray-600 font-semibold text-base'>
              {action} with Google
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default GoogleAuthButton;
