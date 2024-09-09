
const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className=" h-full flex items-center flex-col justify-center bg-sky-500">{children}</div>
  )
}

export default AuthLayout;