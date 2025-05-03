import { useGoogleLogin } from "@react-oauth/google";
import googleIcon from "../../assets/google-icon.svg";

const GoogleAuthButton = ({
  onSuccess,
  onError,
  loading,
  action = "Login",
}) => {
  return (
    <div className='mt-4'>
      <div className='flex items-center justify-between mb-3'>
        <hr className='flex-grow border-gray-300' />
        <p className='w-auto text-center text-gray-500 text-sm mx-4'>
          or {action.toLowerCase()} with
        </p>
        <hr className='flex-grow border-gray-300' />
      </div>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled || loading}
            className='mt-4 w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition'
          >
            <img src={googleIcon} alt='Google icon' className='mr-3 w-6 h-6' />
            <span className='text-gray-900 font-bold text-base'>
              {action} with Google
            </span>
          </button>
        )}
      />
    </div>
  );
};

export default GoogleAuthButton;
