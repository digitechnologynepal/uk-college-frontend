import toast from "react-hot-toast"

export const ErrorHandler = (error) => {
    if (error?.response?.status === 400) {
        toast.dismiss()
        return toast.error(error?.response?.data?.message)
    } else if (error?.response?.status === 401) {
        toast.dismiss()
        return toast.error(error?.response?.data?.message)
    } else if (error?.response?.status === 403) {
        toast.dismiss()
        return toast.error(error?.response?.data?.message)
    } else if (error?.response?.status === 404) {
        toast.dismiss()
        return toast.error(error?.response?.data?.message)
    } else if (error?.response?.status === 500) {
        toast.dismiss()
        return toast.error(error?.response?.data?.message)
    } else {
        toast.dismiss()
        console.log(error)
    }
}